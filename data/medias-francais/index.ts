import { Database, aql, DocumentCollection } from "arangojs";
import saveJSON from "./fileIO/saveJSON";
import {
  loadMediasFrancaisEntities,
  loadMediasFrancaisRelations
} from "./loadMF";
import { Entity, DatasetId, Edge, isEntity } from "./utils/types";
import C from "./utils/constants";
import { areConsistent } from "./utils/consistency";
import askYesNo from "./utils/ask";
import api, { getResponseData } from "./utils/api";
import {
  getDsKeyObject,
  selectiveDiff,
  selectiveExtract,
  getElementDatasetId
} from "./utils/utils";

const db = new Database({
  url: C.DEV
    ? "http://localhost:8529"
    : "https://diploman.westeurope.cloudapp.azure.com"
});
db.useDatabase("_system");
db.useBasicAuth("root", "");
const ENT_OVERRIDING_PROPS: Array<keyof Entity> = [];
const ENT_UNCHANGEABLE_PROPS: Array<keyof Entity> = ["type"];
const REL_OVERRIDING_PROPS: Array<keyof Edge> = ["type", "text", "owned"];
const REL_UNCHANGEABLE_PROPS: Array<keyof Edge> = [];
const LOGDIR = C.DEV ? "logs/dev/" : "logs/prod/";
const ts = () => Date.now();
const entColl = db.collection(C.entCollectionName);
const relColl = db.collection(C.relCollectionName);

async function getElementUpdates<T extends Edge | Entity>(
  datasetElements: T[],
  datasetId: DatasetId,
  coll: DocumentCollection,
  OVERRIDING_PROPS: Array<keyof T>,
  UNCHANGEABLE_PROPS: Array<keyof T>
) {
  const elementsToPost: T[] = [];
  const existingElements: T[] = [];
  const elementsToPatch: T[] = [];

  for (let element of datasetElements) {
    const elDatasetId = getElementDatasetId(element, datasetId);
    // Check if we already have put/linked this element in the database.
    const cursor = await getByDatasetId(coll, datasetId, elDatasetId, true);
    var logIdentifier = elDatasetId;
    if (isEntity(element)) logIdentifier = element.name;
    // There should be maximum 1 such element.
    if (cursor.count > 1) {
      console.log("Found multiple elements with the same ID:");
      while (cursor.hasNext())
        console.log("Key:", ((await cursor.next()) as T)._key);
      throw new Error("Duplicate elements corresponding to " + elDatasetId);
    }
    // If the element already exists
    else if (cursor.count == 1) {
      console.log("Found a correspondance for:", logIdentifier);
      const dbElement: T = await cursor.next();
      // If we detect a fundamental consistency problem with an
      // existing element, we just abort for now.
      // If the name is different, update the name? Only for some datasets?
      if (!areConsistent(dbElement, element, UNCHANGEABLE_PROPS))
        throw new Error(
          `Inconsistent elements: ${elDatasetId} (${logIdentifier})`
        );
      // Maybe we want to overwrite the values in the DB.
      if (selectiveDiff(dbElement, element, OVERRIDING_PROPS)) {
        const patchedElement = Object.assign(
          {},
          dbElement,
          selectiveExtract(element, OVERRIDING_PROPS),
          Object.assign({}, { ds: dbElement.ds }, { ds: element.ds })
        );
        elementsToPatch.push(patchedElement);
      }
      // If the element exists and doesn't need to be patched, simply push
      // it to RAM for later use.
      else existingElements.push(dbElement);
    }
    // If the element doesn't already exists, we can simply create it.
    // (if it was manually linked, it now does.)
    // We could also do the similarity search here and it would save us
    // one request per item to the database, but I'm not sure it would actually
    // be easier or lead to less code being duplicated (we would have to
    // merge also here + it might be harder to deal with Edge types later)
    else elementsToPost.push(element);
  }
  return { elementsToPost, existingElements, elementsToPatch };
}

/**
 * Fetches the entity in the database with it's datasetId
 * @param  datasetId       The ID of the dataset to search in
 * @param  entityDatasetId The ID of the entity in that dataset
 * @param  count           wether to include "count" in the cursor or not
 * @return                 The fresh database cursor
 */
const getByDatasetId = async (
  coll: DocumentCollection,
  datasetId: string,
  entityDatasetId: string,
  count: boolean
) => {
  const cursor = await db.query(
    aql`
      FOR entity IN ${coll}
        FILTER entity.ds.${datasetId} == ${entityDatasetId}
        RETURN entity
    `,
    { count: count }
  );
  return cursor;
};

/**
 * Search for entities similar to the ones in the dataset
 * and asks the user if he wants to merge them.
 * @param  datasetEntities from the dataset we're importing
 * @param  datasetId       the id of this dataset
 * @return                 The entities judged similar by the user and ready to be saved
 */
const findSimilarEntities = async (
  datasetEntities: Entity[],
  datasetId: DatasetId
) => {
  const similarEntities: Entity[] = [];

  for (let entity of datasetEntities) {
    // Skip entities that are already linked in the database.
    const entityDatasetId = getElementDatasetId(entity, datasetId);
    const cursor1 = await getByDatasetId(
      entColl,
      datasetId,
      entityDatasetId,
      false
    );
    if (cursor1.hasNext()) continue;
    // Check if we have a similar but unlinked entity in the database.
    const cursor = await db.query(
      aql`
        FOR entity IN ${entColl}
          FILTER entity.ds.${datasetId} == null
          FILTER entity.name LIKE  ${"%" + entity.name + "%"}
            OR ${entity.name} LIKE CONCAT("%", entity.name, "%")
          RETURN entity
      `,
      { count: true }
    );
    if (cursor.count > 1) {
      console.log("=========================================");
      console.log("WARNING: multiple similar entities found!");
      console.log("=========================================");
    }
    while (cursor.hasNext()) {
      const dbEntity: Entity = await cursor.next();
      console.log(`Found ${cursor.count} similar entities:`);
      console.log(entity);
      console.log("... is similar to ...");
      console.log(dbEntity);
      if (await askYesNo("Merge them together?")) {
        // Check that we aren't merging incompatible stuff.
        if (!areConsistent(dbEntity, entity, ENT_UNCHANGEABLE_PROPS))
          throw new Error(`Inconsistent entities: ${entity.name}`);
        // Link the database entity (by merging, because we might be using
        // multiple datasetIds in one operation)
        // If there're different props, they'll be merged later when this
        // entity will be freshly refetched.
        dbEntity.ds = Object.assign({}, dbEntity.ds, entity.ds);
        similarEntities.push(dbEntity);
        // Only one entity can be logically linked.
        // (The server would reject a second PATCH thanks to _rev anyway)
        break;
      }
    }
  }
  return similarEntities;
};

/**
 * The main process
 */
const updateMediasFrancais = async () => {
  var patchedEntities: Entity[] = [];
  var postedEntities: Entity[] = [];

  try {
    const dataset = await loadMediasFrancaisEntities();
    console.log(dataset.length + " entities loaded.");

    // First of all, we search existing entities in the database that
    // could be similar to the ones we have in the dataset.
    // We save thoses "merges" back to the database BEFORE checking which
    // entities already exists in the database.
    // PS: This could potentially be a separate tool.
    console.log("🔍🔍🔍 Searching similar entities:");
    const entitiesToPatch = await findSimilarEntities(dataset, "mfid");
    console.log("==== Entities to LINK: ====");
    console.log(entitiesToPatch);
    if (entitiesToPatch.length > 0) {
      if (!(await askYesNo("Link them?"))) return;
      console.log("==== LINKing entities ====");
      const linkedEntities = await api
        .patch(`/entities`, entitiesToPatch)
        .then(getResponseData);
      await saveJSON(`${LOGDIR}${ts()}-link-entities.json`, linkedEntities);
    }

    const entUpdates = await getElementUpdates(
      dataset,
      "mfid",
      entColl,
      ENT_OVERRIDING_PROPS,
      ENT_UNCHANGEABLE_PROPS
    );
    console.log("==== Entities already in the DB: ====");
    console.log(entUpdates.existingElements.length + "/" + dataset.length);
    //console.log(entUpdates.existingElements);

    console.log("==== Entities to POST: ====");
    console.log(entUpdates.elementsToPost);
    if (entUpdates.elementsToPost.length > 0) {
      if (!(await askYesNo("Post them?"))) return;
      console.log("==== POSTing entities ====");
      postedEntities = await api
        .post(`/entities`, entUpdates.elementsToPost)
        .then(getResponseData);
      await saveJSON(`${LOGDIR}${ts()}-post-entities.json`, postedEntities);
    }

    console.log("==== Entities to PATCH: ====");
    console.log(entUpdates.elementsToPatch);
    if (entUpdates.elementsToPatch.length > 0) {
      if (!(await askYesNo("Patch them?"))) return;
      console.log("==== PATCHing entities ====");
      patchedEntities = await api
        .patch(`/entities`, entUpdates.elementsToPatch)
        .then(getResponseData);
      await saveJSON(`${LOGDIR}${ts()}-patch-entities.json`, patchedEntities);
    }

    // The manually linked entities were already fetched back into
    // existing entities, so no need to put them in allEntities
    const allEntities = Object.assign(
      {},
      getDsKeyObject(entUpdates.existingElements, "mfid"),
      getDsKeyObject(postedEntities, "mfid"),
      getDsKeyObject(patchedEntities, "mfid")
    );
    const entitiesCount = Object.keys(allEntities).length;
    console.log(`===== Done importing ${entitiesCount} entities =====`);
    // await saveJSON(`${LOGDIR}${ts()}-allEntities.json`, allEntities);

    const edgeDataset = await loadMediasFrancaisRelations(allEntities);
    // await saveJSON(`${LOGDIR}${ts()}-edgeDataset.json`, edgeDataset);

    // On to the same process, but with edges!
    const relUpdates = await getElementUpdates(
      edgeDataset,
      "mfid",
      relColl,
      REL_OVERRIDING_PROPS,
      REL_UNCHANGEABLE_PROPS
    );
    console.log("==== Edges already in the DB: ====");
    console.log(relUpdates.existingElements.length + "/" + edgeDataset.length);
    //console.log(relUpdates.existingElements);

    console.log("==== Edges to POST: ====");
    console.log(relUpdates.elementsToPost);
    if (relUpdates.elementsToPost.length > 0) {
      if (!(await askYesNo("Post them?"))) return;
      console.log("==== POSTing edges ====");
      const postedEdges = await api
        .post(`/relations`, relUpdates.elementsToPost)
        .then(getResponseData);
      await saveJSON(`${LOGDIR}${ts()}-post-edges.json`, postedEdges);
    }

    console.log("==== Edges to PATCH: ====");
    console.log(relUpdates.elementsToPatch);
    if (relUpdates.elementsToPatch.length > 0) {
      if (!(await askYesNo("Patch them?"))) return;
      console.log("==== PATCHing edges ====");
      const patchedEdges = await api
        .patch(`/relations`, relUpdates.elementsToPatch)
        .then(getResponseData);
      await saveJSON(`${LOGDIR}${ts()}-patch-edges.json`, patchedEdges);
    }
  } catch (err) {
    console.error("ERROR: Failed to load and update the dataset:");
    if (err && err.stack) console.error(err.stack);
    else console.error(err);
  }
};

updateMediasFrancais();

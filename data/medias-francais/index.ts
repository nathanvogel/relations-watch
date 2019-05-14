import { Database, aql } from "arangojs";
import saveJSON from "./fileIO/saveJSON";
import loadMediasFrancaisEntities from "./loadMF";
import { Entity, DatasetId } from "./utils/types";
import C from "./utils/constants";
import { areConsistent } from "./utils/consistency";
import askYesNo from "./utils/ask";
import api, { checkResponse } from "./utils/api";
import { AxiosError } from "axios";
import { getKeyObject } from "./utils/utils";

const db = new Database({
  url: C.DEV ? "http://localhost:8529" : ""
});
db.useDatabase("_system");
db.useBasicAuth("root", "");
const OP = C.DEV ? "dev" : "prod";
const entColl = db.collection(C.entCollectionName);
const relColl = db.collection(C.relCollectionName);

const getEntityUpdates = async (
  datasetEntities: Entity[],
  datasetId: DatasetId
) => {
  const newEntities: Entity[] = [];
  const existingEntities: Entity[] = [];

  for (let entity of datasetEntities) {
    // Make sure we have access to the entity ID in this dataset.
    if (!entity.ds || !entity.ds[datasetId]) {
      console.error("The dataset loader didn't include the proper origin ID.");
      continue;
    }
    const entityDatasetId = entity.ds[datasetId];
    // Check if we already have put/linked this entity in the database.
    const cursor = await db.query(
      aql`
        FOR entity IN ${entColl}
          FILTER entity.ds.${datasetId} == ${entityDatasetId}
          RETURN entity
      `,
      { count: true }
    );
    // There should be maximum 1 such entity.
    if (cursor.count > 1) {
      // Just abort for now. If it ever happens, we'll log the problems.
      throw new Error("Duplicate entities for " + entityDatasetId);
    }
    // If the entity already exists
    else if (cursor.count == 1) {
      console.log("Found a correspondance for:", entity.name);
      const dbEntity: Entity = await cursor.next();
      if (!areConsistent(dbEntity, entity, ["type"])) {
        // If we detect a fundamental consistency problem with an
        // existing entity, we just abort for now.
        // If the name is different, update the name? Only for some datasets?
        throw new Error("Inconsistent entities");
      }
      existingEntities.push(dbEntity);
    }
    // If the entity doesn't already exists, we can simply push it.
    else {
      newEntities.push(entity);
    }
  }
  return { newEntities, existingEntities };
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
    // Make sure we have access to the entity ID in this dataset.
    if (!entity.ds || !entity.ds[datasetId]) {
      console.error(
        "The dataset loader didn't include the proper origin ID for" +
          entity.name
      );
      continue;
    }
    // Check if we have a similar but unlinked entity in the database.
    const cursor = await db.query(
      aql`
        FOR entity IN ${entColl}
          FILTER entity.ds.${datasetId} == null
          FILTER entity.name LIKE ${entity.name} OR ${
        entity.name
      } LIKE entity.name
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
        if (!areConsistent(dbEntity, entity, ["type"])) {
          throw new Error("Inconsistent entities");
        }
        // Link the database entity (by merging, because we might be using
        // multiple datasetIds in one operation)
        dbEntity.ds = Object.assign({}, dbEntity.ds, entity.ds);
        similarEntities.push(dbEntity);
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
    const dataset = await loadMediasFrancaisEntities;
    console.log(dataset.length + " entities loaded.");

    // First of all, we search existing entities in the database that
    // could be similar to the ones we have in the dataset.
    // We save thoses "merges" back to the database BEFORE checking which
    // entities already exists in the database
    console.log("🔍🔍🔍 Searching similar entities:");
    const entitiesToPatch = await findSimilarEntities(dataset, "mfid");
    console.log("==== Entities to patch: ====");
    console.log(entitiesToPatch);
    if (entitiesToPatch.length > 0) {
      console.log("==== PATCHing entities ====");
      patchedEntities = await api
        .patch(`/entities`, entitiesToPatch)
        .then(res => {
          const potentialError = checkResponse(res);
          if (potentialError) throw potentialError;
          else return res.data;
        })
        .catch((error: AxiosError) => {
          throw error;
        });
      await saveJSON(
        `logs/${OP}-${Date.now()}-patch-entities.json`,
        patchedEntities
      );
    }

    const updates = await getEntityUpdates(dataset, "mfid");
    console.log("==== Entities already in the DB: ====");
    console.log(updates.existingEntities.length + "/" + dataset.length);
    //console.log(updates.existingEntities);

    console.log("==== Entities to POST: ====");
    console.log(updates.newEntities);
    if (updates.newEntities.length > 0) {
      console.log("==== POSTing entities ====");
      postedEntities = await api
        .post(`/entities`, updates.newEntities)
        .then(res => {
          const potentialError = checkResponse(res);
          if (potentialError) throw potentialError;
          else return res.data;
        })
        .catch((error: AxiosError) => {
          throw error;
        });
      await saveJSON(
        `logs/${OP}-${Date.now()}-post-entities.json`,
        postedEntities
      );
    }

    const allEntities = Object.assign(
      {},
      getKeyObject(patchedEntities, "_key"),
      getKeyObject(updates.existingEntities, "_key"),
      getKeyObject(postedEntities, "_key")
    );
    console.log("===== Done importing entities =====");
    await saveJSON(`logs/${OP}-${Date.now()}-allEntities.json`, allEntities);

    // load edges.
    // Create DB edges objects from the dataset, using a manual source ID.
    // Look for existing edges
    // PATCH existing (don't care for now, we can implement it when a dataset actually changes/is reused); Or actually a full replace might be okay.
    // POST new
  } catch (err) {
    console.error("ERROR: Failed to load and update the dataset:");
    if (err && err.stack) console.error(err.stack);
    else console.error(err);
  }
};

updateMediasFrancais();

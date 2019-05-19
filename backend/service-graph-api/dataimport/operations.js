"use strict";
const db = require("@arangodb").db;
const query = require("@arangodb").query;

const utils = require("./compiledts/utils");
const consistency = require("./compiledts/consistency");
const CONST = require("../utils/const.js");
const relColl = db._collection(CONST.relCollectionName);
const entColl = db._collection(CONST.entCollectionName);

/**
 * Fetches the entity in the database with it's datasetId
 * @param  datasetId       The ID of the dataset to search in
 * @param  entityDatasetId The ID of the entity in that dataset
 * @param  count           wether to include "count" in the cursor or not
 * @return                 The fresh database cursor
 */
const getByDatasetId = (coll, datasetId, entityDatasetId) => {
  const cursor = query`
      FOR entity IN ${coll}
        FILTER entity.ds.${datasetId} == ${entityDatasetId}
        RETURN entity
    `;
  return cursor;
};

/**
 * [getElementUpdates description]
 * @param  {(Entity | Edge)[]} datasetElements    [description]
 * @param  {DatasetId} datasetId          [description]
 * @param  {string} collName               [description]
 * @param  {string[]} OVERRIDING_PROPS   [description]
 * @param  {string[]} UNCHANGEABLE_PROPS [description]
 * @return {{elementsToPost: (Entity | Edge)[], existingElements: (Entity | Edge)[], elementsToPatch: (Entity | Edge)[]}}
 */
function getElementUpdates(
  datasetElements,
  datasetId,
  collName,
  OVERRIDING_PROPS,
  UNCHANGEABLE_PROPS
) {
  const elementsToPost = [];
  const existingElements = [];
  const elementsToPatch = [];
  var coll;

  if (collName === CONST.entCollectionName) coll = entColl;
  else if (collName === CONST.relCollectionName) coll = relColl;
  else throw new Error("Invalid collection name.");

  for (let element of datasetElements) {
    const elDatasetId = utils.getElementDatasetId(element, datasetId);
    // Check if we already have put/linked this element in the database.
    const cursor = getByDatasetId(coll, datasetId, elDatasetId, true);
    var logIdentifier = elDatasetId;
    // Dirty fix: if it doesn't have this props, it's probably an Entity,
    // so just use .name.
    if (element._from === undefined) logIdentifier = element.name;
    // There should be maximum 1 such element.
    // // TODO DONT USE COUNT (or call it?)
    if (cursor.count > 1) {
      console.log("Found multiple elements with the same ID:");
      while (cursor.hasNext()) console.log("Key:", cursor.next()._key);
      throw new Error("Duplicate elements corresponding to " + elDatasetId);
    }
    // If the element already exists
    else if (cursor.count == 1) {
      console.log("Found a correspondance for:", logIdentifier);
      const dbElement = cursor.next();
      // If we detect a fundamental consistency problem with an
      // existing element, we just abort for now.
      // If the name is different, update the name? Only for some datasets?
      if (!consistency.areConsistent(dbElement, element, UNCHANGEABLE_PROPS))
        throw new Error(
          `Inconsistent elements: ${elDatasetId} (${logIdentifier})`
        );
      // Maybe we want to overwrite the values in the DB.
      if (utils.selectiveDiff(dbElement, element, OVERRIDING_PROPS)) {
        const patchedElement = Object.assign(
          {},
          dbElement,
          utils.selectiveExtract(element, OVERRIDING_PROPS),
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
 * Search for entities similar to the ones in the dataset
 * and asks the user if he wants to merge them.
 * @param  {Entity[]} datasetEntities from the dataset we're importing
 * @param  {string} datasetId       the id of import dataset
 * @return {{[key:string]:Entity[]}}  The entities judged similar by the database.
 */
const findSimilarEntities = (
  datasetEntities,
  datasetId,
  UNCHANGEABLE_PROPS
) => {
  const similarEntities = {};

  for (let entity of datasetEntities) {
    // Skip entities that are already linked in the database.
    const entityDatasetId = utils.getElementDatasetId(entity, datasetId);
    const cursor1 = getByDatasetId(entColl, datasetId, entityDatasetId, false);
    if (cursor1.hasNext()) continue;
    // Check if we have a similar but unlinked entity in the database.
    const cursor = query`
        FOR entity IN ${entColl}
          FILTER entity.ds.${datasetId} == null
          FILTER entity.name LIKE  ${"%" + entity.name + "%"}
            OR ${entity.name} LIKE CONCAT("%", entity.name, "%")
          RETURN entity
      `;

    while (cursor.hasNext()) {
      if (!similarEntities[entityDatasetId])
        similarEntities[entityDatasetId] = [];
      const dbEntity = cursor.next();
      // Check that we aren't merging incompatible stuff.
      if (!consistency.areConsistent(dbEntity, entity, UNCHANGEABLE_PROPS)) {
        console.log(`Inconsistent entities: ${entity.name}`);
        continue;
      }
      // Link the database entity (by merging, because we might be using
      // multiple datasetIds in one operation)
      // If there're different props, they'll be merged later when this
      // entity will be freshly refetched.
      dbEntity.ds = Object.assign({}, dbEntity.ds, entity.ds);
      similarEntities[entityDatasetId].push(dbEntity);
    }
  }
  return similarEntities;
};

module.exports = {
  getElementUpdates,
  findSimilarEntities
};

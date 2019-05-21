"use strict";
const joi = require("joi");
const createRouter = require("@arangodb/foxx/router");

const operations = require("./operations");
const entSchema = require("../utils/schemas").entSchema;
const relSchema = require("../utils/schemas").relSchema;
const entityArraySchema = joi.array().items(entSchema.optional());
const CONST = require("../utils/const.js");

const router = createRouter();
module.exports = router;

router
  .post("/similar/entities", function(req, res) {
    var datasetid = req.queryParams.datasetid;
    if (CONST.DATASET_IDS.indexOf(datasetid) < 0) {
      return res.throw(400, "Invalid datasetid");
    }

    const tmp = req.queryParams.unchangeable;
    const unchangeable = !tmp ? [] : Array.isArray(tmp) ? tmp : [tmp];

    var list = operations.findSimilarEntities(
      req.body,
      datasetid,
      unchangeable
    );

    res.send(list);
  })
  .queryParam(
    "datasetid",
    joi.string().required(),
    "The ID of the corresponding dataset"
  )
  .queryParam(
    "unchangeable",
    joi
      .alternatives()
      .try(joi.string().optional(), joi.array().items(joi.string())),
    "Keys of the props that should be considered incompatible"
  )
  .body(
    joi
      .array()
      .items(entSchema)
      .allow([])
      .optional(),
    undefined,
    "Array of entities from the dataset."
  )
  .response(joi.object(), "List of array of matched entities, by datasetId")
  .summary("Find similar entities")
  .description("Searches for entities similar to the given ones.");

router
  .post("/diff", function(req, res) {
    // Validate datasetid
    var datasetid = req.queryParams.datasetid;
    if (CONST.DATASET_IDS.indexOf(datasetid) < 0) {
      return res.throw(404, "Invalid datasetid");
    }
    // Validate collection name
    var collection = req.queryParams.collection;
    if (
      collection !== CONST.entCollectionName &&
      collection !== CONST.relCollectionName
    ) {
      return res.throw(404, "Invalid collection");
    }
    // Cast unchangeable properties array
    var tmp = req.queryParams.unchangeable;
    const unchangeable = !tmp ? [] : Array.isArray(tmp) ? tmp : [tmp];
    // Cast overriding properties array
    tmp = req.queryParams.overriding;
    const overriding = !tmp ? [] : Array.isArray(tmp) ? tmp : [tmp];

    var updates = operations.getElementUpdates(
      req.body,
      datasetid,
      collection,
      overriding,
      unchangeable
    );

    res.send(updates);
  })
  .queryParam(
    "datasetid",
    joi.string().required(),
    "The ID of the corresponding dataset. "
  )
  .queryParam(
    "collection",
    joi.string().required(),
    "The ID of the corresponding collection, either 'entities' or 'relations'."
  )
  .queryParam(
    "unchangeable",
    joi
      .alternatives()
      .try(joi.string().optional(), joi.array().items(joi.string())),
    "Keys of the props that should be considered incompatible"
  )
  .queryParam(
    "overriding",
    joi
      .alternatives()
      .try(joi.string().optional(), joi.array().items(joi.string())),
    "Keys of the props that should be overriden with the dataset values"
  )
  .body(
    joi
      .array()
      .items(
        joi
          .alternatives()
          .try(entSchema)
          .try(relSchema)
      )
      .allow([])
      .optional(),
    undefined,
    "Array of elements from the dataset."
  )
  .response(
    joi.object().keys({
      elementsToPost: entityArraySchema,
      existingElements: entityArraySchema,
      elementsToPatch: entityArraySchema
    }),
    "List of array of matched elements"
  )
  .summary("For a given dataset, returns the necessary updates")
  .description(`Returns:
    1. The elements that already exists in the same state in the database
       (according to 'overriding' props).
    2. The elements that don't exist in the database at all.
    3. The elements that were already linked from this dataset, but which
       state is different and should be patch (according to 'overriding' props).
    `);

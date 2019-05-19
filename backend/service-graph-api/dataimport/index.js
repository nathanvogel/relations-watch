"use strict";
const joi = require("joi");
const createRouter = require("@arangodb/foxx/router");

const operations = require("./operations");
const entSchema = require("../utils/schemas").entSchema;
const CONST = require("../utils/const.js");

const router = createRouter();
module.exports = router;

// GET source suggestions for autocomplete
router
  .post("/similar/entities", function(req, res) {
    var datasetid = req.queryParams.datasetid;
    if (CONST.DATASET_IDS.indexOf(datasetid) < 0) {
      return res.throw(
        400,
        "Please indicate the fullRef parameter as a string"
      );
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
  .queryParam("datasetid", joi.string().required(), "The user input")
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
      .optional()
  )
  .response(joi.object(), "List of array of matched entities, by datasetId")
  .summary("Find similar entities")
  .description("Searches for entities similar to the given ones.");

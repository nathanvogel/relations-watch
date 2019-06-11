"use strict";
const joi = require("joi");
const createRouter = require("@arangodb/foxx/router");
const db = require("@arangodb").db;

const apiFactory = require("../utils/apiFactory");
const graphSchema = require("../utils/schemas").graphSchema;
const CONST = require("../utils/const.js");
const graphColl = db._collection(CONST.graphCollectionName);

const router = createRouter();
module.exports = router;

// POST a new graph
router
  .post("/", apiFactory.post.bind(this, graphColl))
  .body(
    joi.alternatives().try(graphSchema, joi.array().items(graphSchema)),
    "Graph or graphs to store in the collection."
  )
  .response(
    joi
      .alternatives()
      .try(joi.object().required(), joi.array().items(joi.object().required())),
    "Graph or graphs stored in the collection."
  )
  .summary("Stores graph or graphs")
  .description("Stores a single graph or multiple graphs in the collection.");

// PATCH an graph
router
  .patch("/", apiFactory.patch.bind(this, graphColl))
  .body(
    joi.alternatives().try(graphSchema, joi.array().items(graphSchema)),
    "Graph or graphs to patch in the collection."
  )
  .response(
    joi
      .alternatives()
      .try(joi.object().required(), joi.array().items(joi.object().required())),
    "Graph or graphs stored in the collection."
  )
  .summary("Updates (merges) graph or graphs")
  .description(
    "Updates (merges) a single graph or multiple graphs in the collection."
  );

// GET an graph
router
  .get("/:key", apiFactory.get.bind(this, graphColl))
  .pathParam("key", joi.string().required(), "Key of the graph.")
  .response(joi.object().required(), "Entry stored in the collection.")
  .summary("Retrieve an graph")
  .description("Retrieves an graph by key.");

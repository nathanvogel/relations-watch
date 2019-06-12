"use strict";
const joi = require("joi");
const createRouter = require("@arangodb/foxx/router");
const db = require("@arangodb").db;
const aql = require("@arangodb").aql;
const errors = require("@arangodb").errors;
const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;

const apiFactory = require("../utils/apiFactory");
const graphSchema = require("../utils/schemas").graphSchema;
const entSchema = require("../utils/schemas").entSchema;
const relSchema = require("../utils/schemas").relSchema;
const entityArraySchema = joi.array().items(entSchema.optional());
const relationArraySchema = joi.array().items(relSchema.optional());
const CONST = require("../utils/const.js");
const graphColl = db._collection(CONST.graphCollectionName);
const entColl = db._collection(CONST.entCollectionName);

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

router
  .post("/inbetween", function(req, res) {
    const entityKeys = req.body; // entityKey string[]

    const vertices = [];
    try {
      for (var key of entityKeys) {
        vertices.push(entColl.document(key));
      }
    } catch (e) {
      if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
        throw e;
      }
      res.throw(404, "One of the requested item does not exist.", e);
    }

    const edges = db._query(aql`
           FOR e IN relations
               FILTER POSITION(${entityKeys}, e._from) AND
                      POSITION(${entityKeys}, e._to)
               RETURN KEEP(e, "_key", "_from", "_to", "type", "fType")
      `);

    res.send({ edges: edges.toArray(), vertices: vertices });
  })
  .body(
    joi
      .array()
      .items(joi.string())
      .allow([])
      .optional(),
    undefined,
    "Array of entity keys of the graph."
  )
  .response(
    joi.object().keys({
      edges: relationArraySchema,
      vertices: entityArraySchema
    }),
    "List of matched edges and vertices"
  )
  .summary("Graph edges and vertices")
  .description("Returns all relations+entities linked within a group.");

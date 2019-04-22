"use strict";
const joi = require("joi");
const createRouter = require("@arangodb/foxx/router");
const db = require("@arangodb").db;
const aql = require("@arangodb").aql;

const apiFactory = require("../utils/apiFactory");
const entSchema = require("../utils/schemas").entSchema;
const CONST = require("../utils/const.js");
const entColl = db._collection(CONST.entCollectionName);
const relColl = db._collection(CONST.relCollectionName);

const router = createRouter();
module.exports = router;

// POST a new entity
router
  .post("/", apiFactory.post.bind(this, entColl))
  .body(
    joi.alternatives().try(entSchema, joi.array().items(entSchema)),
    "Entity or entities to store in the collection."
  )
  .response(
    joi
      .alternatives()
      .try(joi.object().required(), joi.array().items(joi.object().required())),
    "Entity or entities stored in the collection."
  )
  .summary("Stores entity or entities")
  .description(
    "Stores a single entity or multiple entities in the collection."
  );

// PATCH an entity
router
  .patch("/", apiFactory.patch.bind(this, entColl))
  .body(
    joi.alternatives().try(entSchema, joi.array().items(entSchema)),
    "Entity or entities to patch in the collection."
  )
  .response(
    joi
      .alternatives()
      .try(joi.object().required(), joi.array().items(joi.object().required())),
    "Entity or entities stored in the collection."
  )
  .summary("Updates (merges) entity or entities")
  .description(
    "Updates (merges) a single entity or multiple entities in the collection."
  );

// GET an entity
router
  .get("/:key", apiFactory.get.bind(this, entColl))
  .pathParam("key", joi.string().required(), "Key of the entity.")
  .response(joi.object().required(), "Entry stored in the collection.")
  .summary("Retrieve an entity")
  .description(
    'Retrieves an entity from the "myFoxxCollection" collection by key.'
  );

// GET the list of entity IDs
router
  .get("/list", function(req, res) {
    const keys = db._query(aql`
    FOR entity IN ${entColl}
    LIMIT 1000
    RETURN entity._key
  `);
    res.send(keys);
  })
  .response(
    joi
      .array()
      .items(joi.string().required())
      .required(),
    "List of entity keys."
  )
  .summary("List entity keys")
  .description("Assembles a list of keys of entities in the collection.");

// GET the list of entity names
router
  .get("/names", function(req, res) {
    const names = db._query(aql`
    FOR entity IN ${entColl}
    LIMIT 1000
    RETURN entity.name
  `);
    res.send(names);
  })
  .response(
    joi
      .array()
      .items(joi.string().required())
      .required(),
    "List of entity names."
  )
  .summary("List entity names")
  .description("Assembles a list of names of entities in the collection.");

// GET entity suggestions for autocomplete
router
  .get("/autocomplete/:searchTerm", function(req, res) {
    const entities = db._query(
      `
          FOR entity IN FULLTEXT(@@collection, "name", CONCAT("prefix:", @searchTerm),  6)
            RETURN {"name": entity.name, "_key": entity._key }
        `,
      {
        "@collection": entColl.name(),
        searchTerm: req.pathParams.searchTerm
      }
    );
    res.send(entities);
  })
  .pathParam("searchTerm", joi.string().required(), "Search field content")
  .response(
    joi
      .array()
      .items(joi.object().required())
      .required(),
    "List of matched entities"
  )
  .summary("Autocomplete entities")
  .description("Searches names for autocomplete suggestions.");

router
  .get("/:key/relations", function(req, res) {
    const relations = db._query(aql`
          LET eResults = (
             FOR v,e
                 IN 1..2
                 ANY CONCAT(${entColl.name()}, '/', ${req.pathParams.key})
                 ${relColl}
                 OPTIONS { uniqueEdges: "path", bfs: true }
                 RETURN DISTINCT KEEP(e, "_key", "_from", "_to", "type")
          )
          LET vResults = (
            FOR v,e
              IN 1..2
              ANY CONCAT(${entColl.name()}, '/', ${req.pathParams.key})
              ${relColl}
              OPTIONS { uniqueEdges: "path", bfs: true }
              RETURN DISTINCT KEEP(v, "_key", "name")
           )
           RETURN { edges: eResults, vertices: vResults}
        `);
    res.send(relations);
  })
  .pathParam("key", joi.string().required(), "Key of the central entity")
  .response(
    joi
      .array()
      .items(joi.object().required())
      .required(),
    "List of matched relations"
  )
  .summary("Entity Graph")
  .description("Returns all the relations linked to an entity.");

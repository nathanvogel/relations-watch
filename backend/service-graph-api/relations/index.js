"use strict";
const joi = require("joi");
const createRouter = require("@arangodb/foxx/router");
const db = require("@arangodb").db;
const aql = require("@arangodb").aql;

const apiFactory = require("../utils/apiFactory");
const utils = require("../utils/utils");
const relSchema = require("../utils/schemas.js").relSchema;
const CONST = require("../utils/const.js");
const entColl = db._collection(CONST.entCollectionName);
const relColl = db._collection(CONST.relCollectionName);

const router = createRouter();
module.exports = router;

// POST new relations
// TODO : validate input.
router
  .post("/", function(req, res) {
    const multiple = Array.isArray(req.body);
    const body = multiple ? req.body : [req.body];

    let data = [];
    for (var doc of body) {
      utils.prefixToFromWithCollectionName(doc);
      const meta = relColl.save(doc);
      data.push(Object.assign(doc, meta));
    }
    res.send(multiple ? data : data[0]);
  })
  .body(
    joi.alternatives().try(relSchema, joi.array().items(relSchema)),
    "The new relation to establish in the database."
  )
  .response(
    joi
      .alternatives()
      .try(joi.object().required(), joi.array().items(joi.object().required())),
    "The new added objects, with their meta-information."
  )
  .summary("Creates one or many new relations")
  .description("Links two entities in the database with a new edge.");

router
  .patch("/", function(req, res) {
    const multiple = Array.isArray(req.body);
    const body = multiple ? req.body : [req.body];

    let data = [];
    for (var doc of body) {
      utils.prefixToFromWithCollectionName(doc);
      const meta = relColl.update(doc, doc);
      data.push(Object.assign(doc, meta));
    }
    res.send(multiple ? data : data[0]);
  })
  .body(
    joi.alternatives().try(relSchema, joi.array().items(relSchema)),
    "The updated relations objects"
  )
  .response(
    joi
      .alternatives()
      .try(joi.object().required(), joi.array().items(joi.object().required())),
    "The updated objects, with their meta-information."
  )
  .summary("Updates (merges) relation(s)")
  .description("Updates (merges) one or many edges.");

// GET a relation
router
  .get("/:key", apiFactory.get.bind(this, relColl))
  .pathParam("key", joi.string().required(), "Key of the edge.")
  .response(joi.object().required(), "Edge stored in the collection.")
  .summary("Retrieves an edge")
  .description("Retrieves an edge from the collection by key.");

// Delete a relation
router
  .delete("/:key", apiFactory.remove.bind(this, relColl))
  .pathParam("key", joi.string().required(), "Key of the edge.")
  .response(
    joi.object().required(),
    "Metadata of the edge stored in the collection."
  )
  .summary("Delete a relation")
  .description("Delete an edge.");

// GET the list of relation IDs
router
  .get("/", function(req, res) {
    const keys = db._query(aql`
          FOR relation IN ${relColl}
          LIMIT 1000
          RETURN relation._key
          `);
    res.send(keys);
  })
  .response(
    joi
      .array()
      .items(joi.string().required())
      .required(),
    "List of relation keys, up to 1000."
  )
  .summary("List relation keys")
  .description("Returns a list of relation keys");

// GET all relations between two persons
router
  .get("/all/:entity1/:entity2", function(req, res) {
    const query = aql`
            FOR v,e
              IN 1
              ANY CONCAT(${entColl.name()}, '/', ${req.pathParams.entity1})
              ${relColl}
              FILTER v._key == ${req.pathParams.entity2}
              RETURN e
    `;
    const relations = db._query(query);
    res.send(relations);
  })
  .pathParam("entity1", joi.string().required(), "Key of the first entity")
  .pathParam("entity2", joi.string().required(), "Key of the second entity")
  .response(
    joi
      .array()
      .items(joi.object().required())
      .required(),
    "List of relations"
  )
  .summary("All relations between two persons")
  .description(
    "Looks for all edges between entity1 and entity2 and returns them"
  );

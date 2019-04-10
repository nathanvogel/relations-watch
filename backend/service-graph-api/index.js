"use strict";
const joi = require("joi");
const createRouter = require("@arangodb/foxx/router");
const db = require("@arangodb").db;
const errors = require("@arangodb").errors;
const aql = require("@arangodb").aql;

const CONST = require("./scripts/const.js");

const router = createRouter();
const entColl = db._collection(CONST.entCollectionName);
const relColl = db._collection(CONST.relCollectionName);
const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;

module.context.use(router);

// store schema in variable to make it re-usable, see .body()

const entSchema = joi
  .object()
  .required()
  .keys({
    name: joi.string().required(),
    imageId: joi.string(),
    type: joi.number().required(),
    linkWikipedia: joi.string(),
    linkCrunchbase: joi.string(),
    linkTwitter: joi.string(),
    linkFacebook: joi.string(),
    linkYoutube: joi.string(),
    linkWebsite: joi.string(),
    domains: joi.array().items(joi.string())
  })
  .unknown(); // allow additional attributes

const relSchema = joi
  .object()
  .required()
  .keys({
    _from: joi.string().required(),
    _to: joi.string().required(),
    text: joi
      .string()
      .min(3)
      .max(288)
      .required(),
    type: joi
      .number()
      .integer()
      .required(),
    amount: joi.number(),
    exactAmount: joi.boolean(),
    job: joi.boolean(),
    sources: joi.array().items(joi.string())
  });

// POST a new entity
router
  .post("/entities", function(req, res) {
    const multiple = Array.isArray(req.body);
    const body = multiple ? req.body : [req.body];

    let data = [];
    for (var doc of body) {
      const meta = entColl.save(doc);
      data.push(Object.assign(doc, meta));
    }
    res.send(multiple ? data : data[0]);
  })
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
  .summary("Store entity or entities")
  .description("Store a single entity or multiple entities in the collection.");

// GET an entity
router
  .get("/entities/:key", function(req, res) {
    try {
      const data = entColl.document(req.pathParams.key);
      res.send(data);
    } catch (e) {
      if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
        throw e;
      }
      res.throw(404, "The entity does not exist", e);
    }
  })
  .pathParam("key", joi.string().required(), "Key of the entity.")
  .response(joi.object().required(), "Entry stored in the collection.")
  .summary("Retrieve an entity")
  .description(
    'Retrieves an entity from the "myFoxxCollection" collection by key.'
  );

// GET the list of entity IDs
router
  .get("/entities", function(req, res) {
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
  .get("/entities/names", function(req, res) {
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

// POST new relations
// TODO : validate input.
router
  .post("/relations", function(req, res) {
    const multiple = Array.isArray(req.body);
    const body = multiple ? req.body : [req.body];

    let data = [];
    for (var doc of body) {
      doc._to = "entities/" + doc._to;
      doc._from = "entities/" + doc._from;
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
  .description("Link two entities in the database with a new edge.");

// GET a relation
router
  .get("/relations/:key", function(req, res) {
    try {
      const data = relColl.document(req.pathParams.key);
      res.send(data);
    } catch (e) {
      if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
        throw e;
      }
      res.throw(404, "The relation does not exist", e);
    }
  })
  .pathParam("key", joi.string().required(), "Key of the relation.")
  .response(joi.object().required(), "Entry stored in the collection.")
  .summary("Retrieve a relation")
  .description("Retrieves a relation from the collection by key.");

// GET the list of relation IDs
router
  .get("/relations", function(req, res) {
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
  .get("/relations/all/:entity1/:entity2", function(req, res) {
    const relations = db._query(aql`
            FOR v,e
              IN 1
              ANY '${entColl.name()}/${req.pathParams.entity1}'
              ${relColl}
              FILTER v._key == '${req.pathParams.entity2}'
              RETURN e
    `);
    res.send(relations);
  })
  .pathParam("entity1", joi.number().required(), "Key of the first entity")
  .pathParam("entity2", joi.number().required(), "Key of the second entity")
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

// GET entity suggestions for autocomplete
router
  .get("/entities/autocomplete/:searchTerm", function(req, res) {
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
  .get("/entities/:key/relations", function(req, res) {
    const relations = db._query(
      `
        FOR v,rel
          IN 1..2
          ANY '${entColl.name()}/${req.pathParams.key}'
          ${relColl.name()}
          RETURN KEEP(rel, "_key", "_from", "_to", "type")
      `
    );
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

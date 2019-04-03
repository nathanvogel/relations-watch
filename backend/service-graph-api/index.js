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
    sources: joi.array().items(joi.string().required())
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
      res.throw(404, "The entry does not exist", e);
    }
  })
  .pathParam("key", joi.string().required(), "Key of the entry.")
  .response(joi.object().required(), "Entry stored in the collection.")
  .summary("Retrieve an entry")
  .description(
    'Retrieves an entry from the "myFoxxCollection" collection by key.'
  );

// GET the list of entity IDs
router
  .get("/entities", function(req, res) {
    const keys = db._query(aql`
    FOR entry IN ${entColl}
    LIMIT 1000
    RETURN entry._key
  `);
    res.send(keys);
  })
  .response(
    joi
      .array()
      .items(joi.string().required())
      .required(),
    "List of entry keys."
  )
  .summary("List entry keys")
  .description("Assembles a list of keys of entities in the collection.");

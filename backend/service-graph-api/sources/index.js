"use strict";
const joi = require("joi");
const createRouter = require("@arangodb/foxx/router");
const db = require("@arangodb").db;
const errors = require("@arangodb").errors;
const aql = require("@arangodb").aql;

const entSchema = require("../utils/schemas").entSchema;
const CONST = require("../utils/const.js");
const souColl = db._collection(CONST.souCollectionName);
const relColl = db._collection(CONST.relCollectionName);
const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;

const router = createRouter();
module.exports = router;

// POST a new source
router
  .post("/", function(req, res) {
    const multiple = Array.isArray(req.body);
    const body = multiple ? req.body : [req.body];

    let data = [];
    for (var doc of body) {
      const meta = souColl.save(doc);
      data.push(Object.assign(doc, meta));
    }
    res.send(multiple ? data : data[0]);
  })
  .body(
    joi.alternatives().try(entSchema, joi.array().items(entSchema)),
    "Source or sources to store in the collection."
  )
  .response(
    joi
      .alternatives()
      .try(joi.object().required(), joi.array().items(joi.object().required())),
    "Source or sources stored in the collection."
  )
  .summary("Stores a source or sources")
  .description("Stores a single Source or multiple sources in the collection.");

"use strict";
const joi = require("joi");
const createRouter = require("@arangodb/foxx/router");
const db = require("@arangodb").db;
const errors = require("@arangodb").errors;
const query = require("@arangodb").query;
const validator = require("validator");

const apiFactory = require("../utils/apiFactory");
const souSchema = require("../utils/schemas").souSchema;
const CONST = require("../utils/const.js");
const souColl = db._collection(CONST.souCollectionName);
const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;

const router = createRouter();
module.exports = router;

function getSimplifiedLink(fullUrl) {
  var url = fullUrl.replace(/^https?:\/\//, "");
  // TODO : remove hash
  // TODO : remove useless YouTube query parameters, etc.
  return url;
}

function getRefType(fullRef) {
  const isURL = validator.isURL(fullRef, {
    protocols: ["http", "https", "ftp"],
    require_tld: true,
    require_protocol: false,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: false,
    host_whitelist: false,
    host_blacklist: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    disallow_auth: false
  });
  return isURL ? CONST.SOURCE_TYPES.LINK : CONST.SOURCE_TYPES.REF;
}

// POST a new source
router
  .post("/", function(req, res) {
    const multiple = Array.isArray(req.body);
    const body = multiple ? req.body : [req.body];

    let data = [];
    for (var doc of body) {
      // TODO: search by ref if it exists.
      const meta = souColl.save(doc);
      data.push(Object.assign(doc, meta));
    }
    res.send(multiple ? data : data[0]);
  })
  .body(
    joi.alternatives().try(souSchema, joi.array().items(souSchema)),
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

// GET an entity
router
  .get("/:key", apiFactory.get.bind(this, souColl))
  .pathParam("key", joi.string().required(), "Key of the source.")
  .response(joi.object().required(), "Source stored in the collection.")
  .summary("Retrieve a source")
  .description("Retrieves a source by key.");

// GET source suggestions for autocomplete
router
  .get("/autocomplete", function(req, res) {
    var searchTerm = req.queryParams.search;
    if (!searchTerm || typeof searchTerm !== "string") {
      res.throw(400, "Please indicate the fullRef parameter as a string");
    }
    searchTerm = searchTerm.trim();
    const type = getRefType(searchTerm);
    var dbSearchTerm = searchTerm;
    if (type === CONST.SOURCE_TYPES.LINK) {
      dbSearchTerm = getSimplifiedLink(searchTerm);
    }

    const entities = query`
      FOR source IN ${souColl}
        FILTER source.ref LIKE ${"%" + dbSearchTerm + "%"}
        RETURN {"ref": source.ref, "_key": source._key, "title": source.title }
    `;
    res.send(entities);
  })
  .queryParam("search", joi.string().required(), "The user input")
  .response(
    joi
      .array()
      .items(joi.object().required())
      .required(),
    "List of matched sources"
  )
  .summary("Autocomplete sources")
  .description("Searches references for autocomplete suggestions.");

// GET a source by ref search.
// If it exists -> returns the existing one
// Else -> returns a new pre-filled source.
router
  .get("/ref", function(req, res) {
    var fullRef = req.queryParams.fullRef;
    if (!fullRef || typeof fullRef !== "string") {
      res.throw(400, "Please indicate the fullRef parameter as a string");
      return;
    }
    fullRef = fullRef.trim();
    const type = getRefType(fullRef);
    var ref = fullRef;
    if (type === CONST.SOURCE_TYPES.LINK) {
      ref = getSimplifiedLink(fullRef);
    }

    const cursor = query`
      FOR source IN ${souColl}
        FILTER source.ref == ${ref}
        LIMIT 1
        RETURN source
    `;
    if (cursor.hasNext()) {
      res.send(cursor.next());
      return;
    }
    // else if (cursor.length > 1) {
    //   res.throw(500, "Multiple sources correspond to this ref.")
    // }

    // The ref doesn't already exist, so we generate a model for the user
    // to start with when creating the source.
    const newRef = {
      ref: ref,
      type: type,
      authors: []
    };
    res.send(newRef);
  })
  .queryParam("fullRef", joi.string().required(), "The user input")
  .response(souSchema, "The source, existing or a new one (without _key)")
  .summary("Get a source object from a ref")
  .description(`Searches for existing sources corresponding to the ref.
    If one exists, return it, else generate a new pre-filled one.`);

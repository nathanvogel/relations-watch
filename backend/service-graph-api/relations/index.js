"use strict";
const joi = require("joi");
const createRouter = require("@arangodb/foxx/router");
const db = require("@arangodb").db;
const aql = require("@arangodb").aql;
const request = require("@arangodb/request");
const update = require("immutability-helper");

const apiFactory = require("../utils/apiFactory");
const utils = require("../utils/utils");
const relSchema = require("../utils/schemas.js").relSchema;
const relationWithSourceSchema = require("../utils/schemas.js")
  .relationWithSourceSchema;
const CONST = require("../utils/const.js");
const entColl = db._collection(CONST.entCollectionName);
const relColl = db._collection(CONST.relCollectionName);
// const saveNewSources = require("../sources").saveNewSources;

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

/**
 * Save the given Source in the DB. Send a response through res if it failed.
 * @param  {Source} source   The source to be saved
 * @param  {Response} res    The response to use if the save fails.
 * @return {Source | null}   The Source with metadata if it could be saved,
 *                           null otherwise.
 */
function saveSource(source, res) {
  const response = request.post(module.context.baseUrl + "/sources", {
    body: source,
    json: true,
    encoding: "utf-8"
  });
  if (response.statusCode !== 200) {
    res.status(response.statusCode).send(response.body);
    return null;
  }
  // The Arango documentation indicates that it should be automatically
  // parsed with json:true but it doesn't seem to be the case.
  const savedSource =
    typeof response.body === "string"
      ? JSON.parse(response.body)
      : response.body;
  return savedSource;
}

// POST new relations with a new source
// TODO : validate input.
router
  .post("/withSource", function(req, res) {
    const multiple = Array.isArray(req.body);
    const body = multiple ? req.body : [req.body];

    let data = [];
    for (var doc of body) {
      // doc = {relation:Edge, comment:SourceComment, source:SourceFormData}
      // TODO: switch to a transaction ?
      // https://www.arangodb.com/docs/3.4/transactions-transaction-invocation.html
      // const savedSource = saveNewSources(doc.source)

      // Save the new source with our other endpoint
      const savedSource = saveSource(doc.source, res);
      // If the result is null, the source couldn't be saved and we should abort
      // The  function has already sent a response.
      if (!savedSource) return;
      // Add the newly created sourceKey to the edge sourceLink.
      const sourceLink = update(doc.sourceLink, {
        $merge: { sourceKey: savedSource._key }
      });
      // Link the comment into the sources.
      const edge = update(doc.relation, {
        sources: { $set: [sourceLink] }
      });
      // Do the regular edge save operation.
      utils.prefixToFromWithCollectionName(edge);
      const meta = relColl.save(edge);
      data.push({ relation: Object.assign(edge, meta), source: savedSource });
    }
    res.send(multiple ? data : data[0]);
  })
  .body(
    joi
      .alternatives()
      .try(
        relationWithSourceSchema,
        joi.array().items(relationWithSourceSchema)
      ),
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
      const newDoc = relColl.document(meta);
      data.push(Object.assign({}, newDoc, meta));
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

router
  .patch("/withSource", function(req, res) {
    const multiple = Array.isArray(req.body);
    const body = multiple ? req.body : [req.body];

    let data = [];
    for (var doc of body) {
      // Save the new source with our other endpoint
      const savedSource = saveSource(doc.source, res);
      // If the result is null, the source couldn't be saved and we should abort
      // The  function has already sent a response.
      if (!savedSource) return;
      // Add the newly created sourceKey to the edge sourceLink.
      const sourceLink = update(doc.sourceLink, {
        $merge: { sourceKey: savedSource._key }
      });
      // Link the comment into the sources.
      const edge = update(doc.relation, {
        sources: { $push: [sourceLink] }
      });
      // Do the regular edge save operation.
      utils.prefixToFromWithCollectionName(edge);
      const meta = relColl.update(edge, edge);
      data.push({ relation: Object.assign(edge, meta), source: savedSource });
    }
    res.send(multiple ? data : data[0]);
  })
  .body(
    joi
      .alternatives()
      .try(
        relationWithSourceSchema,
        joi.array().items(relationWithSourceSchema)
      ),
    "The Edge+Source to update in the database."
  )
  .response(
    joi
      .alternatives()
      .try(joi.object().required(), joi.array().items(joi.object().required())),
    "The updated objects, with their meta-information."
  )
  .summary("Updates (merges) relation(s) with a new Source")
  .description("Updates (merges) one or many edges, adding new Source(s).");

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

// const query = aql`
//
// FOR e IN relations
//     FILTER IS_LIST(e.sources)
//     LET yo = FIRST(FOR s IN e.sources
//                 FILTER s.sourceKey == "1179508"
//                 RETURN s
//             )
//     FILTER yo != null
//     LIMIT 99
//     RETURN DISTINCT(e._to)
//     `;

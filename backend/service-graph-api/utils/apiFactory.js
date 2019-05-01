const errors = require("@arangodb").errors;

const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;

const post = function(coll, req, res) {
  const multiple = Array.isArray(req.body);
  const body = multiple ? req.body : [req.body];

  let data = [];
  for (var doc of body) {
    const meta = coll.save(doc);
    data.push(Object.assign(doc, meta));
  }
  res.send(multiple ? data : data[0]);
};

const patch = function(coll, req, res) {
  const multiple = Array.isArray(req.body);
  const body = multiple ? req.body : [req.body];

  let data = [];
  for (var doc of body) {
    const meta = coll.update(doc._key, doc);
    data.push(Object.assign(doc, meta));
  }
  res.send(multiple ? data : data[0]);
};

const get = function(coll, req, res) {
  try {
    const data = coll.document(req.pathParams.key);
    res.send(data);
  } catch (e) {
    if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
      throw e;
    }
    res.throw(404, "The entity does not exist", e);
  }
};

const getMany = function(coll, req, res) {
  if (!req.queryParams || !req.queryParams.keys) {
    res.throw(400, "Missing queryParam 'keys'.");
    return;
  }
  // We need to be able to handle a single value not wrapped in an array
  // because of the poor formating support for arrays from joi and query
  // string librairies. (security is hard with this apparently.)
  const multiple = Array.isArray(req.queryParams.keys);
  const keys = multiple ? req.queryParams.keys : [req.queryParams.keys];
  try {
    const data = [];
    for (var key of keys) {
      data.push(coll.document(key));
    }
    res.send(data);
  } catch (e) {
    if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
      throw e;
    }
    res.throw(404, "One of the entities does not exist.", e);
  }
};

const remove = function(coll, req, res) {
  try {
    const oldDocument = coll.remove(req.pathParams.key);
    res.send(oldDocument);
  } catch (e) {
    if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
      throw e;
    }
    res.throw(404, "The relation does not exist", e);
  }
};

module.exports = {
  post,
  patch,
  get,
  getMany,
  remove
};

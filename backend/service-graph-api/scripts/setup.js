"use strict";
const db = require("@arangodb").db;
const CONST = require("./const.js");

if (!db._collection(CONST.relCollectionName)) {
  db._createEdgeCollection(CONST.relCollectionName);
}

if (!db._collection(CONST.entCollectionName)) {
  db._createDocumentCollection(CONST.entCollectionName);
}

const entities = db._collection(CONST.entCollectionName);
entities.ensureIndex({ type: "fulltext", fields: ["name"], minLength: 3 });

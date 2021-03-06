"use strict";
const db = require("@arangodb").db;
const CONST = require("../utils/const.js");

if (!db._collection(CONST.relCollectionName)) {
  db._createEdgeCollection(CONST.relCollectionName);
}

if (!db._collection(CONST.entCollectionName)) {
  db._createDocumentCollection(CONST.entCollectionName);
}

if (!db._collection(CONST.souCollectionName)) {
  db._createDocumentCollection(CONST.souCollectionName);
}

if (!db._collection(CONST.graphCollectionName)) {
  db._createDocumentCollection(CONST.graphCollectionName);
}

const entities = db._collection(CONST.entCollectionName);
entities.ensureIndex({ type: "fulltext", fields: ["name"], minLength: 3 });

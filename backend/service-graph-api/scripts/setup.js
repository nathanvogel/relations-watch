"use strict";
const db = require("@arangodb").db;
const CONST = require("./const.js");

if (!db._collection(CONST.relCollectionName)) {
  db._createDocumentCollection(CONST.relCollectionName);
}

if (!db._collection(CONST.entCollectionName)) {
  db._createDocumentCollection(CONST.entCollectionName);
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var arangojs_1 = require("arangojs");
var loadMF_1 = __importDefault(require("./loadMF"));
var db = new arangojs_1.Database({
    url: "http://localhost:8529"
});
db.useDatabase("_system");
db.useBasicAuth("root", "");
loadMF_1.default.then(function (dataset) {
    console.log("WE GOT THE DATASET!");
    console.log(dataset);
});
// (async function() {
//   const now = Date.now();
//   try {
//     const cursor = await db.query(aql`
//       RETURN ${now}
//     `);
//     const result = await cursor.next();
//     console.log("Result:", result);
//     try {
//       await saveJSON("exports/test-" + Date.now() + ".json", { test: result });
//     } catch (err) {
//       console.log("Couldn't save JSON:", err);
//     }
//   } catch (err) {
//     console.log("Error getting now");
//     console.error(err.stack);
//     return;
//   }
// })();

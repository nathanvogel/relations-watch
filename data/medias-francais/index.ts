import { Database, aql } from "arangojs";
import saveJSON from "./fileIO/saveJSON";
import loadMediasFrancaisEntities from "./loadMF";

const db = new Database({
  url: "http://localhost:8529"
});
db.useDatabase("_system");
db.useBasicAuth("root", "");

loadMediasFrancaisEntities.then(dataset => {
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

import { Database, aql } from "arangojs";

const db = new Database({
  url: "http://localhost:8529"
});
db.useDatabase("_system");
db.useBasicAuth("root", "");

(async function() {
  const now = Date.now();
  try {
    const cursor = await db.query(aql`
      RETURN ${now}
    `);
    const result = await cursor.next();
    console.log("Result:", result);
  } catch (err) {
    console.error(err.stack);
  }
})();

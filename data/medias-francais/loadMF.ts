import fs from "fs-extra";
import parse from "csv-parse";
import { Entity, EntityType } from "./utils/types";

const FILENAME = "Medias_francais/medias_francais.tsv";
const dataset: Entity[] = [];

type Record = {
  id: string;
  nom: string;
  typeLibelle: string;
  typeCode: string;
  rangChallenges: string;
  mediaType: string;
  mediaPeriodicite: string;
  mediaEchelle: string;
  commentaire: string;
};

const recordToEntity = (record: Record): Entity => {
  return {
    type:
      record.typeLibelle === "Personne physique"
        ? EntityType.Human
        : EntityType.MoralPerson,
    name: record.nom,
    ds: {
      mfn: record.nom,
      mfid: record.id
    }
  };
};

const stream = fs
  .createReadStream(FILENAME)
  .pipe(
    parse({
      columns: true,
      delimiter: "\t",
      skip_lines_with_empty_values: true,
      skip_empty_lines: true
    })
  )
  .on("data", function(record: any) {
    try {
      dataset.push(recordToEntity(record));
      // console.log(dataset.length, " => ", record);
    } catch (err) {
      console.error("Error while parsing file:", err);
    }
  });

const loadMediasFrancaisEntities = new Promise<typeof dataset>(function(
  resolve,
  reject
) {
  stream
    .on("end", function() {
      console.log("Done reading:", FILENAME);
      resolve(dataset);
    })
    .on("error", reject);
});

export default loadMediasFrancaisEntities;

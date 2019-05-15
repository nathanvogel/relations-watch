import fs from "fs-extra";
import parse from "csv-parse";
import { Entity, EntityType, Edge, RelationType } from "./utils/types";

const FILENAME_ENTITIES = "Medias_francais/medias_francais.tsv";
const FILENAME_RELATIONS = "Medias_francais/relations_medias_francais.tsv";
const mfParserOptions = {
  columns: true,
  delimiter: "\t",
  skip_lines_with_empty_values: true,
  skip_empty_lines: true
};

type EntityRecord = {
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

type EdgeRecord = {
  id: string; // This is the origine ID, not the relation ID !
  origine: string;
  valeur: string;
  cible: string;
  source: string;
  datePublication: string;
  dateConsultation: string;
};

export function getMFEdgeId(id1: string, id2: string): string {
  return id1 > id2 ? id1 + "__" + id2 : id2 + "__" + id1;
}

function getMFEdgeName(record: EdgeRecord): string {
  const id1 = record.origine.toLowerCase();
  const id2 = record.cible.toLowerCase();
  return id1 > id2 ? id1 + "__" + id2 : id2 + "__" + id1;
}

function typeLibelleToType(t: string): EntityType {
  switch (t.trim()) {
    case "Personne physique":
      return EntityType.Human;
    case "Personne morale":
      return EntityType.MoralPerson;
    case "Média":
      return EntityType.Media;
    case "État":
      return EntityType.State;
    default:
      throw new Error("Unknown typeLibelle:" + t);
  }
}

const recordToEntity = (record: EntityRecord): Entity => {
  return {
    type: typeLibelleToType(record.typeLibelle),
    name: record.nom,
    ds: {
      mfn: record.nom.toLowerCase(),
      mfid: record.id
    }
  };
};

export const loadMediasFrancaisEntities = () =>
  new Promise<Entity[]>((resolve, reject) => {
    const dataset: Entity[] = [];
    fs.createReadStream(FILENAME_ENTITIES)
      .pipe(parse(mfParserOptions))
      .on("data", function(record: any) {
        if (record.id === "146") {
          console.log("Ignoring manually deduplicated id");
          return;
        }
        try {
          // console.log(dataset.length, " => ", record);
          dataset.push(recordToEntity(record));
        } catch (err) {
          console.error("Error while parsing file:", err);
        }
      })
      .on("end", function() {
        console.log("Done reading:", FILENAME_ENTITIES);
        resolve(dataset);
      })
      .on("error", reject);
  });

// const yo: { [key: string]: number } = {};
//
// function addYo(key: string) {
//   if (yo[key]) yo[key]++;
//   else yo[key] = 1;
// }

const recordToEdge = (
  record: EdgeRecord,
  dbEntities: { [key: string]: Entity }
): Edge => {
  const type = RelationType.IsOwned;
  const owned = 100;
  const origineId = record.id;
  var cibleId: string | null = null;
  // Find the cible ID, because it's missing in the current state of
  // the relations_media_francais.tsv file.
  for (let key in dbEntities) {
    const entity = dbEntities[key];
    if (entity.name === record.cible) {
      if (!entity.ds || !entity.ds.mfid)
        throw new Error("missing mfid on " + entity.name + " - " + entity._key);
      cibleId = entity.ds.mfid;
      break;
    }
  }
  if (!cibleId) throw new Error("### Unable to find cible " + record.cible);
  // Safe to cast, the server would refuse the write anyway.
  const origineKey = dbEntities[origineId]._key as string;
  const cibleKey = dbEntities[cibleId]._key as string;
  const edgeMfid = getMFEdgeId(origineId, cibleId);
  const edgeMfn = getMFEdgeName(record);
  return {
    _from: origineKey,
    _to: cibleKey,
    type,
    text: "",
    owned,
    sources: [],
    ds: {
      mfid: edgeMfid,
      mfn: edgeMfn
    }
  };
};

export const loadMediasFrancaisRelations = (dbEntities: {
  [key: string]: Entity;
}) =>
  new Promise<Edge[]>((resolve, reject) => {
    const dataset: Edge[] = [];
    fs.createReadStream(FILENAME_RELATIONS)
      .pipe(parse(mfParserOptions))
      .on("data", function(record: any) {
        try {
          const edge = recordToEdge(record, dbEntities);
          if (edge) dataset.push(edge);
          // console.log(dataset.length, " => ", record);
        } catch (err) {
          console.error("Error while converting edge:", record);
          console.error(err);
        }
      })
      .on("end", function() {
        console.log("Done reading:", FILENAME_RELATIONS);
        resolve(dataset);
      })
      .on("error", reject);
  });

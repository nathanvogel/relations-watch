import fs from "fs-extra";
import parse from "csv-parse";
import {
  Entity,
  EntityType,
  Edge,
  RelationType,
  SourceLinkType
} from "./utils/types";
import C from "./utils/constants";

const MF_SOURCE_URL = "https://www.monde-diplomatique.fr/cartes/PPA";
const MF_SOURCE_KEY = C.DEV ? "1179508" : "1179508";
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

type EntityList = { [key: string]: Entity };

function getMFEdgeId(id1: string, id2: string): string {
  // We can keep the order for this dataset.
  return id1 + "__" + id2;
}

function getMFEdgeName(record: EdgeRecord): string {
  const id1 = getMfnId(record.origine);
  const id2 = getMfnId(record.cible);
  // We can keep the order for this dataset.
  return id1 + "__" + id2;
}

function getMfnId(nameInDataset: string) {
  return nameInDataset.toLowerCase();
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

function recordToEntity(record: EntityRecord): Entity {
  return {
    type: typeLibelleToType(record.typeLibelle),
    name: record.nom,
    ds: {
      mfn: getMfnId(record.nom),
      mfid: record.id
    }
  };
}

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

/**
 * Necessary because the dataset relations doesn't contain IDs for the cible.
 * @param  mfnId the ID extracted from the dataset record
 * @param  dbEntities entities to search in
 * @return                    [description]
 */
function findMfidWithMfn(mfnId: string, dbEntities: EntityList) {
  var cibleId: string | null = null;
  // Find the cible ID, because it's missing in the current state of
  // the relations_media_francais.tsv file.
  for (let key in dbEntities) {
    const entity = dbEntities[key];
    if (!entity.ds || !entity.ds.mfid || !entity.ds.mfn)
      throw new Error(
        "missing mfid/mfn on " + entity.name + " - " + entity._key
      );
    if (entity.ds.mfn === mfnId) {
      cibleId = entity.ds.mfid;
      break;
    }
  }
  return cibleId;
}

function recordToEdge(record: EdgeRecord, dbEntities: EntityList): Edge | null {
  var type = RelationType.IsOwned;
  var owned = 0;
  var text = "";
  switch (record.valeur) {
    case undefined:
    case null:
      return null;
    case "participe":
      type = RelationType.Other;
      text = `${record.origine} participe à ${record.cible}.`;
      owned = 0;
      break;
    case "contrôle":
      type = RelationType.IsControlled;
      text = "D'après le Monde diplomatique.";
      break;
    case "<50":
      owned = 0;
      text = "Le pourcentage précis est inconnu, mais inférieur à 50%.";
      break;
    case ">50":
      owned = 51;
      text = "Le pourcentage précis est inconnu, mais supérieur à 50%.";
      break;
    default:
      owned = parseFloat(record.valeur.replace(",", "."));
      if (owned === NaN)
        throw new Error("Could not parse valeur:" + record.valeur);
      break;
  }
  const origineId = record.id;
  const cibleId = findMfidWithMfn(getMfnId(record.cible), dbEntities);
  if (!cibleId) throw new Error("### Unable to find cible " + record.cible);
  // Safe to cast, the server would refuse the write anyway.
  const origineKey = dbEntities[origineId]._key as string;
  const cibleKey = dbEntities[cibleId]._key as string;
  const edgeMfid = getMFEdgeId(origineId, cibleId);
  const edgeMfn = getMFEdgeName(record);
  return {
    _from: cibleKey, // our order is the reverse
    _to: origineKey,
    type,
    text,
    owned,
    // amount: -1,
    // exactAmount: false,
    sources: [
      {
        fullUrl: MF_SOURCE_URL,
        type: SourceLinkType.Confirms,
        comments: [],
        sourceKey: MF_SOURCE_KEY
      }
    ],
    ds: {
      mfid: edgeMfid,
      mfn: edgeMfn
    }
  };
}

export const loadMediasFrancaisRelations = (dbEntities: EntityList) =>
  new Promise<Edge[]>((resolve, reject) => {
    const dataset: Edge[] = [];
    fs.createReadStream(FILENAME_RELATIONS)
      .pipe(parse(mfParserOptions))
      .on("data", function(record: any) {
        try {
          const edge = recordToEdge(record, dbEntities);
          if (
            record.origine == "Radio France" &&
            record.valeur == "contrôle" &&
            record.cible == "France Info"
          ) {
            console.log("Manually ignoring deduplicated Edge on France Info.");
            return;
          }
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

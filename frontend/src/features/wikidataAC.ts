import { Dispatch } from "redux";
import axios, { AxiosError, AxiosResponse } from "axios";
import validator from "validator";
import qs from "qs";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import {
  Action,
  ErrorPayload,
  Status,
  Dictionary,
  Entity,
  EntityType,
  DatasetId,
  EntityTypeValues,
  Edge
  RelationType
  FamilialLink,,
} from "../utils/types";
import CONSTS from "../utils/consts";
import { RootStore } from "../Store";
import { arrayWithoutDuplicates } from "../utils/utils";
import { loadEntities } from "./entitiesLoadAC";
import wd, { Property, Entity as WDEntity, Claim } from "wikidata-sdk";
import { Dictionary as WDDictionary } from "wikidata-sdk/types/helper";

// const wikidata = axios.create({
//   baseURL: "https://www.wikidata.org/w/api.php",
//   headers: {},
//   params: {
//     action:"wbgetentities",
//     props:"claims|datatype|descriptions|sitelinks/urls|info",
//     sitefilter:"enwiki|frwiki|dewiki|eswiki",
//     languages:"en|es|de|fr",
//   }
// });
//

const WD_PARAMS = {
  props: [
    "claims",
    "datatype",
    "descriptions",
    // "sitelinks/urls",
    "info",
    "labels"
  ] as Property[],
  sitefilter: ["enwiki", "frwiki", "dewiki", "eswiki"],
  languages: ["en", "de", "fr", "es"]
};
const preferredLangs = [
  "en",
  "en-GB",
  "en-CA",
  "de-ch",
  "fr",
  "de",
  "de-formal",
  "de-at",
  "es"
];

const WD_ENTITY_TYPE_MAPS: { [key: number]: Array<string> } = {
  [EntityType.Human]: ["Q5"],
  [EntityType.State]: [
    "Q6256",
    "Q3624078",
    "Q7275",
    "Q1763527",
    "Q107390",
    "Q1048835",
    "Q15642541",
    "Q43702",
    "Q5255892",
    "Q183039",
    "Q1307214",
    "Q1520223",
    "Q7270"
  ],
  [EntityType.MoralPerson]: ["Q4830453", "Q783794", "Q6881511"],
  [EntityType.Group]: ["Q7278"],
  [EntityType.Media]: ["Q1110794", "Q11032", "Q1002697", "Q11033"],
  [EntityType.Event]: [
    "Q1190554",
    "Q26907166",
    "Q58415929",
    "Q1656682",
    "Q18669875"
  ]
};

type WDResponseData = {
  success?: number;
  entities?: WDDictionary<WDEntity>;
  warnings?: any;
};

function selectLang(list: WDDictionary<wd.LanguageEntry>) {
  for (let lang of preferredLangs) {
    if (list[lang]) return list[lang];
  }
  for (let lng in list) {
    return list[lng];
  }
  return null;
}

function nameFromEntry(entry: WDEntity): string | null {
  if (!entry.labels) {
    console.log("No label list");
    return null;
  }
  const lngEntry = selectLang(entry.labels);
  if (!lngEntry) {
    console.log("No proper language entry");
    return null;
  }
  return lngEntry.value;
}

function typeFromInstanceOf(instanceOf: unknown): EntityType | null {
  if (typeof instanceOf !== "string") return null;
  for (let entityType of EntityTypeValues) {
    if (WD_ENTITY_TYPE_MAPS[entityType].indexOf(instanceOf) >= 0)
      return entityType;
  }
  return null;
}

function typeFromEntry(entry: WDEntity): EntityType | null {
  if (!entry.claims) return null;
  const claims_instanceOf = wd.simplify.propertyClaims(entry.claims["P31"]);
  if (!claims_instanceOf) return null;
  for (let claim of claims_instanceOf) {
    const detectedType = typeFromInstanceOf(claim);
    if (detectedType) return detectedType;
  }
  console.warn(
    `Couldn't detect type of entry: ${entry.id} - ${nameFromEntry(entry)}`
  );
  console.log("Wikidata classes: ", claims_instanceOf);
  return null;
}

function descriptionFromEntry(entry: WDEntity): string | null {
  if (!entry.descriptions) return null;
  const lngEntry = selectLang(entry.descriptions);
  if (!lngEntry) return null;
  return lngEntry.value;
}

function entityFromEntry(entry: WDEntity): Entity | null {
  const name = nameFromEntry(entry);
  if (!name) {
    console.log("Couldn't detect name of ", entry.id);
    return null;
  }
  const type = typeFromEntry(entry);
  if (!type) {
    console.log("Couldn't detect type of ", entry.id);
    return null;
  }
  const text = descriptionFromEntry(entry);
  return {
    name,
    type,
    text: text || undefined,
    ds: {
      [DatasetId.Wikidata]: entry.id
    }
  };
}

function fatherEdgesFromEntry(entryId: string, claims:WDDictionary<wd.Claim[]>): Dictionary<Edge>  {
  const edges:Dictionary<Edge> = {};
  if (!claims.P22) return edges;
  for (let claim of claims.P22) {
    if (!claim.mainsnak.datavalue || typeof claim.mainsnak.datavalue.value !== "string") {console.log("Missing claim value");continue;}
    const edgeId = claim.id;
    edges[edgeId] = {
      type: RelationType.Family, 
      fType: FamilialLink.childOf,
      text:"",
      _from: entryId,
      _to: claim.mainsnak.datavalue.value,
      ds: {
        [DatasetId.Wikidata]: edgeId
      },
      sources: [{
        fullUrl: 
      }]
    }
  }
}

function edgesFromEntry(entry: WDEntity): Dictionary<Edge> {
  const edges:Dictionary<Edge> = {};
  if (!entry.claims) {
    console.log("No claims to search edges in ", entry.id)
    return edges;
  }
  Object.assign(edges, fatherEdgesFromEntry(entry.id, entry.claims))
  return edges;
}


function checkWDResponse(response: AxiosResponse) {
  if (response.status !== 200) {
    console.error("Error in Wikidata response:");
    console.error(response.data);
    throw new Error(response.statusText);
  }
  return response.data;
}

function checkWDEntityData(data: WDResponseData) {
  if (data.success !== 1) {
    console.error("Wikidata response success check failed: " + data.success);
    console.log(data);
    throw new Error("Wikidata didn't indicate a sucessful response.");
  }
  if (data.warnings) {
    console.warn("Wikidata returned warnings!");
    console.warn(data.warnings);
  }
  return data.entities;
}

async function getWikidataGraph(entryPoint: string, depth: 3) {
  const url = wd.getEntities(
    entryPoint,
    WD_PARAMS.languages,
    WD_PARAMS.props,
    "json"
  );
  const wdEntities = checkWDEntityData(checkWDResponse(await axios.get(url)));
  // console.log("Response data:", wdEntities);

  // Convert the results to our format
  const dsEntities: Dictionary<Entity> = {};
  const dsEdges: Dictionary<Edge> = {};
  if (wdEntities) {
    for (let wdId in wdEntities) {
      const entity = entityFromEntry(wdEntities[wdId]);
      if (entity) dsEntities[wdId] = entity;
      else console.log("Failed to convert Entry " + wdId);
    }
  }

  // Send it back
  console.log("Found entities: ", dsEntities); 
  return { dsEntities, dsEdges };
}

/**
 * Upload new entities to the database.
 */
export const importWikidataGraph = (
  entryPointId: string,
  requestId: string
) => async (dispatch: Dispatch): Promise<void> => {
  // dispatch(actionRequest(requestId));

  try {
    const { dsEdges, dsEntities } = await getWikidataGraph(entryPointId, 3);
    // They're just dataset edges for now, without _key and with local _from/to
    // We don't want to show the edges and entities before having checked
    // if they already exists in the DB, so don't dispatch them yet.

    /*
    const familiarEntities = await findFamiliarEntities(dsEntities);
    // distpach() dsEdges and entities to the requestId
    if (familiarEntities.length > 0) {
      // dispatch() familiarEntities + dsEdges + dsEntities
      // As long as there're familiarEntities in the Redux Store,
      // the importer UI should show the merge selection screen.
    } else {
      // dispatch() dsEdges + dsEntities
      // When there're only edges and entities, the UI first shows the new entities
      // and asks which to import.
      // (and maybe display the edge texts in grey)
      await getEntitiesUpdate(requestId)(dispatch);
      // It also display which entities should be patched and which already exists.
    }
    */
  } catch (err) {
    console.error(err);
    // Dispatch err
  }
};

export const getEntitiesUpdate = (requestId: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  // dispatch(actionRequest(requestId));

  try {
  } catch (err) {
    console.error(err);
    // Dispatch err
  }
};

export const clearPostRequest = (requestId: string) => (
  dispatch: Dispatch
) => {};

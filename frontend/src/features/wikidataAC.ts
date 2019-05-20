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
  Edge,
  RelationType as RT,
  FamilialLink as FL,
  SourceLinkType,
  isClaimSnakEntityValue,
  SimilarEntities
} from "../utils/types";
import CONSTS from "../utils/consts";
import { RootStore } from "../Store";
import { arrayWithoutDuplicates } from "../utils/utils";
import { loadEntities } from "./entitiesLoadAC";
import wd, { Property, Entity as WDEntity } from "wikidata-sdk";
import { Dictionary as WDDictionary } from "wikidata-sdk/types/helper";
import * as actions from "./wikidataActions";

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

type PropertyMapping = {
  invert?: boolean;
  type: RT;
  fType?: FL;
};
const invert = true;
const propertiesToEdgeType: Dictionary<PropertyMapping> = {
  P22: { type: RT.Family, fType: FL.childOf }, // Father
  P25: { type: RT.Family, fType: FL.childOf }, // Mother
  P40: { type: RT.Family, fType: FL.childOf, invert }, // Child
  P26: { type: RT.Family, fType: FL.spouseOf }, // Spouse
  P3373: { type: RT.Family, fType: FL.siblingOf }, // Sibling
  P1038: { type: RT.Family, fType: FL.other } // Relative
};

function familyEdges(
  entryId: string,
  claims: WDDictionary<wd.Claim[]>
): Dictionary<Edge> {
  const edges: Dictionary<Edge> = {};
  for (let propertyId in propertiesToEdgeType) {
    // Check if we have a property of this type
    if (!claims.hasOwnProperty(propertyId)) {
      // console.log("No " + propertyId + " claims");
      continue;
    }
    // We do! So we can select the appropriate mapping
    const mapping = propertiesToEdgeType[propertyId];
    // There might be multiple claims, pointing to different entities (or not)
    // -> Convert them all!
    for (let claim of claims[propertyId]) {
      if (isClaimSnakEntityValue(claim.mainsnak.datavalue)) {
        const edgeId = claim.id;
        const entryId2 = claim.mainsnak.datavalue.value.id;
        edges[edgeId] = {
          type: mapping.type,
          fType: mapping.fType,
          text: "",
          _from: invert ? entryId2 : entryId,
          _to: invert ? entryId : entryId2,
          ds: {
            [DatasetId.Wikidata]: edgeId
          },
          sources: [
            {
              fullUrl: wd.getSitelinkUrl("wikidata", entryId),
              sourceKey: CONSTS.WIKIDATA_SOURCE_KEY,
              comments: [],
              type: SourceLinkType.Confirms
            }
          ]
        };
      } else {
        console.log("Missing claim value", claim);
      }
    }
  }
  return edges;
}

function edgesFromEntry(entry: WDEntity): Dictionary<Edge> {
  const edges: Dictionary<Edge> = {};
  if (!entry.claims) {
    console.log("No claims to search edges in ", entry.id);
    return edges;
  }
  Object.assign(edges, familyEdges(entry.id, entry.claims));
  return edges;
}

async function checkWDResponse(response: AxiosResponse) {
  if (response.status !== 200) {
    console.error("Error in Wikidata response:");
    console.error(response.data);
    throw new Error(response.statusText);
  }
  return response.data;
}

async function checkWDEntityData(data: WDResponseData) {
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

/**
 * Fetch a list of entries and put the entities and edges that could be
 * converted from it in the given object under their respective ID.
 * This mutates dsEntities and dsEdges.
 * @param  entryIds   [description]
 * @param  dsEntities [description]
 * @param  dsEdges    [description]
 * @return            [description]
 */
async function getElementsFromWikidataEntries(
  entryIds: string[],
  dsEntities: Dictionary<Entity>,
  dsEdges: Dictionary<Edge>
) {
  const url = wd.getEntities(
    entryIds,
    WD_PARAMS.languages,
    WD_PARAMS.props,
    "json"
  );
  const wdEntities = await checkWDEntityData(
    await checkWDResponse(await axios.get(url))
  );

  // Convert the results to our format
  if (wdEntities) {
    for (let wdId in wdEntities) {
      const entity = entityFromEntry(wdEntities[wdId]);
      if (entity) {
        dsEntities[wdId] = entity;
        Object.assign(dsEdges, edgesFromEntry(wdEntities[wdId]));
      } else console.log("Failed to convert Entry " + wdId);
    }
  }
}

/**
 * Tries to find relations and people up to the (depth) degree
 * @param  entryPoint [description]
 * @param  depth      [description]
 * @return            [description]
 */
async function getWikidataGraph(entryPoint: string, depth: number) {
  const dsEntities: Dictionary<Entity> = {};
  const dsEdges: Dictionary<Edge> = {};
  var entriesToQuery: string[] = [entryPoint];
  for (let i = 0; i < depth && entriesToQuery.length > 0; i += 1) {
    await getElementsFromWikidataEntries(entriesToQuery, dsEntities, dsEdges);
    // Select the next entities that will need to be queried.
    entriesToQuery = [];
    for (let edgeId in dsEdges) {
      let potentialId1 = dsEdges[edgeId]._to;
      let potentialId2 = dsEdges[edgeId]._from;
      if (!dsEntities.hasOwnProperty(potentialId1))
        entriesToQuery.push(potentialId1);
      if (!dsEntities.hasOwnProperty(potentialId2))
        entriesToQuery.push(potentialId2);
      entriesToQuery = arrayWithoutDuplicates(entriesToQuery);
    }
  }
  console.log(
    "Arrived at maximum depth. Will not query those elements any further: ",
    entriesToQuery
  );

  // Send it back
  console.log("Found entities: ", dsEntities);
  console.log("Found edges: ", dsEdges);
  return { dsEntities, dsEdges };
}

async function findFamiliarEntities(dsEntities: Entity[]) {
  return (await api.post("/dataimport/similar/entities", dsEntities, {
    params: {
      datasetid: DatasetId.Wikidata,
      unchangeable: ["type"]
    },
    // `paramsSerializer` is an optional function in charge of serializing `params`
    // This is the format that the ArangoDB Foxx/joi backend supports
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: "repeat" });
    }
  })).data as SimilarEntities;
}

/**
 * Upload new entities to the database.
 */
export const fetchWikidataGraphAndFamiliarEntities = (
  entryId: string
) => async (dispatch: Dispatch): Promise<void> => {
  console.log("fetchWikidataGraphAndFamiliarEntities");
  dispatch(actions.requestedDataset(entryId));

  try {
    const { dsEdges, dsEntities } = await getWikidataGraph(entryId, 2);

    dispatch(actions.fetchedDataset(entryId, dsEdges, dsEntities));
    // They're just dataset edges for now, without _key and with local _from/to

    dispatch(actions.requestedSimilarEntities(entryId));
    const similarEntities = await findFamiliarEntities(
      Object.keys(dsEntities).map(key => dsEntities[key])
    );
    dispatch(actions.fetchedSimilarEntities(entryId, similarEntities));

    /*
    // distpach() dsEdges and entities to the requestId
    if (similarEntities.length > 0) {
      // dispatch() similarEntities + dsEdges + dsEntities
      // As long as there're similarEntities in the Redux Store,
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
    dispatch(
      actions.dataimportError(entryId, {
        eData: err,
        eMessage: err && err.message ? err.message : "Unknown error!",
        eStatus: err.code
      })
    );
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

import { Dispatch } from "redux";
import axios, { AxiosError, AxiosResponse } from "axios";
import qs from "qs";
import update from "immutability-helper";
import wd, { Property, Entity as WDEntity } from "wikidata-sdk";
import { Dictionary as WDDictionary } from "wikidata-sdk/types/helper";

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
  SourceLinkType,
  isClaimSnakEntityValue,
  SimilarEntities,
  ImportStage,
  DatasetDiffResponseData
} from "../utils/types";
import CONSTS from "../utils/consts";
import { RootStore, DataImportState } from "../Store";
import {
  arrayWithoutDuplicates,
  errToErrorPayload,
  getDsKeyObject,
  getKeyObject,
  isEmptyObject
} from "../utils/utils";
import * as actions from "./wikidataActions";
import * as CONFIG from "../utils/wikidata-config";

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

const ENT_OVERRIDING_PROPS: Array<keyof Entity> = ["name", "text"];
const ENT_UNCHANGEABLE_PROPS: Array<keyof Entity> = ["type"];
const REL_OVERRIDING_PROPS: Array<keyof Edge> = [
  "type",
  "fType",
  "text",
  "owned",
  "amount",
  "exactAmount",
  "_from",
  "_to"
];
const REL_UNCHANGEABLE_PROPS: Array<keyof Edge> = [];

type WDResponseData = {
  success?: number;
  entities?: WDDictionary<WDEntity>;
  warnings?: any;
};

function selectLang(list: WDDictionary<wd.LanguageEntry>) {
  for (let lang of CONFIG.preferredLangs) {
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
    if (CONFIG.entityTypeMap[entityType].indexOf(instanceOf) >= 0)
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
    `Couldn't detect type of entry: ${entry.id} - ${nameFromEntry(entry)}
    Wikidata says it's an instance of: `,
    claims_instanceOf
  );
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

function familyEdges(
  entryId: string,
  claims: WDDictionary<wd.Claim[]>
): Dictionary<Edge> {
  const edges: Dictionary<Edge> = {};
  for (let propertyId in CONFIG.propertiesMap) {
    // Check if we have a property of this type
    if (!claims.hasOwnProperty(propertyId)) {
      // console.log("No " + propertyId + " claims");
      continue;
    }
    // We do! So we can select the appropriate mapping
    const mapping = CONFIG.propertiesMap[propertyId];
    // There might be multiple claims, pointing to different entities (or not)
    // -> Convert them all!
    for (let claim of claims[propertyId]) {
      if (isClaimSnakEntityValue(claim.mainsnak.datavalue)) {
        const edgeId = claim.id;
        const entryId2 = claim.mainsnak.datavalue.value.id;
        edges[edgeId] = {
          type: mapping.type,
          fType: mapping.fType,
          text: mapping.text || "",
          _from: mapping.invert ? entryId2 : entryId,
          _to: mapping.invert ? entryId : entryId2,
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

async function checkAxiosResponse(response: AxiosResponse) {
  if (response.status !== 200) {
    console.error("Error in response:");
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
async function getElementsFromWikidataEntries(entryIds: string[]) {
  const urls = wd.getManyEntities(
    entryIds,
    WD_PARAMS.languages,
    WD_PARAMS.props,
    "json"
  );
  const dsEntities: Dictionary<Entity> = {};
  const dsEdges: Dictionary<Edge> = {};
  const wdEntities: WDDictionary<wd.Entity> = {};
  for (let url of urls) {
    const list = await checkWDEntityData(
      await checkAxiosResponse(await axios.get(url))
    );
    Object.assign(wdEntities, list);
  }

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
  return { dsEntities, dsEdges };
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
  for (let i = 0; i <= depth && entriesToQuery.length > 0; i += 1) {
    // Only get the edges if we'll query those entries
    const depthResults = await getElementsFromWikidataEntries(entriesToQuery);
    // Merge in the valid entities
    Object.assign(dsEntities, depthResults.dsEntities);
    // Select the next entities that will need to be queried.
    entriesToQuery = [];
    for (let id in depthResults.dsEdges) {
      let to = depthResults.dsEdges[id]._to;
      let from = depthResults.dsEdges[id]._from;
      // Query entities that we don't know yet.
      // Note: with this, we might re-query entities that are incompatible
      if (!dsEntities.hasOwnProperty(to)) entriesToQuery.push(to);
      if (!dsEntities.hasOwnProperty(from)) entriesToQuery.push(from);
    }
    entriesToQuery = arrayWithoutDuplicates(entriesToQuery);
    console.log(`Degree ${i + 1} -> ${entriesToQuery.length} new entities.`);
    // Keep going deeper in the graph?
    if (i === depth)
      console.log(
        "Arrived at maximum depth. Will not query those elements any further: ",
        entriesToQuery
      );
    else Object.assign(dsEdges, depthResults.dsEdges);
  }

  // Filter edges that link toward entities we couldn't add:
  for (let id in dsEdges) {
    if (!dsEntities[dsEdges[id]._to] || !dsEntities[dsEdges[id]._from]) {
      console.log(
        "Ignoring edge " + id + " because it point to a missing entity",
        dsEdges[id]
      );
      delete dsEdges[id];
    }
  }

  // Filter edges that link toward entities we couldn't add:
  for (let id in dsEdges) {
    if (dsEdges[id].text)
      dsEdges[id].text = dsEdges[id].text
        .replace("$from", dsEntities[dsEdges[id]._from].name)
        .replace("$to", dsEntities[dsEdges[id]._to].name);
  }

  // Send it back
  console.log("Found entities: ", dsEntities);
  console.log("Found edges: ", dsEdges);
  return { dsEntities, dsEdges };
}

async function findFamiliarEntities(
  dsEntities: Entity[]
): Promise<SimilarEntities> {
  return await checkAxiosResponse(
    await api.post("/dataimport/similar/entities", dsEntities, {
      params: {
        datasetid: DatasetId.Wikidata,
        unchangeable: ["type"]
      },
      // `paramsSerializer` is an optional function in charge of serializing `params`
      // This is the format that the ArangoDB Foxx/joi backend supports
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      }
    })
  );
}

/**
 * Upload new entities to the database.
 */
export const fetchWikidataGraphAndFamiliarEntities = (
  entryId: string
) => async (dispatch: Dispatch, getState: () => RootStore): Promise<void> => {
  console.log("fetchWikidataGraphAndFamiliarEntities");
  dispatch(actions.requestedDataset(entryId));

  try {
    const { dsEdges, dsEntities } = await getWikidataGraph(entryId, 3);
    dispatch(actions.fetchedDataset(entryId, dsEdges, dsEntities));
    // They're just dataset edges for now, without _key and with local _from/to

    dispatch(actions.requestedSimilarEntities(entryId));
    const similarEntities = await findFamiliarEntities(
      Object.keys(dsEntities).map(key => dsEntities[key])
    );
    dispatch(actions.fetchedSimilarEntities(entryId, similarEntities));

    if (isEmptyObject(similarEntities)) {
      // CHAIN: we can skip the user confirmation of the merge;
      diffDataset(entryId)(dispatch, getState);
    }
  } catch (err) {
    console.error(err);
    dispatch(actions.dataimportError(entryId, errToErrorPayload(err)));
  }
};

/**
 * Merge selected entities from the dataset with the database.
 */
export const patchSimilarEntities = (entryId: string) => async (
  dispatch: Dispatch,
  getState: () => RootStore
): Promise<void> => {
  console.log("patchSimilarEntities");
  const state: DataImportState = getState().dataimport[entryId];

  const entitiesToPatch: Entity[] = [];
  for (let dsid in state.similarEntities) {
    const selection = state.similarEntitiesSelection[dsid];
    if (typeof selection === "number" && selection >= 0)
      entitiesToPatch.push(state.similarEntities[dsid][selection]);
  }

  try {
    if (entitiesToPatch.length > 0) {
      dispatch(
        actions.wentToStage(entryId, ImportStage.PostingSimilarEntities)
      );
      const patchedEntities: Array<Entity> = await checkAxiosResponse(
        await api.patch("/entities", entitiesToPatch)
      );
      // No need to remember those patchedEntities, as we will refetch them
      // when diffing the dataset and the database.
      dispatch(actions.wentToStage(entryId, ImportStage.PostedSimilarEntities));
    }
  } catch (err) {
    console.error(err);
    dispatch(actions.dataimportError(entryId, errToErrorPayload(err)));
  }

  // CHAIN: we can directly check what needs to be updated
  diffDataset(entryId)(dispatch, getState);
};

export const diffDataset = (entryId: string) => async (
  dispatch: Dispatch,
  getState: () => RootStore
): Promise<void> => {
  console.log("diffDataset");
  const state: DataImportState = getState().dataimport[entryId];

  const entities = Object.keys(state.dsEntities).map(
    key => state.dsEntities[key]
  );
  const edges = Object.keys(state.dsEdges).map(key => state.dsEdges[key]);

  try {
    var entUpdates: DatasetDiffResponseData<Entity> = {
      existingElements: [],
      elementsToPost: [],
      elementsToPatch: []
    };
    if (entities.length > 0) {
      dispatch(actions.wentToStage(entryId, ImportStage.FetchingEntityDiff));
      entUpdates = await checkAxiosResponse(
        await api.post("/dataimport/diff", entities, {
          params: {
            datasetid: DatasetId.Wikidata,
            collection: "entities",
            unchangeable: ENT_UNCHANGEABLE_PROPS,
            overriding: ENT_OVERRIDING_PROPS
          },
          paramsSerializer: function(params) {
            return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
      );
      console.log("ENTITIES:", entUpdates);
      dispatch(actions.fetchedEntitiesDiff(entryId, entUpdates));
    }

    // Compute which edges can already have their _from and _to keys set
    // so that the diff doesn't unecessary include them in the update.
    // If the entity already exists, there's a chance that the edge too.
    // This is all necessary in case the _from or _to props change,
    // we would then need to update it.
    const dbEntitiesByDskey = Object.assign(
      {},
      getDsKeyObject(entUpdates.existingElements, DatasetId.Wikidata),
      getDsKeyObject(entUpdates.elementsToPatch, DatasetId.Wikidata)
    );
    // Needed to revert the effects later.
    const dbEntitiesByDbkey = Object.assign(
      {},
      getKeyObject(entUpdates.existingElements, "_key"),
      getKeyObject(entUpdates.elementsToPatch, "_key")
    );
    const dbEdges = dsEdgesToDbEdges(edges, dbEntitiesByDskey, "entities/");

    // Diff the edges
    var relUpdates: DatasetDiffResponseData<Edge> = {
      existingElements: [],
      elementsToPost: [],
      elementsToPatch: []
    };
    if (dbEdges.length > 0) {
      dispatch(actions.wentToStage(entryId, ImportStage.FetchingEdgeDiff));
      relUpdates = await checkAxiosResponse(
        await api.post("/dataimport/diff", dbEdges, {
          params: {
            datasetid: DatasetId.Wikidata,
            collection: "relations",
            unchangeable: REL_UNCHANGEABLE_PROPS,
            overriding: REL_OVERRIDING_PROPS
          },
          paramsSerializer: function(params) {
            return qs.stringify(params, { arrayFormat: "repeat" });
          }
        })
      );
      const dsRelUpdate = {
        existingElements: dbEdgesToDsEdges(
          relUpdates.existingElements,
          dbEntitiesByDbkey,
          "entities/"
        ),
        elementsToPost: dbEdgesToDsEdges(
          relUpdates.elementsToPost,
          dbEntitiesByDbkey,
          "entities/"
        ),
        elementsToPatch: dbEdgesToDsEdges(
          relUpdates.elementsToPatch,
          dbEntitiesByDbkey,
          "entities/"
        )
      };
      console.log("EDGES (db):", relUpdates);
      console.log("EDGES (ds):", dsRelUpdate);
      dispatch(actions.fetchedEdgesDiff(entryId, dsRelUpdate));
    }
    // Now we can ask the user to confirm the dataset import!
    dispatch(
      actions.wentToStage(entryId, ImportStage.WaitingForDiffConfirmation)
    );
  } catch (err) {
    console.error(err);
    dispatch(actions.dataimportError(entryId, errToErrorPayload(err)));
  }
};

export const confirmImport = (entryId: string) => async (
  dispatch: Dispatch,
  getState: () => RootStore
): Promise<void> => {
  console.log("confirmImport");
  const state: DataImportState = getState().dataimport[entryId];

  var patchedEntities: Entity[] = [];
  var postedEntities: Entity[] = [];

  try {
    dispatch(actions.wentToStage(entryId, ImportStage.PostingEntityDiff));
    if (state.entitiesToPost.length > 0) {
      console.log("==== POSTing entities ====");
      postedEntities = await checkAxiosResponse(
        await api.post(`/entities`, state.entitiesToPost)
      );
      console.log("POSTed entities:", postedEntities);
    }
    if (state.entitiesToPatch.length > 0) {
      console.log("==== PATCHing entities ====");
      patchedEntities = await checkAxiosResponse(
        await api.patch(`/entities`, state.entitiesToPatch)
      );
      console.log("PATCHed entities:", patchedEntities);
    }
    dispatch(actions.wentToStage(entryId, ImportStage.PostedEntityDiff));

    // The manually merged entities were already fetched back into
    // existing entities, so no need to put them in allEntities
    const allEntities = Object.assign(
      {},
      getDsKeyObject(state.existingEntities, DatasetId.Wikidata),
      getDsKeyObject(postedEntities, DatasetId.Wikidata),
      getDsKeyObject(patchedEntities, DatasetId.Wikidata)
    );
    const entitiesCount = Object.keys(allEntities).length;
    console.log(`===== Done importing ${entitiesCount} entities =====`);

    const dbEdgesToPost = dsEdgesToDbEdges(state.edgesToPost, allEntities);
    const dbEdgesToPatch = dsEdgesToDbEdges(state.edgesToPatch, allEntities);
    var patchedEdges: Entity[] = [];
    var postedEdges: Entity[] = [];

    dispatch(actions.wentToStage(entryId, ImportStage.PostingEdgeDiff));
    if (dbEdgesToPost.length > 0) {
      console.log("==== POSTing edges ====");
      postedEdges = await checkAxiosResponse(
        await api.post(`/relations`, dbEdgesToPost)
      );
      console.log("POSTed edges:", postedEdges);
    }
    if (dbEdgesToPatch.length > 0) {
      console.log("==== PATCHing edges ====");
      patchedEdges = await checkAxiosResponse(
        await api.patch(`/relations`, dbEdgesToPatch)
      );
      console.log("PATCHed edges:", patchedEdges);
    }
    dispatch(actions.wentToStage(entryId, ImportStage.PostedEdgeDiff));
    dispatch(actions.wentToStage(entryId, ImportStage.ImportSuccessful));
  } catch (err) {
    console.error(err);
    dispatch(actions.dataimportError(entryId, errToErrorPayload(err)));
  }
};

function dsEdgesToDbEdges(
  dsEdges: Edge[],
  dbEntitiesByDsid: Dictionary<Entity>,
  prefix: string = ""
) {
  return dsEdges.map(edge =>
    dbEntitiesByDsid[edge._from] && dbEntitiesByDsid[edge._to]
      ? update(edge, {
          _from: {
            $set: (prefix + dbEntitiesByDsid[edge._from]._key) as string
          },
          _to: { $set: (prefix + dbEntitiesByDsid[edge._to]._key) as string }
        })
      : edge
  );
}

function dbEdgesToDsEdges(
  dbEdges: Edge[],
  dbEntitiesByDbid: Dictionary<Entity>,
  prefix: string = ""
) {
  return (
    dbEdges
      // .filter(edge => {
      //   const from = dbEntitiesByDbid[edge._from.replace(prefix, "")];
      //   const to = dbEntitiesByDbid[edge._to.replace(prefix, "")];
      //   // Ignore edges for which we don't have both entities in the database.
      //   const keep = Boolean(from) && Boolean(to);
      //   if (!keep)
      //     console.warn(
      //       "Ignoring edge " +
      //         (edge.ds ? edge.ds[DatasetId.Wikidata] : "MISSING_ID") +
      //         " because " +
      //         (from ? (to ? "none" : edge._to) : edge._from) +
      //         " is missing"
      //     );
      //   return keep;
      // })
      .map(edge => {
        const from = dbEntitiesByDbid[edge._from.replace(prefix, "")];
        const to = dbEntitiesByDbid[edge._to.replace(prefix, "")];
        if (from && from.ds)
          edge = update(edge, {
            _from: { $set: from.ds[DatasetId.Wikidata] as string }
          });
        if (to && to.ds)
          edge = update(edge, {
            _to: { $set: to.ds[DatasetId.Wikidata] as string }
          });
        return edge;
      })
  );
}

export const clearPostRequest = (requestId: string) => (
  dispatch: Dispatch
) => {};

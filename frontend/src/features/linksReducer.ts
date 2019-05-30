import ACTIONS from "../utils/ACTIONS";
import {
  EdgePreview,
  Edge,
  Connections,
  LinkedEntities,
  ConnectionsList,
} from "../utils/types";
import update from "immutability-helper";
import { AnyAction } from "redux";
import { getSimplifiedEdge, getRelationId } from "../utils/utils";

interface SubState {
  data: {
    byentity: { [baseEntityKey: string]: Connections };
    all: { [edgeKey: string]: EdgePreview };
    byrelation: { [relationKey: string]: { [edgeKey: string]: EdgePreview } };
  };
  status: {};
  errors: {};
}
const defaultState: SubState = {
  data: {
    byentity: {},
    all: {},
    byrelation: {},
  },
  status: {},
  errors: {},
};

export default (state = defaultState, action: AnyAction) => {
  switch (action.type) {
    // When a new relation element is added, we get the new edge as a
    // confirmation back from the server, so we add it to the store at this
    // point.
    case ACTIONS.EdgeSaveSuccess:
      // Just invalidate to cause a refetch for now. // TODO: Avoid
      const edge = getSimplifiedEdge(action.payload as Edge);
      return update(state, {
        status: { $unset: [edge._from, edge._to] },
      });
    //   const edge = getSimplifiedEdge(action.payload as Edge);
    //   const edgePreview = getEdgePreview(edge);
    //
    //   const hasFromState = Boolean(state.data.byentity[edge._from]);
    //   const hasToState = Boolean(state.data.byentity[edge._to]);
    //   const fUpdate = hasFromState ? { array: { $push: edgePreview } } : {};
    //   const tUpdate = hasToState ? { array: { $push: edgePreview } } : {};
    //   return update(state, {
    //     data: {
    //       byentity: {
    //         [edge._from]: fUpdate,
    //         [edge._to]: tUpdate
    //       },
    //       all: { [edgePreview._key]: edgePreview }
    //     }
    //   });
    case ACTIONS.EdgeDeleteSuccess:
      // Just invalidate to cause a refetch for now. // TODO: Avoid
      return update(state, {
        status: { $unset: [action.meta._from, action.meta._to] },
      });
    case ACTIONS.LinksLoadRequested:
      const key1 = action.meta.entityKey as string;
      return update(state, {
        status: { [key1]: { $set: action.status } },
      });
    case ACTIONS.LinksLoadSuccess:
      if (!action.payload || !action.payload.edges) {
        console.error("Invalid action: " + ACTIONS.LinksLoadSuccess);
        return state;
      }

      const edges = action.payload.edges as Array<EdgePreview>;
      const entityKey = action.meta.entityKey;

      const edgeList: { [key: string]: EdgePreview } = {};
      const cList: ConnectionsList = {};
      const byRelation: {
        [relationId: string]: { [edgeKey: string]: EdgePreview };
      } = {};
      // const linkedEntities: LinkedEntities = {};

      for (let e of edges) {
        // Pre-process the edge
        const edge = getSimplifiedEdge(e);
        // To be saved in /data/all
        edgeList[edge._key] = edge;
        // To be saved in /data/byentity/:fromKey and
        //                /data/byentity/:toKey
        addEdgeToBothEntities(cList, edge);
        // Count the number of element between each persons (both ways)
        addLinkToEntityList(cList, edge._from, edge._to);
        addLinkToEntityList(cList, edge._to, edge._from);
        // To be saved in /data/byrelation/:relationId
        const relationId = getRelationId(edge._from, edge._to) as string;
        if (!byRelation[relationId]) byRelation[relationId] = {}; // Vivify
        byRelation[relationId][edge._key] = edge;
      }
      // For each entry that contains the list of entries it's connected
      // to and the number of connections
      for (let entity1Key in cList) {
        // Get an array that contains all inforamtion and sort it.
        let entries = Object.entries(cList[entity1Key].toEntity).sort(
          (a, b) => b[1] - a[1]
        );
        cList[entity1Key].entities = entries;
      }
      return update(state, {
        data: {
          byentity: { $merge: cList },
          all: { $merge: edgeList },
          // A shallow merge is okay, because this action should return ALL
          // the edges between the 2 entities
          byrelation: { $merge: byRelation },
        },
        status: { [entityKey]: { $set: action.status } },
        errors: { [entityKey]: { $set: action.meta.error } },
      });
    case ACTIONS.LinksLoadError:
      const key3 = action.meta.relationId as string;
      return update(state, {
        data: { [key3]: { $set: null } },
        status: { [key3]: { $set: action.status } },
        errors: { [key3]: { $set: action.meta.error } },
      });
    default:
      return state;
  }
};

function addEdgeToBothEntities(
  listByEntity: { [key: string]: Connections },
  edge: EdgePreview
) {
  if (!listByEntity[edge._from])
    listByEntity[edge._from] = genEmptyConnections(edge);
  else listByEntity[edge._from].edges.push(edge);
  if (!listByEntity[edge._to])
    listByEntity[edge._to] = genEmptyConnections(edge);
  else listByEntity[edge._to].edges.push(edge);
}

const genEmptyConnections = (edge?: EdgePreview): Connections => ({
  edges: edge ? [edge] : [],
  entities: [],
  toEntity: {},
});

function addLinkToEntityList(list: ConnectionsList, k1: string, k2: string) {
  if (!list[k1]) list[k1] = genEmptyConnections();
  if (!list[k1].toEntity[k2]) list[k1].toEntity[k2] = 1;
  else list[k1].toEntity[k2] += 1;
}

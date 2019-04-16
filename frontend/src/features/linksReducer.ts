import ACTIONS from "../utils/ACTIONS";
import {
  Action,
  EdgePreview,
  Edge,
  ConnectedEntities,
  LinkedEntities
} from "../utils/types";
import update from "immutability-helper";
import { getSimplifiedEdge } from "../utils/utils";

interface SubState {
  data: {
    bylinkedentities: { [key: string]: [string, number][] };
    byentity: { [key: string]: ConnectedEntities };
    bykey: { [key: string]: EdgePreview };
  };
  status: {};
  errors: {};
}
const defaultState: SubState = {
  data: {
    bylinkedentities: {},
    byentity: {},
    bykey: {}
  },
  status: {},
  errors: {}
};

export default (state = defaultState, action: Action) => {
  switch (action.type) {
    // When a new relation element is added, we get the new edge as a
    // confirmation back from the server, so we add it to the store at this
    // point.
    case ACTIONS.EdgeSaveSuccess:
      // Just invalidate to cause a refetch for now.
      const edge = getSimplifiedEdge(action.payload as Edge);
      return update(state, {
        status: { $unset: [edge._from, edge._to] }
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
    //       bykey: { [edgePreview._key]: edgePreview }
    //     }
    //   });
    case ACTIONS.LinksLoadRequested:
      const key1 = action.meta.entityKey as string;
      return update(state, {
        status: { [key1]: { $set: action.status } }
      });
    case ACTIONS.LinksLoadSuccess:
      if (!action.payload || !action.payload.edges) {
        console.error("Invalid action: " + ACTIONS.LinksLoadSuccess);
        return state;
      }
      const edges = action.payload.edges as Array<EdgePreview>;
      const edgesMap: { [key: string]: EdgePreview } = {};
      const entityKey = action.meta.entityKey as string;
      const listByEntity: { [key: string]: ConnectedEntities } = {};
      const linkedEntities: LinkedEntities = {};
      for (let e of edges) {
        // Pre-process the edge
        const edge = getSimplifiedEdge(e);
        // To be saved in /data/bykey
        edgesMap[edge._key] = edge;
        // To be saved in /data/byentity/:fromKey and
        //                /data/byentity/:toKey
        addEdgeToBothEntities(listByEntity, edge);
        // Count the number of element between each persons (both ways)
        addLinkToEntityList(linkedEntities, edge._from, edge._to);
        addLinkToEntityList(linkedEntities, edge._to, edge._from);
      }
      // For each entry that contains the list of entries it's connected
      // to and the number of connections
      for (let fKey in linkedEntities) {
        // Get an array that contains all inforamtion and sort it.
        let entries = Object.entries(linkedEntities[fKey]).sort((a, b) => {
          return b[1] - a[1];
        });
        listByEntity[fKey].entities = entries;
      }
      return update(state, {
        data: {
          byentity: { $merge: listByEntity },
          bykey: { $merge: edgesMap }
        },
        status: { [entityKey]: { $set: action.status } },
        errors: { [entityKey]: { $set: action.meta.error } }
      });
    case ACTIONS.LinksLoadError:
      const key3 = action.meta.relationId as string;
      return update(state, {
        data: { [key3]: { $set: null } },
        status: { [key3]: { $set: action.status } },
        errors: { [key3]: { $set: action.meta.error } }
      });
    default:
      return state;
  }
};

function addEdgeToBothEntities(
  updates: { [key: string]: ConnectedEntities },
  edge: EdgePreview
) {
  if (!updates[edge._from])
    updates[edge._from] = { edges: [edge], entities: [] };
  else updates[edge._from].edges.push(edge);
  if (!updates[edge._to]) updates[edge._to] = { edges: [edge], entities: [] };
  else updates[edge._to].edges.push(edge);
}

function addLinkToEntityList(list: LinkedEntities, k1: string, k2: string) {
  if (!list[k1]) list[k1] = {};
  if (!list[k1][k2]) list[k1][k2] = 1;
  else list[k1][k2] += 1;
}

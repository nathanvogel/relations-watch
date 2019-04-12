import ACTIONS from "../utils/ACTIONS";
import {
  Action,
  EdgePreview,
  Edge,
  ConnectedEntities,
  CommonEdge
} from "../utils/types";
import update from "immutability-helper";
import { simplifyEdge, getEdgePreview } from "../utils/utils";

interface SubState {
  data: {
    byentity: { [key: string]: ConnectedEntities };
    bykey: { [key: string]: EdgePreview };
  };
  status: {};
  errors: {};
}
const defaultState: SubState = {
  data: {
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
    case ACTIONS.EdgePostSuccess:
      // Just invalidate to cause a refetch for now.
      const edge = simplifyEdge(action.payload as Edge);
      return update(state, {
        status: { $unset: [edge._from, edge._to] }
      });
    //   const edge = simplifyEdge(action.payload as Edge);
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
    case ACTIONS.LinksRequested:
      const key1 = action.meta.entityKey as string;
      return update(state, {
        status: { [key1]: { $set: action.status } }
      });
    case ACTIONS.LinksReceived:
      if (!action.payload || !action.payload.edges) {
        console.error("Invalid action: " + ACTIONS.LinksReceived);
        return state;
      }
      const edges = action.payload.edges as Array<EdgePreview>;
      const edgesMap: { [key: string]: EdgePreview } = {};
      const entityKey = action.meta.entityKey as string;
      const updates: { [key: string]: ConnectedEntities } = {};
      for (let edge of edges) {
        // Pre-process the edge
        edge = simplifyEdge(edge);
        // To be saved in /data/bykey
        edgesMap[edge._key] = edge;
        // To be saved in /data/byentity/:fromKey and
        //                /data/byentity/:toKey
        makeUpdates(updates, edge);
      }
      return update(state, {
        data: {
          byentity: { $merge: updates },
          bykey: { $merge: edgesMap }
        },
        status: { [entityKey]: { $set: action.status } },
        errors: { [entityKey]: { $set: action.meta.error } }
      });
    case ACTIONS.LinksError:
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

function makeUpdates(
  updates: { [key: string]: ConnectedEntities },
  edge: EdgePreview
) {
  if (!updates[edge._from]) updates[edge._from] = { array: [edge] };
  else updates[edge._from].array.push(edge);
  if (!updates[edge._to]) updates[edge._to] = { array: [edge] };
  else updates[edge._to].array.push(edge);
}

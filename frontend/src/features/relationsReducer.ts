import ACTIONS from "../utils/ACTIONS";
import { Action, Edge, Relation } from "../utils/types";
import update from "immutability-helper";
import { getRelationId, getSimplifiedEdge } from "../utils/utils";

interface SubState {
  data: { [key: string]: Array<Edge> };
  status: {};
  errors: {};
}
const defaultState: SubState = { data: {}, status: {}, errors: {} };

export default (state = defaultState, action: Action) => {
  switch (action.type) {
    // When a new relation element is added, we get the new edge as a
    // confirmation back from the server, so we add it to the store at this
    // point. The data is also separately saved under /requests/...
    // Note: this is also called when an edge is patched.
    case ACTIONS.EdgePostSuccess:
      const edge = getSimplifiedEdge(action.payload as Edge);
      const relationId = getRelationId(edge._from, edge._to);
      if (!relationId) {
        console.error("Invalid Edge received on " + ACTIONS.EdgePostSuccess);
        return state;
      }

      // Check if we're editing an existing edge. If so, replace it and don't
      // push it in the array.
      const storeEdges: Edge[] = state.data[relationId] as Edge[];
      var index = storeEdges.findIndex(e => e._key === edge._key);
      if (index >= 0) {
        return update(state, {
          data: { [relationId]: { [index]: { $set: edge } } }
        });
      }
      // It's a new edge, so we can simply push it.
      return update(state, {
        data: { [relationId]: { $push: [edge] } }
      });
    // Regular status/error/data actions.
    case ACTIONS.RelationRequested:
      const key1 = action.meta.relationId as string;
      return update(state, {
        status: { [key1]: { $set: action.status } }
      });
    case ACTIONS.RelationReceived:
      const serverEdges = action.payload as Array<Edge>;
      const relation: Array<Edge> = [];
      for (let e of serverEdges) {
        relation.push(getSimplifiedEdge(e));
      }
      const relationId2 = action.meta.relationId;
      if (!relationId2) {
        console.error("Invalid edges received on " + ACTIONS.RelationReceived);
        return state;
      }
      return update(state, {
        data: { [relationId2]: { $set: relation } },
        status: { [relationId2]: { $set: action.status } },
        errors: { [relationId2]: { $set: action.meta.error } }
      });
    case ACTIONS.RelationError:
      const key3 = action.meta.relationId as string;
      return update(state, {
        data: { $unset: [key3] },
        status: { [key3]: { $set: action.status } },
        errors: { [key3]: { $set: action.meta.error } }
      });
    default:
      return state;
  }
};

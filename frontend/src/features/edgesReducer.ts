import ACTIONS from "../utils/ACTIONS";
import { Action, Edge } from "../utils/types";
import update from "immutability-helper";
import { getSimplifiedEdge } from "../utils/utils";

const defaultState = { data: {}, status: {}, errors: {} };

export default (state = defaultState, action: Action) => {
  switch (action.type) {
    case ACTIONS.EdgeRequested:
      const key1 = action.meta.edgeKey as string;
      return update(state, {
        status: { [key1]: { $set: action.status } }
      });
    case ACTIONS.EdgeReceived:
      const key2 = action.meta.edgeKey as string;
      const edge1 = getSimplifiedEdge(action.payload as Edge);
      return update(state, {
        data: { [key2]: { $set: edge1 } },
        status: { [key2]: { $set: action.status } }
      });
    case ACTIONS.EdgeError:
      const key3 = action.meta.edgeKey as string;
      return update(state, {
        data: { [key3]: { $set: null } },
        status: { [key3]: { $set: action.status } },
        errors: { [key3]: { $set: action.meta.error } }
      });
    case ACTIONS.EdgePostSuccess:
      const key4 = action.payload._key as string;
      const edge2 = getSimplifiedEdge(action.payload as Edge);
      return update(state, {
        data: { [key4]: { $set: edge2 } },
        status: { [key4]: { $set: action.status } }
      });
    default:
      return state;
  }
};

import ACTIONS from "../utils/ACTIONS";
import { Action, Edge } from "../utils/types";
import update from "immutability-helper";
import { getSimplifiedEdge } from "../utils/utils";
import { AnyAction } from "redux";

const defaultState = { data: {}, status: {}, errors: {} };

export default (state = defaultState, action: AnyAction) => {
  switch (action.type) {
    case ACTIONS.EdgeLoadRequested:
      const key1 = action.meta.edgeKey as string;
      return update(state, {
        status: { [key1]: { $set: action.status } }
      });
    case ACTIONS.EdgeLoadSuccess:
      const key2 = action.meta.edgeKey as string;
      const edge1 = getSimplifiedEdge(action.payload as Edge);
      return update(state, {
        data: { [key2]: { $set: edge1 } },
        status: { [key2]: { $set: action.status } }
      });
    case ACTIONS.EdgeLoadError:
      const key3 = action.meta.edgeKey as string;
      return update(state, {
        data: { [key3]: { $set: null } },
        status: { [key3]: { $set: action.status } },
        errors: { [key3]: { $set: action.meta.error } }
      });
    case ACTIONS.EdgeSaveSuccess:
      const key4 = action.payload._key as string;
      const edge2 = getSimplifiedEdge(action.payload as Edge);
      return update(state, {
        data: { [key4]: { $set: edge2 } },
        status: { [key4]: { $set: action.status } }
      });
    case ACTIONS.EdgeDeleteSuccess:
      const key5 = action.meta._key as string;
      return update(state, {
        data: { $unset: [key5] },
        status: { $unset: [key5] }
      });
    default:
      return state;
  }
};

import ACTIONS from "../utils/ACTIONS";
import { Action } from "../utils/types";
import update from "immutability-helper";

const defaultState = { data: {}, status: {}, errors: {} };

/**
 * This reducer takes care of updating the state in response to requests
 * that are scoped to a component instance or a request Id.
 */
export default (state = defaultState, action: Action) => {
  switch (action.type) {
    case ACTIONS.EntitySaveSent:
    case ACTIONS.SourceRefGetSent:
    case ACTIONS.EdgeSaveSent:
      const key1 = action.meta.requestId as string;
      return update(state, {
        status: { [key1]: { $set: action.status } }
      });
    case ACTIONS.EntitySaveClear:
    case ACTIONS.SourceRefGetClear:
    case ACTIONS.EdgeSaveClear:
      const key4 = action.meta.requestId as string;
      return update(state, {
        data: { $unset: [key4] },
        status: { $unset: [key4] },
        errors: { $unset: [key4] }
      });
    case ACTIONS.EntitySaveSuccess:
    case ACTIONS.SourceRefGetSuccess:
    case ACTIONS.EdgeSaveSuccess:
      const key2 = action.meta.requestId as string;
      return update(state, {
        data: { [key2]: { $set: action.payload } },
        status: { [key2]: { $set: action.status } }
      });
    case ACTIONS.EntitySaveError:
    case ACTIONS.SourceRefGetError:
    case ACTIONS.EdgeSaveError:
      const key3 = action.meta.requestId as string;
      return update(state, {
        data: { [key3]: { $set: null } },
        status: { [key3]: { $set: action.status } },
        errors: { [key3]: { $set: action.meta.error } }
      });
    case ACTIONS.EdgeDeleteSuccess:
      const key5 = action.meta.requestId as string;
      return update(state, {
        data: { $unset: [key5] },
        status: { [key5]: { $set: action.status } }
      });
    default:
      return state;
  }
};

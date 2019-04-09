import ACTIONS from "../utils/ACTIONS";
import { Action } from "../utils/types";
import update from "immutability-helper";

const defaultState = { data: {}, status: {}, errors: {} };

export default (state = defaultState, action: Action) => {
  switch (action.type) {
    case ACTIONS.EntityRequested:
      const key1 = action.meta.entityKey as string;
      return update(state, {
        status: { [key1]: { $set: action.status } }
      });
    case ACTIONS.EntityReceived:
      const key2 = action.meta.entityKey as string;
      return update(state, {
        data: { [key2]: { $set: action.payload } },
        status: { [key2]: { $set: action.status } }
      });
    case ACTIONS.EntityError:
      const key3 = action.meta.entityKey as string;
      return update(state, {
        data: { [key3]: { $set: null } },
        status: { [key3]: { $set: action.status } },
        errors: { [key3]: { $set: action.meta.error } }
      });
    default:
      return state;
  }
};

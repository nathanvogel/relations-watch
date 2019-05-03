import * as ACTIONS from "../utils/ACTIONS";
import update from "immutability-helper";
import { AnyAction } from "redux";

const defaultState: string[] = [];

/**
 * This adds or remove elements from the list of selected entities.
 */
export default (state = defaultState, action: AnyAction) => {
  switch (action.type) {
    case ACTIONS.SelectEntities:
      var newState = state;
      for (let key of action.entityKeys) {
        const pos = state.indexOf(key);
        if (pos >= 0) state = update(newState, { $splice: [[pos, 1]] });
      }
      return update(state, { $push: action.entityKeys });
    default:
      return state;
  }
};

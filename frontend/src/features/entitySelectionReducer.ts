import * as ACTIONS from "../utils/ACTIONS";
import update from "immutability-helper";
import { AnyAction, Action, Reducer } from "redux";
import { EntitySelectionAction } from "./entitySelectionActions";
import { EntitySelectionState } from "../Store";

/**
 * This adds or remove elements from the list of selected entities.
 */
const entitySelectionReducer: Reducer<
  EntitySelectionState,
  EntitySelectionAction
> = (state = [], action) => {
  switch (action.type) {
    case ACTIONS.SelectEntities:
      const newSelection: EntitySelectionState = [];
      for (let key of state) {
        if (action.entityKeys.indexOf(key) < 0) newSelection.push(key);
      }
      for (let key of action.entityKeys) {
        newSelection.push(key);
      }
      return newSelection;
    case ACTIONS.DeselectEntities:
      const newSelection2: EntitySelectionState = [];
      for (let key of state) {
        if (action.entityKeys.indexOf(key) < 0) newSelection2.push(key);
      }
      return newSelection2;
    default:
      return state;
  }
};

export default entitySelectionReducer;

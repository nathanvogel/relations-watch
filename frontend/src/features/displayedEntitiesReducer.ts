import * as ACTIONS from "../utils/ACTIONS";
import { Reducer } from "redux";
import { EntitiesDisplayAction } from "./displayedEntitiesActions";
import { DisplayedEntitiesState } from "../Store";

// Create it once for correct memoization
const defaultList: DisplayedEntitiesState = {};

/**
 * This simply pass-through-updates the list.
 */
const displayedEntitiesReducer: Reducer<
  DisplayedEntitiesState,
  EntitiesDisplayAction
> = (state = defaultList, action) => {
  switch (action.type) {
    case ACTIONS.DisplayedEntitiesAction:
      return action.displayedEntities;
    default:
      return state;
  }
};

export default displayedEntitiesReducer;

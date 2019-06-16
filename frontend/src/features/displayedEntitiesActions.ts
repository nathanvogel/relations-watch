import * as ACTIONS from "../utils/ACTIONS";
import { Action } from "redux";
import { DisplayedEntitiesState } from "../Store";

interface DisplayedEntitiesAction
  extends Action<ACTIONS.DisplayedEntitiesAction> {
  displayedEntities: DisplayedEntitiesState;
}

export type EntitiesDisplayAction = DisplayedEntitiesAction;

export function displayedEntities(
  displayedEntities: DisplayedEntitiesState
): DisplayedEntitiesAction {
  return {
    type: ACTIONS.DisplayedEntitiesAction,
    displayedEntities,
  };
}

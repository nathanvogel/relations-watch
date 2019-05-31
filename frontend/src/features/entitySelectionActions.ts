import * as ACTIONS from "../utils/ACTIONS";
import { Action } from "redux";

interface SelectEntitiesAction extends Action<ACTIONS.SelectEntities> {
  entityKeys: string[];
}

interface DeselectEntitiesAction extends Action<ACTIONS.DeselectEntities> {
  entityKeys: string[];
}

export type EntitySelectionAction =
  | SelectEntitiesAction
  | DeselectEntitiesAction;

export function selectEntities(entityKeys: string[]): SelectEntitiesAction {
  return {
    type: ACTIONS.SelectEntities,
    entityKeys,
  };
}

export function deselectEntities(entityKeys: string[]): DeselectEntitiesAction {
  return {
    type: ACTIONS.DeselectEntities,
    entityKeys,
  };
}

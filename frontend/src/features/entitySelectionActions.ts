import * as ACTIONS from "../utils/ACTIONS";

export interface SelectEntitiesAction {
  type: ACTIONS.SelectEntities;
  entityKeys: string[];
}

export interface DeselectEntitiesAction {
  type: ACTIONS.DeselectEntities;
  entityKeys: string[];
}

export type EntitySelectionAction =
  | SelectEntitiesAction
  | DeselectEntitiesAction;

export function selectEntities(entityKeys: string[]): EntitySelectionAction {
  // TODO load additionnal links or entity info ?
  return {
    type: ACTIONS.SelectEntities,
    entityKeys
  };
}

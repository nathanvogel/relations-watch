import * as ACTIONS from "../utils/ACTIONS";
import { Action } from "redux";

interface HoverEntityAction extends Action<ACTIONS.HoverEntity> {
  entityKey: string;
}

interface HoverRelationAction extends Action<ACTIONS.HoverRelation> {
  sourceKey: string;
  targetKey: string;
}

export type HoverAction = HoverEntityAction | HoverRelationAction;

export function hoverEntity(entityKey: string): HoverEntityAction {
  return {
    type: ACTIONS.HoverEntity,
    entityKey,
  };
}

export function hoverRelation(
  sourceKey: string,
  targetKey: string
): HoverRelationAction {
  return {
    type: ACTIONS.HoverRelation,
    sourceKey,
    targetKey,
  };
}

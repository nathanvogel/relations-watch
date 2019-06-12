import * as ACTIONS from "../utils/ACTIONS";
import { Action } from "redux";
import { EdgePreview, Entity } from "../utils/types";

interface InbetweenLinksLoadSuccessAction
  extends Action<ACTIONS.InbetweenLinksLoadSuccess> {
  edges: EdgePreview[];
  entities: Entity[];
}

export type InbetweenAction = InbetweenLinksLoadSuccessAction;

export function inbetweenSucessAction(
  edges: EdgePreview[],
  entities: Entity[]
): InbetweenLinksLoadSuccessAction {
  return {
    type: ACTIONS.InbetweenLinksLoadSuccess,
    edges,
    entities,
  };
}

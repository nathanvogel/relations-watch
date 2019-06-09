import * as ACTIONS from "../utils/ACTIONS";
import update from "immutability-helper";
import { Reducer } from "redux";
import { HoverAction } from "./hoverActions";
import { HoverState } from "../Store";

const defaultState = {
  entityKey: "",
  relationSourceKey: "",
  relationTargetKey: "",
};

const entitySelectionReducer: Reducer<HoverState, HoverAction> = (
  state = defaultState,
  action
) => {
  switch (action.type) {
    case ACTIONS.HoverEntity:
      return update(state, { entityKey: { $set: action.entityKey } });
    case ACTIONS.HoverRelation:
      return update(state, {
        relationSourceKey: { $set: action.sourceKey },
        relationTargetKey: { $set: action.targetKey },
      });
    default:
      return state;
  }
};

export default entitySelectionReducer;

import ACTIONS from "../utils/ACTIONS";
import { Action, Edge } from "../utils/types";
import update from "immutability-helper";
import { getRelationId } from "../utils/utils";

const defaultState = { data: {}, status: {}, errors: {} };

export default (state = defaultState, action: Action) => {
  switch (action.type) {
    case ACTIONS.EdgePostSuccess:
      const edge = action.payload as Edge;
      edge._from = edge._from.replace("entities/", "");
      edge._to = edge._to.replace("entities/", "");
      const relationId = getRelationId(edge._from, edge._to);
      if (!relationId) {
        console.error("Invalid Edge received on " + ACTIONS.EdgePostSuccess);
        return state;
      }
      return update(state, {
        [relationId]: { $set: action.payload }
      });
    default:
      return state;
  }
};

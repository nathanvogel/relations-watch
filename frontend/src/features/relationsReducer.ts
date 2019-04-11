import ACTIONS from "../utils/ACTIONS";
import { Action, Edge, Relation } from "../utils/types";
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
    case ACTIONS.RelationRequested:
      const key1 = action.meta.relationId as string;
      return update(state, {
        status: { [key1]: { $set: action.status } }
      });
    case ACTIONS.RelationReceived:
      const relation = action.payload as Relation;
      const relationId2 = action.meta.relationId;
      if (!relationId2) {
        console.error("Invalid Edge received on " + ACTIONS.RelationReceived);
        return state;
      }
      return update(state, {
        data: { [relationId2]: { $set: relation } },
        status: { [relationId2]: { $set: action.status } },
        errors: { [relationId2]: { $set: action.meta.error } }
      });
    case ACTIONS.RelationError:
      const key3 = action.meta.relationId as string;
      return update(state, {
        data: { [key3]: { $set: null } },
        status: { [key3]: { $set: action.status } },
        errors: { [key3]: { $set: action.meta.error } }
      });
    default:
      return state;
  }
};

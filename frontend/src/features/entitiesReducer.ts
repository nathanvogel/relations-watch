import ACTIONS from "../utils/ACTIONS";
import { Action, EntityPreview } from "../utils/types";
import update from "immutability-helper";

const defaultState = { datapreview: {}, data: {}, status: {}, errors: {} };

export default (state = defaultState, action: Action) => {
  switch (action.type) {
    case ACTIONS.EntityRequested:
      const key1 = action.meta.entityKey as string;
      return update(state, {
        status: { [key1]: { $set: action.status } }
      });
    case ACTIONS.EntityReceived:
      const key2 = action.meta.entityKey as string;
      return update(state, {
        data: { [key2]: { $set: action.payload } },
        status: { [key2]: { $set: action.status } }
      });
    case ACTIONS.EntityError:
      const key3 = action.meta.entityKey as string;
      return update(state, {
        data: { [key3]: { $set: null } },
        status: { [key3]: { $set: action.status } },
        errors: { [key3]: { $set: action.meta.error } }
      });
    case ACTIONS.LinksReceived:
      if (!action.payload || !action.payload.vertices) {
        console.error(
          "Invalid action (entitiesReducer): " + ACTIONS.LinksReceived
        );
        return state;
      }
      const entities = action.payload.vertices as Array<EntityPreview>;
      const entitiesMap: { [key: string]: EntityPreview } = {};
      for (let entityPreview of entities) {
        entitiesMap[entityPreview._key] = entityPreview;
      }
      return update(state, { datapreview: { $merge: entitiesMap } });
    default:
      return state;
  }
};

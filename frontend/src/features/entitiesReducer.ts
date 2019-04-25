import ACTIONS from "../utils/ACTIONS";
import { Action, EntityPreview, Entity } from "../utils/types";
import update from "immutability-helper";

const defaultState = { datapreview: {}, data: {}, status: {}, errors: {} };

export default (state = defaultState, action: Action) => {
  switch (action.type) {
    case ACTIONS.EntityLoadRequested:
      const key1 = action.meta.entityKey as string;
      return update(state, {
        status: { [key1]: { $set: action.status } }
      });
    case ACTIONS.EntityLoadSuccess:
      const key2 = action.meta.entityKey as string;
      return update(state, {
        data: { [key2]: { $set: action.payload } },
        status: { [key2]: { $set: action.status } }
      });
    case ACTIONS.EntityLoadError:
      const key3 = action.meta.entityKey as string;
      return update(state, {
        data: { [key3]: { $set: null } },
        status: { [key3]: { $set: action.status } },
        errors: { [key3]: { $set: action.meta.error } }
      });
    case ACTIONS.EntitySaveSuccess:
      const key4 = action.payload._key as string;
      const fullEntity = action.payload as Entity;
      // As the payload is a successful response from the server, this
      // should never happen, but this is a warning just in case.
      if (!fullEntity._key)
        console.warn(
          `The payload from ${
            ACTIONS.EntitySaveSuccess
          } is missing a _key property!`
        );
      const entityPreview: EntityPreview = {
        _key: fullEntity._key as string,
        name: fullEntity.name,
        imageId: fullEntity.imageId
      };
      return update(state, {
        datapreview: { [key4]: { $set: entityPreview } },
        data: { [key4]: { $set: action.payload } },
        status: { [key4]: { $set: action.status } }
      });
    case ACTIONS.LinksLoadSuccess:
      if (!action.payload || !action.payload.vertices) {
        console.error(
          "Invalid action (entitiesReducer): " + ACTIONS.LinksLoadSuccess
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

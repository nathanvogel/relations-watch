import ACTIONS from "../utils/ACTIONS";
import * as TYPED_ACTIONS from "../utils/ACTIONS";
import {
  Action,
  EntityPreview,
  Entity,
  Status,
  ErrorPayload
} from "../utils/types";
import update from "immutability-helper";
import { SouAuthorsChange } from "./sourceFormActions";
import { getArray, getEntityPreview, getKeyObject } from "../utils/utils";
import { AnyAction } from "redux";

const status: { [key: string]: Status } = {};
const defaultState = { datapreview: {}, data: {}, status, errors: {} };

export default (state = defaultState, action: AnyAction) => {
  // Check and get the keys from any relevant Action
  var keys: string[] = [];
  const statusList: { [key: string]: Status } = {};
  switch (action.type) {
    case ACTIONS.EntityLoadManyRequested:
    case ACTIONS.EntityLoadManySuccess:
    case ACTIONS.EntityLoadManyError:
      if (!action.meta.entityKeys)
        throw new Error("Missing keys in action" + action.type);
      keys = action.meta.entityKeys;
      for (let key of keys) {
        // If we already have some data, we can display it, so no need to
        // show that it's loading.
        // An error status should override the current one anyway though.
        if (state.status[key] !== Status.Ok || action.status === Status.Error)
          statusList[key] = action.status;
      }
      break;
  }

  switch (action.type) {
    case ACTIONS.EntityLoadManyRequested:
      return update(state, {
        status: { $merge: statusList }
      });
    case ACTIONS.EntityLoadManySuccess:
      // Put all the freshest data:
      const entities2: Entity[] = action.payload;
      const entityList = getKeyObject(entities2, "_key");
      // Also build a list for datapreview.
      const entityPreviewList: { [key: string]: EntityPreview } = {};
      for (let key in entityList) {
        entityPreviewList[key] = getEntityPreview(entityList[key]);
      }
      return update(state, {
        datapreview: { $merge: entityPreviewList },
        data: { $merge: entityList },
        status: { $merge: statusList }
      });
    case ACTIONS.EntityLoadManyError:
      const errorList: { [key: string]: ErrorPayload } = {};
      if (action.meta.error) {
        for (let key of keys) {
          errorList[key] = action.meta.error;
        }
      }
      // Leave the .data[key] untouched because I'm bored.
      return update(state, {
        status: { $merge: statusList },
        errors: { $merge: errorList }
      });
    case ACTIONS.EntityLoadRequested:
      const key1 = action.meta.entityKey as string;
      return update(state, {
        status: { [key1]: { $set: action.status } }
      });
    case ACTIONS.EntityLoadSuccess:
      const key2 = action.meta.entityKey as string;
      const entityPreview1 = getEntityPreview(action.payload);
      return update(state, {
        datapreview: { [key2]: { $set: entityPreview1 } },
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
      const entityPreview2 = getEntityPreview(fullEntity);
      return update(state, {
        datapreview: { [key4]: { $set: entityPreview2 } },
        data: { [key4]: { $set: action.payload } },
        status: { [key4]: { $set: action.status } }
      });
    case TYPED_ACTIONS.SOU_AUTHORS_CHANGE:
      const authorsAction = action as SouAuthorsChange;
      // Selection could be empty, no need to react here.
      if (!authorsAction.selection) return state;
      // Make sure we're working with an array.
      const selectionArray = getArray(authorsAction.selection);
      // Push the entity previews to the state.
      const newEntityPreviews: { [key: string]: EntityPreview } = {};
      for (let option of selectionArray) {
        newEntityPreviews[option.value] = {
          _key: option.value,
          name: option.label
        };
      }
      return update(state, {
        datapreview: { $merge: newEntityPreviews }
      });
    case ACTIONS.LinksLoadSuccess:
      if (!action.payload || !action.payload.vertices) {
        console.error(
          "Invalid action (entitiesReducer): " + ACTIONS.LinksLoadSuccess
        );
        return state;
      }
      const entities = action.payload.vertices as EntityPreview[];
      const entitiesMap = getKeyObject(entities, "_key");
      return update(state, { datapreview: { $merge: entitiesMap } });
    default:
      return state;
  }
};

import update from "immutability-helper";
import { AnyAction } from "redux";

import ACTIONS from "../utils/ACTIONS";
import { Status, Source, ErrorPayload } from "../utils/types";
import { getKeyObject } from "../utils/utils";

const status: { [key: string]: Status } = {};
const defaultState = { data: {}, status, errors: {} };

export default (state = defaultState, action: AnyAction) => {
  // Check and get the keys from any relevant Action
  var keys: string[] = [];
  const statusList: { [key: string]: Status } = {};
  switch (action.type) {
    case ACTIONS.SourceGetManyRequested:
    case ACTIONS.SourceGetManySuccess:
    case ACTIONS.SourceGetManyError:
      if (!action.meta.sourceKeys)
        throw new Error("Missing keys in action" + action.type);
      keys = action.meta.sourceKeys;
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
    case ACTIONS.SourceGetManyRequested:
      return update(state, {
        status: { $merge: statusList }
      });
    case ACTIONS.SourceGetManySuccess:
      // Put all the freshest data:
      const sources: Source[] = action.payload;
      const sourceList = getKeyObject(sources, "_key");
      return update(state, {
        data: { $merge: sourceList },
        status: { $merge: statusList }
      });
    case ACTIONS.SourceGetManyError:
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
    case ACTIONS.SourceSaveSuccess:
      // Put all the freshest data:
      const source: Source = action.payload;
      const key = source._key as string;
      return update(state, {
        data: { [key]: { $set: source } },
        status: { [key]: { $set: Status.Ok } }
      });
    default:
      return state;
  }
};

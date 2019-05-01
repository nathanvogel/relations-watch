import { Dispatch } from "redux";
import { AxiosError } from "axios";
import qs from "qs";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import { Action, ErrorPayload, Entity } from "../utils/types";
import { Status } from "../utils/types";
import { arrayWithoutDuplicates } from "../utils/utils";
import { RootStore } from "../Store";

// Thunk Action
export const loadEntity = (entityKey: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionRequest(entityKey));
  return api
    .get(`/entities/${entityKey}`)
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionError(entityKey, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionReceived(entityKey, res.data));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error("Error getting entity ", entityKey, errorPayload);
      dispatch(actionError(entityKey, errorPayload));
    });
};

function actionRequest(entityKey: string): Action {
  return {
    type: ACTIONS.EntityLoadRequested,
    status: Status.Requested,
    meta: { entityKey: entityKey }
  };
}

function actionError(entityKey: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.EntityLoadError,
    status: Status.Error,
    meta: { entityKey: entityKey, error: error }
  };
}

function actionReceived(entityKey: string, payload: object): Action {
  return {
    type: ACTIONS.EntityLoadSuccess,
    payload,
    status: Status.Ok,
    meta: { entityKey: entityKey }
  };
}

/**
 * Load a bunch of sources in one requests.
 * It will de-duplicate the given entityKeys array.
 */
export const loadEntities = (entityKeys: string[]) => async (
  dispatch: Dispatch,
  getState: () => RootStore
): Promise<void> => {
  const keys = arrayWithoutDuplicates(entityKeys);
  // Check that we have some keys.
  if (keys.length === 0) {
    console.log("No keys given, aborting loadEntities");
    return;
  }
  // TODO: Optimization: Use getState to prevent reloading stuff we already have.
  dispatch(actionEntitiesRequest(keys));
  return api
    .get(`/entities/many`, {
      params: { keys: keys },
      // `paramsSerializer` is an optional function in charge of serializing `params`
      // This is the format that the ArangoDB Foxx/joi backend supports
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      }
    })
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionEntitiesError(keys, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionEntitiesReceived(keys, res.data));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error("Error getting entities ", keys, errorPayload);
      dispatch(actionEntitiesError(keys, errorPayload));
    });
};

function actionEntitiesRequest(entityKeys: string[]): Action {
  return {
    type: ACTIONS.EntityLoadManyRequested,
    status: Status.Requested,
    meta: { entityKeys }
  };
}

function actionEntitiesError(
  entityKeys: string[],
  error: ErrorPayload
): Action {
  return {
    type: ACTIONS.EntityLoadManyError,
    status: Status.Error,
    meta: { entityKeys, error }
  };
}

export function actionEntitiesReceived(
  entityKeys: string[],
  payload: Entity[]
): Action {
  return {
    type: ACTIONS.EntityLoadManySuccess,
    payload,
    status: Status.Ok,
    meta: { entityKeys }
  };
}

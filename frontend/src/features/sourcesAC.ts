import { Dispatch } from "redux";
import axios, { AxiosError } from "axios";
import qs from "qs";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import {
  Action,
  ErrorPayload,
  Status,
  Source,
  SourceType,
  getRefType
} from "../utils/types";
import { ERROR_CODES } from "../utils/consts";
import { RootStore } from "../Store";
import { arrayWithoutDuplicates } from "../utils/utils";
import { loadEntities } from "./entitiesLoadAC";

const microlink = axios.create({
  baseURL: "https://api.microlink.io",
  headers: {}
});

async function getUrlInfo(fullRef: string) {
  try {
    const res = await microlink.get("/", { params: { url: fullRef } });
    if (res.status < 400) return res.data.data;
    else return 0;
  } catch (reason) {
    return 0;
  }
}

export const getSourceFromRef = (fullRef: string, requestId: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  const isLink = getRefType(fullRef) === SourceType.Link;
  if (!isLink) {
    dispatch(
      actionRefGetError(requestId, {
        eData: {},
        eMessage: "The reference needs to be a link (with https://).",
        eStatus: ERROR_CODES.NOT_A_LINK
      })
    );
    return;
  }

  dispatch(actionRefGetRequest(requestId));
  try {
    const res = await api.get("/sources/ref", {
      params: { fullRef: fullRef }
    });
    const potentialError = checkResponse(res);
    if (potentialError) {
      dispatch(actionRefGetError(requestId, potentialError));
      return;
    }
    const serverSource: Source = res.data;
    if (serverSource._key) {
      // The source exists already on the server, we can just reuse it.
      dispatch(actionRefGetReceived(requestId, serverSource));
    } else {
      const urlData = await getUrlInfo(fullRef);
      const newSource: Source = !urlData
        ? serverSource
        : Object.assign({}, serverSource, {
            pTitle: urlData.title,
            pAuthor: urlData.author,
            pDescription: urlData.description
          });
      dispatch(actionRefGetReceived(requestId, newSource));
    }
  } catch (error) {
    const errorPayload = checkError(error);
    console.error(
      `Error trying to get a new source with ref ${fullRef}`,
      requestId,
      errorPayload
    );
    dispatch(actionRefGetError(requestId, errorPayload));
  }
};

export const clearGetSourceFromRefRequest = (requestId: string) => (
  dispatch: Dispatch
) => {
  dispatch(actionRefGetClearRequest(requestId));
};

/**
 * Load a bunch of sources in one requests.
 * It will de-duplicate the given sourceKeys array.
 */
export const loadSources = (
  sourceKeys: string[],
  doLoadEntities: boolean
) => async (dispatch: Dispatch, getState: () => RootStore): Promise<void> => {
  const keys = arrayWithoutDuplicates(sourceKeys);
  // Check that we have some keys.
  if (keys.length === 0) {
    console.log("No keys given, aborting loadSources");
    return;
  }
  // TODO: Optimization: Use getState to prevent reloading sources we already have.
  dispatch(actionSourcesRequest(keys));
  return api
    .get(`/sources/many`, {
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
        dispatch(actionSourcesError(keys, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionSourcesReceived(keys, res.data));

      // Side-effect: also load contained entities if necessary.
      if (doLoadEntities) {
        var entityKeys: string[] = [];
        const sources = res.data as Source[];
        for (let source of sources) {
          entityKeys = entityKeys.concat(source.authors);
        }
        return loadEntities(entityKeys)(dispatch, getState);
      }
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error("Error getting sources ", keys, errorPayload);
      dispatch(actionSourcesError(keys, errorPayload));
    });
};

function actionSourcesRequest(sourceKeys: string[]): Action {
  return {
    type: ACTIONS.SourceGetManyRequested,
    status: Status.Requested,
    meta: { sourceKeys }
  };
}

function actionSourcesError(sourceKeys: string[], error: ErrorPayload): Action {
  return {
    type: ACTIONS.SourceGetManyError,
    status: Status.Error,
    meta: { sourceKeys, error }
  };
}

export function actionSourcesReceived(
  sourceKeys: string[],
  payload: Source[]
): Action {
  return {
    type: ACTIONS.SourceGetManySuccess,
    payload,
    status: Status.Ok,
    meta: { sourceKeys }
  };
}

function actionRefGetRequest(requestId: string): Action {
  return {
    type: ACTIONS.SourceRefGetSent,
    status: Status.Requested,
    meta: { requestId: requestId }
  };
}

function actionRefGetClearRequest(requestId: string): Action {
  return {
    type: ACTIONS.SourceRefGetClear,
    status: Status.Clear,
    meta: { requestId }
  };
}

function actionRefGetError(requestId: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.SourceRefGetError,
    status: Status.Error,
    meta: { requestId: requestId, error: error }
  };
}

function actionRefGetReceived(requestId: string, payload: object): Action {
  return {
    type: ACTIONS.SourceRefGetSuccess,
    payload,
    status: Status.Ok,
    meta: { requestId: requestId }
  };
}

export const patchSource = (formDataKey: string) => async (
  dispatch: Dispatch,
  getState: () => RootStore
): Promise<void> => {
  const formData = getState().sourceForms[formDataKey];
  if (!formData) {
    dispatch(
      actionSourceSaveError(formDataKey, {
        eData: null,
        eMessage: "Error: no form data found to upload!",
        eStatus: 4040
      })
    );
    return;
  }
  dispatch(actionSourceSaveSent(formDataKey));
  return api
    .patch(`/sources`, formData)
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionSourceSaveError(formDataKey, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionSourceSaveSuccess(formDataKey, res.data));
      dispatch(actionSourceSaveClear(formDataKey));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error(
        `Error patching source ${formData.ref}`,
        formDataKey,
        errorPayload
      );
      dispatch(actionSourceSaveError(formDataKey, errorPayload));
    });
};

function actionSourceSaveSent(requestId: string): Action {
  return {
    type: ACTIONS.SourceSaveSent,
    status: Status.Requested,
    meta: { requestId: requestId }
  };
}

function actionSourceSaveClear(requestId: string): Action {
  return {
    type: ACTIONS.SourceSaveClear,
    status: Status.Clear,
    meta: { requestId }
  };
}

function actionSourceSaveError(requestId: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.SourceSaveError,
    status: Status.Error,
    meta: { requestId: requestId, error: error }
  };
}

function actionSourceSaveSuccess(requestId: string, payload: object): Action {
  return {
    type: ACTIONS.SourceSaveSuccess,
    payload,
    status: Status.Ok,
    meta: { requestId: requestId }
  };
}

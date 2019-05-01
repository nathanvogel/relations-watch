import { Dispatch } from "redux";
import axios, { AxiosError } from "axios";
import validator from "validator";
import qs from "qs";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import {
  Action,
  ErrorPayload,
  Status,
  Source,
  SourceType
} from "../utils/types";
import CONSTS from "../utils/consts";
import { RootStore } from "../Store";
import { arrayWithoutDuplicates } from "../utils/utils";

const microlink = axios.create({
  baseURL: "https://api.microlink.io",
  headers: {}
});

function getRefType(fullRef: string) {
  const isURL = validator.isURL(fullRef, {
    protocols: ["http", "https", "ftp"],
    require_tld: true,
    require_protocol: false,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
    disallow_auth: false
  });
  return isURL ? SourceType.Link : SourceType.TextRef;
}

function getUrlInfo(fullRef: string) {
  return microlink
    .get("/", { params: { url: fullRef } })
    .then(res => {
      if (res.status < 400) return res.data.data;
      else return 0;
    })
    .catch(reason => 0);
}

/**
 * Upload new entities to the database.
 */
export const getSourceFromRef = (fullRef: string, requestId: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionRefGetRequest(requestId));

  const isLink = getRefType(fullRef) === SourceType.Link;
  return (isLink ? getUrlInfo(fullRef) : Promise.resolve(0)).then(urlData => {
    return api
      .get("/sources/ref", { params: { fullRef: fullRef } })
      .then(res => {
        const potentialError = checkResponse(res);
        if (potentialError) {
          dispatch(actionRefGetError(requestId, potentialError));
          return;
        }
        // Everything is fine, we got the data, send it!
        const source =
          isLink && urlData
            ? Object.assign({}, res.data, {
                pTitle: urlData.title,
                pAuthor: urlData.author,
                pDescription: urlData.description
              })
            : res.data;
        dispatch(actionRefGetReceived(requestId, source));
      })
      .catch((error: AxiosError) => {
        const errorPayload = checkError(error);
        console.error(
          `Error trying to get a new source with ref ${fullRef}`,
          requestId,
          errorPayload
        );
        dispatch(actionRefGetError(requestId, errorPayload));
      });
  });
};

export const clearPostRequest = (requestId: string) => (dispatch: Dispatch) => {
  dispatch(actionRefGetClearRequest(requestId));
};

/**
 * Load a bunch of sources in one requests.
 * It will de-duplicate the given sourceKeys array.
 */
export const loadSources = (sourceKeys: string[]) => async (
  dispatch: Dispatch,
  getState: () => RootStore
): Promise<void> => {
  const keys = arrayWithoutDuplicates(sourceKeys);
  // TODO: Optimization: Use getState to prevent reloading sources we already have.
  dispatch(actionManyRequest(keys));
  api
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
        dispatch(actionManyError(keys, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionManyReceived(keys, res.data));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error("Error getting sources ", keys, errorPayload);
      dispatch(actionManyError(keys, errorPayload));
    });
};

function actionManyRequest(sourceKeys: string[]): Action {
  return {
    type: ACTIONS.SourceGetManyRequested,
    status: Status.Requested,
    meta: { sourceKeys }
  };
}

function actionManyError(sourceKeys: string[], error: ErrorPayload): Action {
  return {
    type: ACTIONS.SourceGetManyError,
    status: Status.Error,
    meta: { sourceKeys, error }
  };
}

function actionManyReceived(sourceKeys: string[], payload: Source[]): Action {
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

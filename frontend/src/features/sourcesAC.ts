import { Dispatch } from "redux";
import axios, { AxiosResponse, AxiosError } from "axios";
import validator from "validator";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import { Action, ErrorPayload, Status } from "../utils/types";
import CONSTS from "../utils/consts";

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
  return isURL ? CONSTS.SOURCE_TYPES.LINK : CONSTS.SOURCE_TYPES.REF;
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
  dispatch(actionRequest(requestId));

  const isLink = getRefType(fullRef) === CONSTS.SOURCE_TYPES.LINK;
  return (isLink ? getUrlInfo(fullRef) : Promise.resolve(0)).then(urlData => {
    return api
      .get("/sources/ref", { params: { fullRef: fullRef } })
      .then(res => {
        const potentialError = checkResponse(res);
        if (potentialError) {
          dispatch(actionError(requestId, potentialError));
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
        dispatch(actionReceived(requestId, source));
      })
      .catch((error: AxiosError) => {
        const errorPayload = checkError(error);
        console.error(
          `Error trying to get a new source with ref ${fullRef}`,
          requestId,
          errorPayload
        );
        dispatch(actionError(requestId, errorPayload));
      });
  });
};

export const clearPostRequest = (requestId: string) => (dispatch: Dispatch) => {
  dispatch(actionClearRequest(requestId));
};

function actionRequest(requestId: string): Action {
  return {
    type: ACTIONS.SourceRefGetSent,
    status: Status.Requested,
    meta: { requestId: requestId }
  };
}

function actionClearRequest(requestId: string): Action {
  return {
    type: ACTIONS.SourceRefGetClear,
    status: Status.Clear,
    meta: { requestId }
  };
}

function actionError(requestId: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.SourceRefGetError,
    status: Status.Error,
    meta: { requestId: requestId, error: error }
  };
}

function actionReceived(requestId: string, payload: object): Action {
  return {
    type: ACTIONS.SourceRefGetSuccess,
    payload,
    status: Status.Ok,
    meta: { requestId: requestId }
  };
}

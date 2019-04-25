import { Dispatch } from "redux";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import { Action, ErrorPayload, Status } from "../utils/types";
import { AxiosError } from "axios";

/**
 * Upload new entities to the database.
 */
export const getSourceFromRef = (fullRef: string, requestId: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionRequest(requestId));
  api
    .get("/sources/ref", { params: { fullRef: fullRef } })
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionError(requestId, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionReceived(requestId, res.data));
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

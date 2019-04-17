import { Dispatch } from "redux";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import { Action, ErrorPayload, Edge } from "../utils/types";
import { Status } from "../utils/types";
import { AxiosError } from "axios";

/**
 * Given an new relation element, upload it as an edge to the database.
 */
export const postEdge = (edge: Edge, requestId: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionSaveRequest(requestId));
  api
    .post(`/relations`, edge)
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionSaveError(requestId, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionSaveSuccess(requestId, res.data));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error(
        `Error posting edge from ${edge._from} to ${edge._to}`,
        requestId,
        errorPayload
      );
      dispatch(actionSaveError(requestId, errorPayload));
    });
};

export const patchEdge = (edge: Edge, requestId: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionSaveRequest(requestId));
  api
    .patch(`/relations`, edge)
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionSaveError(requestId, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionSaveSuccess(requestId, res.data));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error(
        `Error patching edge from ${edge._from} to ${edge._to}`,
        requestId,
        errorPayload
      );
      dispatch(actionSaveError(requestId, errorPayload));
    });
};

export const clearPostRequest = (requestId: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionClearSaveRequest(requestId));
};

function actionSaveRequest(requestId: string): Action {
  return {
    type: ACTIONS.EdgeSaveSent,
    status: Status.Requested,
    meta: { requestId: requestId }
  };
}

function actionClearSaveRequest(requestId: string): Action {
  return {
    type: ACTIONS.EdgeSaveClear,
    status: Status.Clear,
    meta: { requestId }
  };
}

function actionSaveError(requestId: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.EdgeSaveError,
    status: Status.Error,
    meta: { requestId: requestId, error: error }
  };
}

function actionSaveSuccess(requestId: string, payload: object): Action {
  return {
    type: ACTIONS.EdgeSaveSuccess,
    payload,
    status: Status.Ok,
    meta: { requestId: requestId }
  };
}

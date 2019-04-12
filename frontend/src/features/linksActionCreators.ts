import { Dispatch } from "redux";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import { Action, ErrorPayload, Edge } from "../utils/types";
import { Status } from "../utils/types";
import { AxiosError } from "axios";

/**
 * Load all edges between 2 entities to
 * /relations/data/[relationId]/[edgeId]
 */
export const loadLinks = (entityKey: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  // Safe because 2 non-null args
  dispatch(actionLLRequest(entityKey));
  api
    .get(`/entities/${entityKey}/relations`)
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionLLError(entityKey, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionLLReceived(entityKey, res.data));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error("Error getting links of ", entityKey, errorPayload);
      dispatch(actionLLError(entityKey, errorPayload));
    });
};

function actionLLRequest(entityKey: string): Action {
  return {
    type: ACTIONS.LinksRequested,
    status: Status.Requested,
    meta: { entityKey }
  };
}

function actionLLError(entityKey: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.LinksError,
    status: Status.Error,
    meta: { entityKey, error }
  };
}

function actionLLReceived(entityKey: string, payload: object): Action {
  return {
    type: ACTIONS.LinksReceived,
    payload,
    status: Status.Ok,
    meta: { entityKey }
  };
}

/**
 * Given an new relation element, upload it as an edge to the database.
 */
export const postEdge = (edge: Edge, requestId: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionRequest(requestId));
  api
    .post(`/relations`, edge)
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
        `Error posting edge from ${edge._from} to ${edge._to}`,
        requestId,
        errorPayload
      );
      dispatch(actionError(requestId, errorPayload));
    });
};

export const clearPostRequest = (
  relationId: string,
  requestId: string
) => async (dispatch: Dispatch): Promise<void> => {
  dispatch(actionClearRequest(relationId, requestId));
};

function actionRequest(requestId: string): Action {
  return {
    type: ACTIONS.EdgePostSent,
    status: Status.Requested,
    meta: { requestId: requestId }
  };
}

function actionClearRequest(relationId: string, requestId: string): Action {
  return {
    type: ACTIONS.EdgePostClear,
    status: Status.Clear,
    meta: { requestId, relationId }
  };
}

function actionError(requestId: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.EdgePostError,
    status: Status.Error,
    meta: { requestId: requestId, error: error }
  };
}

function actionReceived(requestId: string, payload: object): Action {
  return {
    type: ACTIONS.EdgePostSuccess,
    payload,
    status: Status.Ok,
    meta: { requestId: requestId }
  };
}

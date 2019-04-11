import { Dispatch } from "redux";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import { Action, ErrorPayload, Edge } from "../utils/types";
import { Status } from "../utils/types";
import { AxiosError } from "axios";
import { getRelationId } from "../utils/utils";

/**
 * Load all edges between 2 entities to
 * /relations/data/[relationId]/[edgeId]
 */
export const loadRelation = (entity1Key: string, entity2Key: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  // Safe because 2 non-null args
  const relationId = getRelationId(entity1Key, entity2Key) as string;
  dispatch(actionLoadRequest(relationId));
  api
    .get(`/relations/all/${entity1Key}/${entity2Key}`)
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionLoadError(relationId, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionLoadReceived(relationId, res.data));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error("Error getting relation ", relationId, errorPayload);
      dispatch(actionLoadError(relationId, errorPayload));
    });
};

function actionLoadRequest(relationId: string): Action {
  return {
    type: ACTIONS.RelationRequested,
    status: Status.Requested,
    meta: { relationId: relationId }
  };
}

function actionLoadError(relationId: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.RelationError,
    status: Status.Error,
    meta: { relationId: relationId, error: error }
  };
}

function actionLoadReceived(relationId: string, payload: object): Action {
  return {
    type: ACTIONS.RelationReceived,
    payload,
    status: Status.Ok,
    meta: { relationId: relationId }
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

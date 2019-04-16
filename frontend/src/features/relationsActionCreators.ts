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
      dispatch(actionLoadSuccess(relationId, res.data));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error("Error getting relation ", relationId, errorPayload);
      dispatch(actionLoadError(relationId, errorPayload));
    });
};

function actionLoadRequest(relationId: string): Action {
  return {
    type: ACTIONS.RelationLoadRequested,
    status: Status.Requested,
    meta: { relationId: relationId }
  };
}

function actionLoadError(relationId: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.RelationLoadError,
    status: Status.Error,
    meta: { relationId: relationId, error: error }
  };
}

function actionLoadSuccess(relationId: string, payload: object): Action {
  return {
    type: ACTIONS.RelationLoadSuccess,
    payload,
    status: Status.Ok,
    meta: { relationId: relationId }
  };
}

/**
 * Loads a single edge
 */
export const loadEdge = (edgeKey: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionEdgeLoadRequest(edgeKey));
  api
    .get(`/relations/${edgeKey}`)
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionEdgeLoadError(edgeKey, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionEdgeLoadSuccess(edgeKey, res.data));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error("Error getting edge ", edgeKey, errorPayload);
      dispatch(actionEdgeLoadError(edgeKey, errorPayload));
    });
};

function actionEdgeLoadRequest(edgeKey: string): Action {
  return {
    type: ACTIONS.EdgeLoadRequested,
    status: Status.Requested,
    meta: { edgeKey: edgeKey }
  };
}

function actionEdgeLoadError(edgeKey: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.EdgeLoadError,
    status: Status.Error,
    meta: { edgeKey: edgeKey, error: error }
  };
}

function actionEdgeLoadSuccess(edgeKey: string, payload: object): Action {
  return {
    type: ACTIONS.EdgeLoadSuccess,
    payload,
    status: Status.Ok,
    meta: { edgeKey: edgeKey }
  };
}

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

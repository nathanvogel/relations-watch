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
 * Loads a single edge
 */
export const loadEdge = (edgeKey: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionLoadEdgeRequest(edgeKey));
  api
    .get(`/relations/${edgeKey}`)
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionLoadEdgeError(edgeKey, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionLoadEdgeReceived(edgeKey, res.data));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error("Error getting edge ", edgeKey, errorPayload);
      dispatch(actionLoadEdgeError(edgeKey, errorPayload));
    });
};

function actionLoadEdgeRequest(edgeKey: string): Action {
  return {
    type: ACTIONS.EdgeRequested,
    status: Status.Requested,
    meta: { edgeKey: edgeKey }
  };
}

function actionLoadEdgeError(edgeKey: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.EdgeError,
    status: Status.Error,
    meta: { edgeKey: edgeKey, error: error }
  };
}

function actionLoadEdgeReceived(edgeKey: string, payload: object): Action {
  return {
    type: ACTIONS.EdgeReceived,
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

export const patchEdge = (edge: Edge, requestId: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionRequest(requestId));
  console.log(edge);
  api
    .patch(`/relations`, edge)
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
        `Error patching edge from ${edge._from} to ${edge._to}`,
        requestId,
        errorPayload
      );
      dispatch(actionError(requestId, errorPayload));
    });
};

export const clearPostRequest = (requestId: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionClearRequest(requestId));
};

function actionRequest(requestId: string): Action {
  return {
    type: ACTIONS.EdgePostSent,
    status: Status.Requested,
    meta: { requestId: requestId }
  };
}

function actionClearRequest(requestId: string): Action {
  return {
    type: ACTIONS.EdgePostClear,
    status: Status.Clear,
    meta: { requestId }
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

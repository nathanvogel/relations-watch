import { Dispatch } from "redux";
import update from "immutability-helper";
import { AxiosError, AxiosPromise } from "axios";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import {
  Action,
  ErrorPayload,
  Edge,
  SourceComment,
  Source
} from "../utils/types";
import { Status } from "../utils/types";

/**
 * Given an new relation element, upload it as an edge to the database.
 */
export const postEdge = (
  edge: Edge,
  comment: SourceComment,
  requestId: string,
  source?: Source
) => async (dispatch: Dispatch): Promise<void> => {
  dispatch(actionSaveRequest(requestId));
  var promise: AxiosPromise;
  if (comment.sourceKey) {
    const relation = update(edge, {
      sources: { $set: [comment] }
    });
    promise = api.post(`/relations`, relation);
  } else {
    if (!source) {
      throw new Error("Got a new edge without sourceKey nor Source");
    }
    promise = api.post(`/relations/withSource`, {
      relation: edge,
      comment: comment,
      source: source
    });
  }
  return promise
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

export const deleteEdge = (edge: Edge, requestId: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  // Check that we have an edgeKey
  const edgeKey = edge._key;
  const edgeFrom = edge._from;
  const edgeTo = edge._to;
  if (!edgeKey) {
    dispatch(
      actionSaveError(requestId, {
        eData: null,
        eMessage: "Invalid edge: can't delete without _key!",
        eStatus: Status.Error
      } as ErrorPayload)
    );
    return;
  }
  dispatch(actionSaveRequest(requestId));
  api
    .delete(`/relations/${edgeKey}`)
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionSaveError(requestId, potentialError));
        return;
      }
      // Everything is fine, we successfully deleted it.
      dispatch(actionDeleteSuccess(requestId, edgeKey, edgeFrom, edgeTo));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error(`Error deleting edge ${edgeKey}`, requestId, errorPayload);
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

// We can reuse the Save pipeline for the delete request, but this one
// as such different effects (need to use $unset in reducers, etc.)
// that I'd rather keep the action small and explicit.
function actionDeleteSuccess(
  requestId: string,
  _key: string,
  _from: string,
  _to: string
): Action {
  return {
    type: ACTIONS.EdgeDeleteSuccess,
    status: Status.Ok,
    meta: { requestId, _key, _from, _to }
  };
}

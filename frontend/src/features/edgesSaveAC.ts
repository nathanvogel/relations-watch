import { Dispatch } from "redux";
import update from "immutability-helper";
import { AxiosError, AxiosPromise } from "axios";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import { Action, ErrorPayload, Edge, SourceLink, Source } from "../utils/types";
import { Status } from "../utils/types";
import { actionSourcesReceived } from "./sourcesAC";
import { RootStore } from "../Store";
import { ERROR_CODES } from "../utils/consts";

function postNewEdgeWithExistingSource(edge: Edge, sourceLink: SourceLink) {
  const relation = update(edge, {
    sources: { $set: [sourceLink] }
  });
  return api.post(`/relations`, relation);
}

function patchEdgeWithExistingSource(edge: Edge, sourceLink: SourceLink) {
  return patchEdge(
    update(edge, {
      sources: { $push: [sourceLink] }
    })
  );
}

function patchEdge(edge: Edge) {
  return api.patch(`/relations`, edge);
}

function postNewEdgeWithNewSource(
  edge: Edge,
  sourceLink: SourceLink,
  source: Source
) {
  return api.post(`/relations/withSource`, {
    relation: edge,
    sourceLink: sourceLink,
    source: source
  });
}

function patchEdgeWithNewSource(
  edge: Edge,
  sourceLink: SourceLink,
  source: Source
) {
  return api.patch(`/relations/withSource`, {
    relation: edge,
    sourceLink: sourceLink,
    source: source
  });
}

/**
 * Given an new relation element, upload it as an edge to the database.
 */
export const saveEdge = (
  requestId: string,
  edge: Edge,
  sourceLink?: SourceLink,
  sourceEditorId?: string
) => async (dispatch: Dispatch, getState: () => RootStore): Promise<void> => {
  dispatch(actionSaveRequest(requestId));

  var promise: AxiosPromise<any>;
  var expectSource = false;
  const source = sourceEditorId
    ? getState().sourceForms[sourceEditorId]
    : undefined;

  // CREATE MODE
  if (!edge._key) {
    if (!sourceLink) {
      dispatch(
        actionSaveError(requestId, {
          eMessage: "A source must be linked to post a new relation!",
          eData: null,
          eStatus: ERROR_CODES.MISSING_SOURCE_LINK
        })
      );
      return;
    }
    // If it's an existing source, we can just send the whole thing to the server.
    if (sourceLink.sourceKey) {
      promise = postNewEdgeWithExistingSource(edge, sourceLink);
    } else if (source) {
      promise = postNewEdgeWithNewSource(edge, sourceLink, source);
      expectSource = true;
    } else {
      dispatch(
        actionSaveError(requestId, {
          eMessage: "No Source found in source forms with id:" + sourceEditorId,
          eData: null,
          eStatus: ERROR_CODES.MISSING_SOURCE_FORM
        })
      );
      return;
    }
  }
  // EDIT mode
  else {
    // If the patch comes without sources, we can simply patch it and let _rev
    // take care of avoiding conflicts.
    if (!sourceLink) {
      promise = patchEdge(edge);
    } else {
      // If it's an existing source, we can just send the whole thing to the server.
      if (sourceLink.sourceKey) {
        promise = patchEdgeWithExistingSource(edge, sourceLink);
      } else if (source) {
        promise = patchEdgeWithNewSource(edge, sourceLink, source);
        expectSource = true;
      } else {
        dispatch(
          actionSaveError(requestId, {
            eMessage:
              "While editing, o Source found in source forms with id:" +
              sourceEditorId,
            eData: null,
            eStatus: ERROR_CODES.MISSING_SOURCE_FORM
          })
        );
        return;
      }
    }
  }

  return promise
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionSaveError(requestId, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it to the Store!
      if (expectSource) {
        const { source, relation } = res.data;
        dispatch(actionEdgeSaveSuccess(requestId, relation));
        dispatch(actionSourcesReceived([source._key], [source]));
      } else {
        dispatch(actionEdgeSaveSuccess(requestId, res.data));
      }
      // dispatch(actionClearSaveRequest(requestId));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error(
        `Error saving edge from ${edge._from} to ${edge._to}`,
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

function actionEdgeSaveSuccess(requestId: string, payload: object): Action {
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

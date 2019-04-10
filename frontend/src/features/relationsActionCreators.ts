import { Dispatch } from "redux";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import { Action, ErrorPayload, Edge } from "../utils/types";
import { Status } from "../utils/types";
import { AxiosError } from "axios";

// Thunk Action
export const postEdge = (edge: Edge, requestId: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionRequest(requestId));
  console.log(edge);
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

function actionRequest(requestId: string): Action {
  return {
    type: ACTIONS.EdgePostSent,
    status: Status.Requested,
    meta: { requestId: requestId }
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

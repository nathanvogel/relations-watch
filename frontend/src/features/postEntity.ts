import { Dispatch } from "redux";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import { Action, ErrorPayload, EntityForUpload } from "../utils/types";
import { Status } from "../utils/types";
import { AxiosError } from "axios";

/**
 * Upload new entities to the database.
 */
export const postEntity = (
  entity: EntityForUpload,
  requestId: string
) => async (dispatch: Dispatch): Promise<void> => {
  dispatch(actionRequest(requestId));
  api
    .post(`/entities`, entity)
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
        `Error posting entity ${entity.name}`,
        requestId,
        errorPayload
      );
      dispatch(actionError(requestId, errorPayload));
    });
};

export const patchEntity = (
  entity: EntityForUpload,
  requestId: string
) => async (dispatch: Dispatch): Promise<void> => {
  dispatch(actionRequest(requestId));
  api
    .patch(`/entities`, entity)
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
        `Error patching entity ${entity.name}`,
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
    type: ACTIONS.EntityPostSent,
    status: Status.Requested,
    meta: { requestId: requestId }
  };
}

function actionClearRequest(requestId: string): Action {
  return {
    type: ACTIONS.EntityPostClear,
    status: Status.Clear,
    meta: { requestId }
  };
}

function actionError(requestId: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.EntityPostError,
    status: Status.Error,
    meta: { requestId: requestId, error: error }
  };
}

function actionReceived(requestId: string, payload: object): Action {
  return {
    type: ACTIONS.EntityPostSuccess,
    payload,
    status: Status.Ok,
    meta: { requestId: requestId }
  };
}

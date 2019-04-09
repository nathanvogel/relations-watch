import { Dispatch } from "redux";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import { Action, ErrorPayload } from "../utils/types";
import { Status } from "../utils/types";
import { AxiosError } from "axios";

// Thunk Action
export const loadEntity = (entityKey: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(actionRequest(entityKey));
  api
    .get(`/entities/${entityKey}`)
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        dispatch(actionError(entityKey, potentialError));
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(actionReceived(entityKey, res.data));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error("Error getting entity ", entityKey, errorPayload);
      dispatch(actionError(entityKey, errorPayload));
    });
};

function actionRequest(entityKey: string): Action {
  return {
    type: ACTIONS.EntityRequested,
    status: Status.Requested,
    meta: { entityKey: entityKey }
  };
}

function actionError(entityKey: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.EntityError,
    status: Status.Error,
    meta: { entityKey: entityKey, error: error }
  };
}

function actionReceived(entityKey: string, payload: object): Action {
  return {
    type: ACTIONS.EntityReceived,
    payload,
    status: Status.Ok,
    meta: { entityKey: entityKey }
  };
}

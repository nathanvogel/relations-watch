import { Dispatch } from "redux";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import { Action, ErrorPayload } from "../utils/types";
import { Status } from "../utils/types";
import { AxiosError } from "axios";
import { inbetweenSucessAction } from "./inbetweenActions";

/**
 * Load all edges between 2 entities to
 * /relations/data/[relationId]/[edgeId]
 */
export const loadEntityGraph = (entityKey: string) => async (
  dispatch: Dispatch
): Promise<void> => {
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
    type: ACTIONS.LinksLoadRequested,
    status: Status.Requested,
    meta: { entityKey },
  };
}

function actionLLError(entityKey: string, error: ErrorPayload): Action {
  return {
    type: ACTIONS.LinksLoadError,
    status: Status.Error,
    meta: { entityKey, error },
  };
}

function actionLLReceived(entityKey: string, payload: object): Action {
  return {
    type: ACTIONS.LinksLoadSuccess,
    payload,
    status: Status.Ok,
    meta: { entityKey },
  };
}

/**
 * Load all EdgePreview between the given entities, + the given entities
 */
export const loadInbetweenData = (entityKeys: string[]) => async (
  dispatch: Dispatch
): Promise<void> => {
  const dbEntityKeys = entityKeys.map(key => "entities/" + key);
  api
    .post(`/graphs/inbetween`, dbEntityKeys)
    .then(res => {
      const potentialError = checkResponse(res);
      if (potentialError) {
        // TODO : error handling
        console.error(potentialError);
        return;
      }
      // Everything is fine, we got the data, send it!
      dispatch(inbetweenSucessAction(res.data.edges, res.data.vertices));
    })
    .catch((error: AxiosError) => {
      const errorPayload = checkError(error);
      console.error("Error getting links of ", entityKeys, errorPayload);
    });
};

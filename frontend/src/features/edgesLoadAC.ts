import { Dispatch } from "redux";

import api, { checkError, checkResponse } from "../utils/api";
import ACTIONS from "../utils/ACTIONS";
import { Action, ErrorPayload, Edge } from "../utils/types";
import { Status } from "../utils/types";
import { AxiosError } from "axios";
import { getRelationId } from "../utils/utils";
import { loadSources } from "./sourcesAC";
import { RootStore } from "../Store";

/**
 * Load all edges between 2 entities to
 * /relations/data/[relationId]/[edgeId]
 */
export const loadRelation = (entity1Key: string, entity2Key: string) => async (
  dispatch: Dispatch,
  getState: () => RootStore
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

      // As a side-effect, we can load all the sources, because
      // they aren't nested in the documents.
      // Doing this in two requests allows to display the edges faster,
      // displaying the sources slightly later.
      const edges = res.data as Edge[];
      const sourcesToLoad: string[] = [];
      for (let edge of edges) {
        if (edge.sources) {
          for (let source of edge.sources) {
            if (source.sourceKey) sourcesToLoad.push(source.sourceKey);
          }
        }
      }
      return loadSources(sourcesToLoad)(dispatch, getState);
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

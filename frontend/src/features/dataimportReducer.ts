import * as ACTIONS from "../utils/ACTIONS";
import { DI_Action } from "./wikidataActions";
import update from "immutability-helper";

import {
  Dictionary,
  Edge,
  SimilarEntities,
  Entity,
  ImportStage,
  SimilarEntitiesSelection
} from "../utils/types";
import { combineReducers } from "redux";
import { DataImportState } from "../Store";

const dsEdgesReducer = (state: Dictionary<Edge> = {}, action: DI_Action) => {
  switch (action.type) {
    case ACTIONS.DI_DatasetFetched:
      return action.dsEdges;
    default:
      return state;
  }
};

const dsEntitiesReducer = (
  state: Dictionary<Entity> = {},
  action: DI_Action
) => {
  switch (action.type) {
    case ACTIONS.DI_DatasetFetched:
      return action.dsEntities;
    default:
      return state;
  }
};

const similarEntitiesReducer = (
  state: SimilarEntities = {},
  action: DI_Action
) => {
  switch (action.type) {
    case ACTIONS.DI_SimilarEntitiesRequested:
      return {};
    case ACTIONS.DI_SimilarEntitiesFetched:
      return action.similarEntities;
    default:
      return state;
  }
};

const similarEntitiesSelectionReducer = (
  state: SimilarEntitiesSelection = {},
  action: DI_Action
) => {
  switch (action.type) {
    case ACTIONS.DI_SimilarEntitySelected:
      return update(state, { [action.entityKey]: { $set: action.selection } });
    default:
      return state;
  }
};

const stageReducer = (
  state: ImportStage = ImportStage.Clear,
  action: DI_Action
) => {
  switch (action.type) {
    case ACTIONS.DI_DatasetRequested:
      return ImportStage.FetchingDataset;
    case ACTIONS.DI_DatasetFetched:
      return ImportStage.FetchedDataset;
    case ACTIONS.DI_SimilarEntitiesRequested:
      return ImportStage.FetchingSimilarEntities;
    case ACTIONS.DI_SimilarEntitiesFetched:
      return ImportStage.FetchedSimilarEntities;
    default:
      return state;
  }
};

const defaultReducer = (state: any = {}, action: DI_Action) => state;

export default combineReducers<DataImportState, DI_Action>({
  dsEdges: dsEdgesReducer,
  dsEntities: dsEntitiesReducer,
  similarEntities: similarEntitiesReducer,
  similarEntitiesSelection: similarEntitiesSelectionReducer,
  existingEntities: defaultReducer,
  entitiesToPatch: defaultReducer,
  entitiesToPost: defaultReducer,
  existingEdges: defaultReducer,
  edgesToPatch: defaultReducer,
  edgesToPost: defaultReducer,
  importStage: stageReducer,
  error: defaultReducer,
  depth: defaultReducer
});

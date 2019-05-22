import * as ACTIONS from "../utils/ACTIONS";
import { DI_Action } from "./wikidataActions";
import update from "immutability-helper";

import {
  Dictionary,
  Edge,
  SimilarEntities,
  Entity,
  ImportStage,
  SimilarEntitiesSelection,
  ErrorPayload,
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

const entitiesToPatchReducer = (state: Entity[] = [], action: DI_Action) => {
  if (action.type === ACTIONS.DI_EntitiesDiffFetched)
    return action.updates.elementsToPatch;
  return state;
};
const entitiesToPostReducer = (state: Entity[] = [], action: DI_Action) => {
  if (action.type === ACTIONS.DI_EntitiesDiffFetched)
    return action.updates.elementsToPost;
  return state;
};
const existingEntitiesReducer = (state: Entity[] = [], action: DI_Action) => {
  if (action.type === ACTIONS.DI_EntitiesDiffFetched)
    return action.updates.existingElements;
  return state;
};

const edgesToPatchReducer = (state: Edge[] = [], action: DI_Action) => {
  if (action.type === ACTIONS.DI_EdgesDiffFetched)
    return action.updates.elementsToPatch;
  return state;
};
const edgesToPostReducer = (state: Edge[] = [], action: DI_Action) => {
  if (action.type === ACTIONS.DI_EdgesDiffFetched)
    return action.updates.elementsToPost;
  return state;
};
const existingEdgesReducer = (state: Edge[] = [], action: DI_Action) => {
  if (action.type === ACTIONS.DI_EdgesDiffFetched)
    return action.updates.existingElements;
  return state;
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
    case ACTIONS.DI_WentToStage:
      return action.stage;
    case ACTIONS.DI_DatasetRequested:
      return ImportStage.FetchingDataset;
    case ACTIONS.DI_DatasetFetched:
      return ImportStage.FetchedDataset;
    case ACTIONS.DI_SimilarEntitiesRequested:
      return ImportStage.FetchingSimilarEntities;
    case ACTIONS.DI_SimilarEntitiesFetched:
      return ImportStage.FetchedSimilarEntities;
    case ACTIONS.DI_EntitiesDiffFetched:
      return ImportStage.FetchedEntityDiff;
    case ACTIONS.DI_EdgesDiffFetched:
      return ImportStage.FetchedEdgeDiff;
    case ACTIONS.DI_ImportSuccess:
      return ImportStage.ImportSuccessful;
    default:
      return state;
  }
};

const errorReducer = (state: ErrorPayload | null = null, action: DI_Action) => {
  switch (action.type) {
    case ACTIONS.DI_Error:
      return action.error;
    default:
      return state;
  }
};

const entryEntityReducer = (state: Entity | null = null, action: DI_Action) => {
  switch (action.type) {
    case ACTIONS.DI_ImportSuccess:
      return action.entryEntity || null;
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
  existingEntities: existingEntitiesReducer,
  entitiesToPatch: entitiesToPatchReducer,
  entitiesToPost: entitiesToPostReducer,
  existingEdges: existingEdgesReducer,
  edgesToPatch: edgesToPatchReducer,
  edgesToPost: edgesToPostReducer,
  importStage: stageReducer,
  error: errorReducer,
  depth: defaultReducer,
  entryEntity: entryEntityReducer,
});

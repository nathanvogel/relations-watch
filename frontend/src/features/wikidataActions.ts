import * as ACTIONS from "../utils/ACTIONS";
import {
  Edge,
  Entity,
  Dictionary,
  SimilarEntities,
  ErrorPayload,
  ImportStage,
  DatasetDiffResponseData
} from "../utils/types";

// ===== Dataset Fetching
interface DI_DatasetRequested_Action {
  type: ACTIONS.DI_DatasetRequested;
  namespace: string;
}
export function requestedDataset(
  namespace: string
): DI_DatasetRequested_Action {
  return {
    type: ACTIONS.DI_DatasetRequested,
    namespace
  };
}

interface DI_DatasetFetched_Action {
  type: ACTIONS.DI_DatasetFetched;
  namespace: string;
  dsEdges: Dictionary<Edge>;
  dsEntities: Dictionary<Entity>;
}
export function fetchedDataset(
  namespace: string,
  dsEdges: Dictionary<Edge>,
  dsEntities: Dictionary<Entity>
): DI_DatasetFetched_Action {
  return {
    type: ACTIONS.DI_DatasetFetched,
    namespace,
    dsEdges,
    dsEntities
  };
}

// ===== Generic Data Import actions

interface DI_Error_Action {
  type: ACTIONS.DI_Error;
  namespace: string;
  error: ErrorPayload;
}
export function dataimportError(
  namespace: string,
  error: ErrorPayload
): DI_Error_Action {
  return {
    type: ACTIONS.DI_Error,
    namespace,
    error
  };
}

interface DI_WentToStage_Action {
  type: ACTIONS.DI_WentToStage;
  namespace: string;
  stage: ImportStage;
}
export function wentToStage(
  namespace: string,
  stage: ImportStage
): DI_WentToStage_Action {
  return {
    type: ACTIONS.DI_WentToStage,
    namespace,
    stage
  };
}

// ===== Find Similar Entities

interface DI_SimilarEntitiesRequested_Action {
  type: ACTIONS.DI_SimilarEntitiesRequested;
  namespace: string;
}
export function requestedSimilarEntities(
  namespace: string
): DI_SimilarEntitiesRequested_Action {
  return {
    type: ACTIONS.DI_SimilarEntitiesRequested,
    namespace
  };
}

interface DI_SimilarEntitiesFetched_Action {
  type: ACTIONS.DI_SimilarEntitiesFetched;
  namespace: string;
  similarEntities: SimilarEntities;
}
export function fetchedSimilarEntities(
  namespace: string,
  similarEntities: SimilarEntities
): DI_SimilarEntitiesFetched_Action {
  return {
    type: ACTIONS.DI_SimilarEntitiesFetched,
    namespace,
    similarEntities
  };
}

interface DI_SimilarEntitySelected_Action {
  type: ACTIONS.DI_SimilarEntitySelected;
  namespace: string;
  selection: number;
  entityKey: string;
}
export function selectSimilarEntity(
  namespace: string,
  entityKey: string,
  selection: number
): DI_SimilarEntitySelected_Action {
  return {
    type: ACTIONS.DI_SimilarEntitySelected,
    namespace,
    selection,
    entityKey
  };
}

interface DI_EntitiesDiffFetched_Action {
  type: ACTIONS.DI_EntitiesDiffFetched;
  namespace: string;
  updates: DatasetDiffResponseData<Entity>;
}
export function fetchedEntitiesDiff(
  namespace: string,
  updates: DatasetDiffResponseData<Entity>
): DI_EntitiesDiffFetched_Action {
  return {
    type: ACTIONS.DI_EntitiesDiffFetched,
    namespace,
    updates
  };
}

interface DI_EdgesDiffFetched_Action {
  type: ACTIONS.DI_EdgesDiffFetched;
  namespace: string;
  updates: DatasetDiffResponseData<Edge>;
}
export function fetchedEdgesDiff(
  namespace: string,
  updates: DatasetDiffResponseData<Edge>
): DI_EdgesDiffFetched_Action {
  return {
    type: ACTIONS.DI_EdgesDiffFetched,
    namespace,
    updates
  };
}

export type DI_Action =
  | DI_DatasetRequested_Action
  | DI_DatasetFetched_Action
  | DI_SimilarEntitiesRequested_Action
  | DI_SimilarEntitiesFetched_Action
  | DI_SimilarEntitySelected_Action
  | DI_Error_Action
  | DI_WentToStage_Action
  | DI_EntitiesDiffFetched_Action
  | DI_EdgesDiffFetched_Action;

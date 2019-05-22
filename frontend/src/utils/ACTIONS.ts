import { AnyAction } from "redux";

const ACTIONS = {
  EntityLoadRequested: "EntityLoadRequested",
  EntityLoadSuccess: "EntityLoadSuccess",
  EntityLoadError: "EntityLoadError",
  RelationLoadRequested: "RelationLoadRequested",
  RelationLoadSuccess: "RelationLoadSuccess",
  RelationLoadError: "RelationLoadError",
  EdgeLoadRequested: "EdgeLoadRequested",
  EdgeLoadSuccess: "EdgeLoadSuccess",
  EdgeLoadError: "EdgeLoadError",
  LinksLoadRequested: "LinksLoadRequested",
  LinksLoadSuccess: "LinksLoadSuccess",
  LinksLoadError: "LinksLoadError",
  EdgeSaveSent: "EdgeSaveSent",
  EdgeSaveClear: "EdgeSaveClear",
  EdgeSaveSuccess: "EdgeSaveSuccess",
  EdgeSaveError: "EdgeSaveError",
  EdgeDeleteSuccess: "EdgeDeleteSuccess",
  EntitySaveSent: "EntitySaveSent",
  EntitySaveClear: "EntitySaveClear",
  EntitySaveSuccess: "EntitySaveSuccess",
  EntitySaveError: "EntitySaveError",
  SourceSaveSent: "SourceSaveSent",
  SourceSaveClear: "SourceSaveClear",
  SourceSaveSuccess: "SourceSaveSuccess",
  SourceSaveError: "SourceSaveError",
  SourceRefGetSent: "SourceRefGetSent",
  SourceRefGetClear: "SourceRefGetClear",
  SourceRefGetSuccess: "SourceRefGetSuccess",
  SourceRefGetError: "SourceRefGetError",
  SourceGetManyRequested: "SourceGetManyRequested",
  SourceGetManySuccess: "SourceGetManySuccess",
  SourceGetManyError: "SourceGetManyError",
  EntityLoadManyRequested: "EntityLoadManyRequested",
  EntityLoadManySuccess: "EntityLoadManySuccess",
  EntityLoadManyError: "EntityLoadManyError",
  status: {
    ok: "ok",
    error: "error",
    requested: "requested",
  },
};

export default ACTIONS;

export interface NamespacedAction extends AnyAction {
  namespace: string;
}

// ===== Source form
export const SOU_DESCRIPTION_CHANGE = "SOU_DESCRIPTION_CHANGE";
export type SOU_DESCRIPTION_CHANGE = typeof SOU_DESCRIPTION_CHANGE;

export const SOU_AUTHORS_CHANGE = "SOU_AUTHORS_CHANGE";
export type SOU_AUTHORS_CHANGE = typeof SOU_AUTHORS_CHANGE;

export const SOU_INITIAL_DATA = "SOU_INITIAL_DATA";
export type SOU_INITIAL_DATA = typeof SOU_INITIAL_DATA;

export const SOU_CLEAR_DATA = "SOU_CLEAR_DATA";
export type SOU_CLEAR_DATA = typeof SOU_CLEAR_DATA;

// ===== Entity Selection
export const SelectEntities = "SelectEntities";
export type SelectEntities = typeof SelectEntities;
export const DeselectEntities = "DeselectEntities";
export type DeselectEntities = typeof DeselectEntities;

// ===== Dataset Import
export const DI_Error = "DI_Error";
export type DI_Error = typeof DI_Error;
export const DI_WentToStage = "DI_WentToStage";
export type DI_WentToStage = typeof DI_WentToStage;
export const DI_DatasetRequested = "DI_DatasetRequested";
export type DI_DatasetRequested = typeof DI_DatasetRequested;
export const DI_DatasetFetched = "DI_DatasetFetched";
export type DI_DatasetFetched = typeof DI_DatasetFetched;
export const DI_SimilarEntitiesRequested = "DI_SimilarEntitiesRequested";
export type DI_SimilarEntitiesRequested = typeof DI_SimilarEntitiesRequested;
export const DI_SimilarEntitiesFetched = "DI_SimilarEntitiesFetched";
export type DI_SimilarEntitiesFetched = typeof DI_SimilarEntitiesFetched;
export const DI_SimilarEntitiesPostSent = "DI_SimilarEntitiesPostSent";
export type DI_SimilarEntitiesPostSent = typeof DI_SimilarEntitiesPostSent;
export const DI_SimilarEntitiesPosted = "DI_SimilarEntitiesPosted";
export type DI_SimilarEntitiesPosted = typeof DI_SimilarEntitiesPosted;
export const DI_SimilarEntitySelected = "DI_SimilarEntitySelected";
export type DI_SimilarEntitySelected = typeof DI_SimilarEntitySelected;
export const DI_EntitiesDiffFetched = "DI_EntitiesDiffFetched";
export type DI_EntitiesDiffFetched = typeof DI_EntitiesDiffFetched;
export const DI_EdgesDiffFetched = "DI_EdgesDiffFetched";
export type DI_EdgesDiffFetched = typeof DI_EdgesDiffFetched;
export const DI_ImportSuccess = "DI_ImportSuccess";
export type DI_ImportSuccess = typeof DI_ImportSuccess;

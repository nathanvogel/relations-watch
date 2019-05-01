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
    requested: "requested"
  }
};

export default ACTIONS;

export interface NamespacedAction extends AnyAction {
  namespace: string;
}

export const SOU_DESCRIPTION_CHANGE = "SOU_DESCRIPTION_CHANGE";
export type SOU_DESCRIPTION_CHANGE = typeof SOU_DESCRIPTION_CHANGE;

export const SOU_AUTHORS_CHANGE = "SOU_AUTHORS_CHANGE";
export type SOU_AUTHORS_CHANGE = typeof SOU_AUTHORS_CHANGE;

export const SOU_INITIAL_DATA = "SOU_INITIAL_DATA";
export type SOU_INITIAL_DATA = typeof SOU_INITIAL_DATA;

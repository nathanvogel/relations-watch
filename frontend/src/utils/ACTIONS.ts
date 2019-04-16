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
  EntitySaveSent: "EntitySaveSent",
  EntitySaveClear: "EntitySaveClear",
  EntitySaveSuccess: "EntitySaveSuccess",
  EntitySaveError: "EntitySaveError",
  status: {
    ok: "ok",
    error: "error",
    requested: "requested"
  }
};

export default ACTIONS;

export interface RootAction {
  type: string;
}

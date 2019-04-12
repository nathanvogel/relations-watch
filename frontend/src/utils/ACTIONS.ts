const ACTIONS = {
  EntityRequested: "EntityRequested",
  EntityReceived: "EntityReceived",
  EntityError: "EntityError",
  RelationRequested: "RelationRequested",
  RelationReceived: "RelationReceived",
  RelationError: "RelationError",
  LinksRequested: "LinksRequested",
  LinksReceived: "LinksReceived",
  LinksError: "LinksError",
  EdgePostSent: "EdgePostSent",
  EdgePostClear: "EdgePostClear",
  EdgePostSuccess: "EdgePostSuccess",
  EdgePostError: "EdgePostError",
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

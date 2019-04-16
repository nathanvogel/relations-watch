const ACTIONS = {
  EntityRequested: "EntityRequested",
  EntityReceived: "EntityReceived",
  EntityError: "EntityError",
  RelationRequested: "RelationRequested",
  RelationReceived: "RelationReceived",
  RelationError: "RelationError",
  EdgeRequested: "EdgeRequested",
  EdgeReceived: "EdgeReceived",
  EdgeError: "EdgeError",
  LinksRequested: "LinksRequested",
  LinksReceived: "LinksReceived",
  LinksError: "LinksError",
  EdgePostSent: "EdgePostSent",
  EdgePostClear: "EdgePostClear",
  EdgePostSuccess: "EdgePostSuccess",
  EdgePostError: "EdgePostError",
  EntityPostSent: "EntityPostSent",
  EntityPostClear: "EntityPostClear",
  EntityPostSuccess: "EntityPostSuccess",
  EntityPostError: "EntityPostError",
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

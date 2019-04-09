const ACTIONS = {
  EntityRequested: "EntityRequested",
  EntityReceived: "EntityReceived",
  EntityError: "EntityError",
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

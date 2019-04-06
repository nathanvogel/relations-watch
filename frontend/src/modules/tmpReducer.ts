import ACTIONS from "../utils/ACTIONS";

export interface Action {
  type: string;
}

export default (state = { authStatus: "init" }, action: Action) => {
  switch (action.type) {
    case ACTIONS.XRequested: {
      return Object.assign({}, state, { authStatus: "requested" });
    }
    default:
      return state;
  }
};

import ACTIONS from "../utils/ACTIONS";

export interface Action {
  type: string;
  meta: {
    entityKey: string;
  };
  payload: object;
}

export default (state = { authStatus: "init" }, action: Action) => {
  switch (action.type) {
    case ACTIONS.EntityRequested: {
      return Object.assign({}, state, {
        [action.meta.entityKey]: action
      });
    }
    default:
      return state;
  }
};

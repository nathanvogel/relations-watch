import ACTIONS from "../utils/ACTIONS";
import { Action } from "../utils/types";
import update from "immutability-helper";

const defaultState = { data: {}, status: {}, errors: {} };

export default (state = defaultState, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};

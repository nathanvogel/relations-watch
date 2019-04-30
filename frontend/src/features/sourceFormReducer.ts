import * as ACTIONS from "../utils/ACTIONS";
import { SourceFormAction } from "./sourceFormActions";
import update from "immutability-helper";

import { SourceFormData } from "../utils/types";

const defaultState: SourceFormData = {
  authors: [],
  description: ""
};

/**
 * This reducer takes care of updating the state in response to requests
 * that are scoped to a component instance or a request Id.
 */
export default (
  state: SourceFormData = defaultState,
  action: SourceFormAction
) => {
  switch (action.type) {
    case ACTIONS.SOU_DESCRIPTION_CHANGE:
      return update(state, { description: { $set: action.newDescription } });
    case ACTIONS.SOU_INITIAL_DATA:
      const { authors, description } = action.data;
      return update(state, { $merge: { authors, description } });
    default:
      return state;
  }
};

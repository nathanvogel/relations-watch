import * as ACTIONS from "../utils/ACTIONS";
import { SourceFormAction } from "./sourceFormActions";
import update from "immutability-helper";

import { SourceFormData } from "../utils/types";
import { getArray } from "../utils/utils";

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
    case ACTIONS.SOU_AUTHORS_CHANGE:
      const authors2: string[] = [];
      if (action.selection) {
        const selectionArray = getArray(action.selection);
        for (let option of selectionArray) {
          authors2.push(option.value);
        }
      }
      return update(state, { authors: { $set: authors2 } });
    default:
      return state;
  }
};

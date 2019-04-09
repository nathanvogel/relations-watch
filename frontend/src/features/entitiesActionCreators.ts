import { Dispatch } from "redux";

import ACTIONS from "../utils/ACTIONS";
// Thunk Action
export const loadEntity = (entityKey: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  setTimeout(() => {
    console.log("Dispatching");
    dispatch({
      type: ACTIONS.EntityRequested,
      payload: { name: "Hey this is a test" },
      status: "ok",
      meta: { entityKey: entityKey }
    });
  }, 1000);
};

import Redux, { AnyAction } from "redux";
import { NamespacedAction, RootAction } from "../utils/ACTIONS";

/**
 * Code from: https://gist.github.com/zivni/677638f712b9d16f78ee1903b5a11596
 *
 * Use this reducer enhancer to store specific control instance state by key.
 * The key will be resolved using the namespaceResolver function parmeter which defaults to use the controlInstanceKey member of the action's meta object (i.e action.meta.controlInstanceKey)
 * If the key is not a string then the action will be ignored and will not pass to the enhanched reducer.
 * @param {function} reducer - the reducer to enhance
 * @param {function} namespaceResolver - an optional function to get the instance key from the action
 */
export function namespaceEnhancer<T>(
  reducer: (state: T, action: any) => T,
  namespaceResolver: ((action: any) => string | undefined) = defaultKeyResolver
) {
  return function(state: { [key: string]: T } = {}, action: any) {
    const instanceKey = namespaceResolver(action);
    if (typeof instanceKey === "string" && instanceKey) {
      let instanceState = reducer(state[instanceKey], action);
      const newState = Object.assign({}, state, {
        [instanceKey]: instanceState
      });
      return newState;
    } else {
      return state;
    }
  };
}

function defaultKeyResolver(action: any) {
  if ("namespace" in action) return action.namespace;
  else return undefined;
}

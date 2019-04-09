import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./features/app";

// import { createLogger } from "redux-logger";
// import { batchedSubscribe } from "redux-batched-subscribe";
// import debounce from "lodash.debounce";

// const logger = createLogger();
// const debounceNotify = debounce(notify => notify());

const enhancer = compose(
  applyMiddleware(thunk)
  // applyMiddleware(thunk, logger),
  // batchedSubscribe(debounceNotify)
);

const initialState = {};
const store = createStore(rootReducer, initialState, enhancer);

export default store;

export interface Entity {
  type: string;
  status: string;
  payload: { name: string };
  meta: object;
}

export interface RootStore {
  entities: {
    [key: string]: Entity;
  };
}

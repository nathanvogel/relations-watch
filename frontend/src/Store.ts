import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import rootReducer from "./features/app";
import { Status, ErrorPayload, Entity, Relation } from "./utils/types";

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

export interface RootStore {
  entities: {
    data: { [key: string]: Entity };
    errors: { [key: string]: ErrorPayload };
    status: { [key: string]: Status };
  };
  relations: {
    data: { [key: string]: Relation };
    errors: { [key: string]: ErrorPayload };
    status: { [key: string]: Status };
  };
}

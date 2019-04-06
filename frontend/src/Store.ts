import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./modules/app";

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

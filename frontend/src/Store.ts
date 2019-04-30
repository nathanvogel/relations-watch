import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import rootReducer from "./features/app";
import {
  Status,
  ErrorPayload,
  Entity,
  ConnectedEntities,
  EdgePreview,
  Edge,
  EntityPreview,
  SourceFormData
} from "./utils/types";

// import { createLogger } from "redux-logger";
// import { batchedSubscribe } from "redux-batched-subscribe";
// import debounce from "lodash.debounce";

// const logger = createLogger();
// const debounceNotify = debounce(notify => notify());

const reduxWindow = window as any;
const composeEnhancers =
  reduxWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk)
  // applyMiddleware(thunk, logger),
  // batchedSubscribe(debounceNotify)
);

const store = createStore(rootReducer, {}, enhancer);

export default store;

export interface RootStore {
  entities: {
    datapreview: { [key: string]: EntityPreview };
    data: { [key: string]: Entity };
    errors: { [key: string]: ErrorPayload };
    status: { [key: string]: Status };
  };
  edges: {
    data: { [key: string]: Edge };
    errors: { [key: string]: ErrorPayload };
    status: { [key: string]: Status };
  };
  relations: {
    data: { [key: string]: Edge[] };
    errors: { [key: string]: ErrorPayload };
    status: { [key: string]: Status };
  };
  links: {
    data: {
      // bylinkedentities: { [key: string]: [string, number][] };
      byentity: { [key: string]: ConnectedEntities };
      bykey: { [key: string]: EdgePreview }; // EntityId -> EdgePreview
    };
    errors: { [key: string]: ErrorPayload };
    status: { [key: string]: Status };
  };
  requests: {
    data: { [key: string]: any };
    errors: { [key: string]: ErrorPayload };
    status: { [key: string]: Status };
  };
  sourceForms: { [key: string]: SourceFormData };
}

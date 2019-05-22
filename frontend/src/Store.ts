import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import rootReducer from "./features/app";
import {
  Status,
  ErrorPayload,
  Entity,
  Connections,
  EdgePreview,
  Edge,
  EntityPreview,
  Source,
  Dictionary,
  ImportStage,
  SimilarEntities,
  SimilarEntitiesSelection,
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
      byentity: { [baseEntityKey: string]: Connections };
      all: { [edgeKey: string]: EdgePreview }; // EntityId -> EdgePreview
      byrelation: { [relationKey: string]: { [edgeKey: string]: EdgePreview } };
    };
    errors: { [key: string]: ErrorPayload };
    status: { [key: string]: Status };
  };
  requests: {
    data: { [key: string]: any };
    errors: { [key: string]: ErrorPayload };
    status: { [key: string]: Status };
  };
  sources: {
    data: { [key: string]: Source };
    errors: { [key: string]: ErrorPayload };
    status: { [key: string]: Status };
  };
  sourceForms: { [key: string]: Source };
  entitySelection: string[];
  dataimport: {
    [entryPoint: string]: DataImportState;
  };
}

export interface DataImportState {
  dsEdges: Dictionary<Edge>;
  dsEntities: Dictionary<Entity>;
  similarEntities: SimilarEntities;
  similarEntitiesSelection: SimilarEntitiesSelection;
  existingEntities: Entity[];
  entitiesToPatch: Entity[];
  entitiesToPost: Entity[];
  existingEdges: Edge[];
  edgesToPatch: Edge[];
  edgesToPost: Edge[];
  importStage: ImportStage;
  entryEntity: Entity | null;
  error: ErrorPayload | null;
  depth: number | null;
}

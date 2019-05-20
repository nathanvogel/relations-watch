import { combineReducers } from "redux";

import { namespaceEnhancer } from "./namespacer";
import entitiesReducer from "./entitiesReducer";
import relationsReducer from "./relationsReducer";
import edgesReducer from "./edgesReducer";
import linksReducer from "./linksReducer";
import saveRequestReducer from "./saveRequestReducer";
import sourceFormReducer from "./sourceFormReducer";
import dataimportReducer from "./dataimportReducer";
import sourcesReducer from "./sourcesReducer";
import entitySelectionReducer from "./entitySelectionReducer";

export default combineReducers({
  requests: saveRequestReducer,
  entities: entitiesReducer,
  edges: edgesReducer,
  relations: relationsReducer,
  links: linksReducer,
  sources: sourcesReducer,
  sourceForms: namespaceEnhancer(sourceFormReducer),
  dataimport: namespaceEnhancer(dataimportReducer),
  entitySelection: entitySelectionReducer
});

import { combineReducers } from "redux";
import entitiesReducer from "./entitiesReducer";
import relationsReducer from "./relationsReducer";
import edgesReducer from "./edgesReducer";
import linksReducer from "./linksReducer";
import saveRequestReducer from "./saveRequestReducer";
import { namespaceEnhancer } from "./namespacer";
import sourceFormReducer from "./sourceFormReducer";

export default combineReducers({
  requests: saveRequestReducer,
  entities: entitiesReducer,
  edges: edgesReducer,
  relations: relationsReducer,
  links: linksReducer,
  sourceForms: namespaceEnhancer(sourceFormReducer)
});

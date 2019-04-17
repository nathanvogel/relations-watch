import { combineReducers } from "redux";
import entitiesReducer from "./entitiesReducer";
import relationsReducer from "./relationsReducer";
import edgesReducer from "./edgesReducer";
import linksReducer from "./linksReducer";
import saveRequestReducer from "./saveRequestReducer";

export default combineReducers({
  entities: entitiesReducer,
  edges: edgesReducer,
  relations: relationsReducer,
  links: linksReducer,
  requests: saveRequestReducer
});

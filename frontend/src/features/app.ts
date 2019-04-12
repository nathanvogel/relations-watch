import { combineReducers } from "redux";
import entitiesReducer from "./entitiesReducer";
import relationsReducer from "./relationsReducer";
import linksReducer from "./linksReducer";
import postRequestsReducer from "./postRequestsReducer";

export default combineReducers({
  entities: entitiesReducer,
  relations: relationsReducer,
  links: linksReducer,
  requests: postRequestsReducer
});

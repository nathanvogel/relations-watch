import { combineReducers } from "redux";
import entitiesReducer from "./entitiesReducer";
import relationsReducer from "./relationsReducer";
import postRequestsReducer from "./postRequestsReducer";

export default combineReducers({
  entities: entitiesReducer,
  relations: relationsReducer,
  requests: postRequestsReducer
});

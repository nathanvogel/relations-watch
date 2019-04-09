import { combineReducers } from "redux";
import entitiesReducer from "./entitiesReducer";
import relationsReducer from "./relationsReducer";

export default combineReducers({
  entities: entitiesReducer,
  relations: relationsReducer
});

import { combineReducers } from "redux";
import entitiesReducer from "./entitiesReducer";

export default combineReducers({
  entities: entitiesReducer
});

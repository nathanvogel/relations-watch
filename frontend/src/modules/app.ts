import { combineReducers } from "redux";
import tmpReducer from "./tmpReducer";

export default combineReducers({
  tmp: tmpReducer
});

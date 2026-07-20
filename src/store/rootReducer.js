import { combineReducers } from "@reduxjs/toolkit";
import registerReducer from "../pages/register.slice";

const rootReducer = combineReducers({
  register: registerReducer,
});

export default rootReducer;

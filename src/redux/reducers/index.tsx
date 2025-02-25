import { combineReducers } from "redux";

import globalReducer from "./global.reducer";
import userReducer from "./user.reducer";

const rootReducer = combineReducers({
  global: globalReducer,
  auth: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

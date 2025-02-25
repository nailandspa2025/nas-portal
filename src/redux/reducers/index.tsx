import { combineReducers } from "redux";

import globalLoading from "./global.reducer";
import userReducer from "./user.reducer";

const rootReducer = combineReducers({
  globalLoading,
  auth: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

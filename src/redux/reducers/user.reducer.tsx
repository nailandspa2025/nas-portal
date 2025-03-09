import { STORAGE_KEY } from "../../constants/application.constant";
import {
  USER_LOADED,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
} from "../actions/user.actions";

interface UserState {
  user: object;
  authToken: string | null;
}

type UserAction = {
  type: typeof USER_LOGGED_IN | typeof USER_LOGGED_OUT | typeof USER_LOADED;
  payload: {
    data: {
      jwToken?: string;
      user?: object;
    };
  };
};

const initialAuthState: UserState = {
  user: {},
  authToken: localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN),
};

const userReducer = (state = initialAuthState, action: UserAction) => {
  switch (action.type) {
    case USER_LOGGED_IN: {
      const accessToken = action.payload.data.jwToken;
      if (accessToken) {
        localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, accessToken);
      }

      return { authToken: accessToken, user: action.payload.data };
    }

    case USER_LOGGED_OUT: {
      localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
      return initialAuthState;
    }

    case USER_LOADED: {
      const { user } = action.payload.data;
      return { ...state, user };
    }

    default:
      return state;
  }
};

export default userReducer;

import { STORAGE_KEY } from "../../constants/application.constant";
import {
  USER_LOADED,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
} from "../actions/user.actions";

interface UserState {
  user: unknown;
  authToken: string | null;
}

type UserAction = {
  type: typeof USER_LOGGED_IN | typeof USER_LOGGED_OUT | typeof USER_LOADED;
  payload: {
    data: {
      access_token?: string;
      user?: unknown;
    };
  };
};

const initialAuthState: UserState = {
  user: undefined,
  authToken: localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN),
};

const userReducer = (state = initialAuthState, action: UserAction) => {
  switch (action.type) {
    case USER_LOGGED_IN: {
      const accessToken = action.payload.data.access_token;
      if (accessToken) {
        localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, accessToken);
      }

      return { authToken: accessToken, user: undefined };
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

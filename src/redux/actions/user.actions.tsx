import { LoginResponse, UserInfo } from "../../apis/auth/interface";

export const USER_LOGGED_IN = "USER_LOGGED_IN" as const;
export const USER_LOGGED_OUT = "USER_LOGGED_OUT" as const;
export const USER_LOADED = "USER_LOADED" as const;

export const userLoggedIn = (loginResponse: LoginResponse) => {
  return {
    type: USER_LOGGED_IN,
    payload: loginResponse,
  };
};

export const userLoggedOut = () => {
  return {
    type: USER_LOGGED_OUT,
  };
};

export const userLoadded = (userInfo: UserInfo) => {
  return {
    type: USER_LOADED,
    payload: userInfo,
  };
};

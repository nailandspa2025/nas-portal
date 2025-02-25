export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const USER_LOGGED_OUT = "USER_LOGGED_OUT";
export const USER_LOADED = "USER_LOADED";

interface UserInfo {
  id: string;
  email: string;
  name?: string;
  userName: string;
  fullName: string;
}

interface LoginResponse {
  token: string;
  user: UserInfo;
}

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

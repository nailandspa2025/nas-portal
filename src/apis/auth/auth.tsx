/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { LoginPayload, LoginResponse } from "./interface";
export const AuthApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const endpoint = `/user/api/v1/users/login`;
    return await apiCall<LoginResponse>("POST", endpoint, payload);
  },
  getWithPagination: async (queryString: any) => {
    const endpoint = `/user/api/v1/users/pagingation?${queryString}`;
    return await apiCall("GET", endpoint);
  },
};

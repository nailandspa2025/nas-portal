/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";
import { LoginPayload, LoginResponse } from "./interface";
export const AuthApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const endpoint = `/user/api/v1/users/login`;
    return await apiCall<LoginResponse>(API_METHOD.POST, endpoint, payload);
  },
  getWithPagination: async (queryString: any) => {
    const endpoint = `/user/api/v1/users/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  userInfo: async () => {
    const endpoint = `/user/api/v1/users/user-info`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  detail: async (id: string) => {
    const endpoint = `/user/api/v1/users/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/user/api/v1/users`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: string, payload: any) => {
    const endpoint = `/user/api/v1/users/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
};

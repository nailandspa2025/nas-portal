/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const RoleApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/user/api/v1/roles/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: string) => {
    const endpoint = `/user/api/v1/roles/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/user/api/v1/roles`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: string, payload: any) => {
    const endpoint = `/user/api/v1/roles/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
  delete: async (id: string) => {
    const endpoint = `/user/api/v1/roles/${id}`;
    return await apiCall(API_METHOD.DELETE, endpoint);
  },
};

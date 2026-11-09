/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const AppVersionApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/user/api/v1/appVersions/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: number) => {
    const endpoint = `/user/api/v1/appVersions/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/user/api/v1/appVersions`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: number, payload: any) => {
    const endpoint = `/user/api/v1/appVersions/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
};

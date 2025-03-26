/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const AppAccountApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/user/api/v1/appAccounts/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: string) => {
    const endpoint = `/user/api/v1/appAccounts/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  trackingDevice: async (payload: any) => {
    const endpoint = `/user/api/v1/accountDevices/tracking-device`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  create: async (payload: any) => {
    const endpoint = `/user/api/v1/appAccounts/regiter`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: string, payload: any) => {
    const endpoint = `/user/api/v1/appAccounts/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
  delete: async (id: number) => {
    const endpoint = `/user/api/v1/appAccounts/${id}`;
    return await apiCall(API_METHOD.DELETE, endpoint);
  },
};

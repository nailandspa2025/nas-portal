/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const UserMerchantApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/user/api/v1/usermerchants/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: string) => {
    const endpoint = `/user/api/v1/usermerchants/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/user/api/v1/usermerchants`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: string, payload: any) => {
    const endpoint = `/user/api/v1/usermerchants/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
};

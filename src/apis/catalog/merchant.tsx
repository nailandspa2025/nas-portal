/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const MerchantApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/catalog/api/v1/merchants/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: number) => {
    const endpoint = `/catalog/api/v1/merchants/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/catalog/api/v1/merchants`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: number, payload: any) => {
    const endpoint = `/catalog/api/v1/merchants/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
  delete: async (id: number) => {
    const endpoint = `/catalog/api/v1/merchants/${id}`;
    return await apiCall(API_METHOD.DELETE, endpoint);
  },
};

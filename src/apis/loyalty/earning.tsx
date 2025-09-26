import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const EarningApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/loyalty/api/v1/earnings/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: number) => {
    const endpoint = `/loyalty/api/v1/earnings/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/loyalty/api/v1/earnings`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: any, payload: any) => {
    const endpoint = `/loyalty/api/v1/earnings/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
  delete: async (id: any) => {
    const endpoint = `/loyalty/api/v1/earnings/${id}`;
    return await apiCall(API_METHOD.DELETE, endpoint);
  },
};

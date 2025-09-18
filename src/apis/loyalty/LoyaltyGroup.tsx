import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";
export const LoyaltyGroupApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/loyalty/api/v1/loyaltygroups/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: number) => {
    const endpoint = `/loyalty/api/v1/loyaltygroups/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/loyalty/api/v1/loyaltygroups`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: any, payload: any) => {
    const endpoint = `/loyalty/api/v1/loyaltygroups/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
  delete: async (id: any) => {
    const endpoint = `/loyalty/api/v1/loyaltygroups/${id}`;
    return await apiCall(API_METHOD.DELETE, endpoint);
  },
};

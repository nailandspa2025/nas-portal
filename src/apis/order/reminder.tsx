import { API_METHOD } from "../../constants/application.constant";
import apiCall from "../index";
export const ReminderApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/order/api/v1/reminderconfigs/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: number) => {
    const endpoint = `/order/api/v1/reminderconfigs/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/order/api/v1/reminderconfigs`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: number, payload: any) => {
    const endpoint = `/order/api/v1/reminderconfigs/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
  delete: async (id: number) => {
    const endpoint = `/order/api/v1/reminderconfigs/${id}`;
    return await apiCall(API_METHOD.DELETE, endpoint);
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const BookingCancelReasonApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/order/api/v1/bookingcancelreasons/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: number) => {
    const endpoint = `/order/api/v1/bookingcancelreasons/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/order/api/v1/bookingcancelreasons`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: number, payload: any) => {
    const endpoint = `/order/api/v1/bookingcancelreasons/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
  delete: async (id: number) => {
    const endpoint = `/order/api/v1/bookingcancelreasons/${id}`;
    return await apiCall(API_METHOD.DELETE, endpoint);
  },
  getAll: async () => {
    const endpoint = `/order/api/v1/bookingcancelreasons/mobile-all`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
};

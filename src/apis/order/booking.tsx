/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const BookingApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/order/api/v1/bookings/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: number) => {
    const endpoint = `/order/api/v1/bookings/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/order/api/v1/bookings`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: number, payload: any) => {
    const endpoint = `/order/api/v1/bookings/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
  delete: async (id: number) => {
    const endpoint = `/order/api/v1/bookings/${id}`;
    return await apiCall(API_METHOD.DELETE, endpoint);
  },
  cancel: async (id: number) => {
    const endpoint = `/order/api/v1/bookings/cancel/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint);
  },
  payment: async (payload: any) => {
    const endpoint = `/order/api/v1/bookings/payment`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
};

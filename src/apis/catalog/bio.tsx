/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const StoreBioApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/catalog/api/v1/storebio/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: number) => {
    const endpoint = `/catalog/api/v1/storebio/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getByIds: async (ids: string) => {
    const endpoint = `/catalog/api/v1/storebio/ids/${ids}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/catalog/api/v1/storebio`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: number, payload: any) => {
    const endpoint = `/catalog/api/v1/storebio/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
  delete: async (id: number) => {
    const endpoint = `/catalog/api/v1/storebio/${id}`;
    return await apiCall(API_METHOD.DELETE, endpoint);
  },
};

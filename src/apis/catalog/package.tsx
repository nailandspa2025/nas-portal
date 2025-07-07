import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const PackageApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/catalog/api/v1/servicepackages/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: number) => {
    const endpoint = `/catalog/api/v1/servicepackages/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/catalog/api/v1/servicepackages`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: number, payload: any) => {
    const endpoint = `/catalog/api/v1/servicepackages/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
  delete: async (id: number) => {
    const endpoint = `/catalog/api/v1/servicepackages/${id}`;
    return await apiCall(API_METHOD.DELETE, endpoint);
  },
  getByIds: async (ids: string) => {
    const endpoint = `/catalog/api/v1/servicepackages/ids/${ids}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const PostApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/article/api/v1/posts/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getById: async (id: number) => {
    const endpoint = `/article/api/v1/posts/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/article/api/v1/posts`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  update: async (id: string, payload: any) => {
    const endpoint = `/article/api/v1/posts/${id}`;
    return await apiCall(API_METHOD.PUT, endpoint, payload);
  },
  delete: async (id: number) => {
    const endpoint = `/article/api/v1/posts/${id}`;
    return await apiCall(API_METHOD.DELETE, endpoint);
  },
};

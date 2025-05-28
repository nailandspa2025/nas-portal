/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const ChatApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/catalog/api/v1/banners/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },

  sendAll: async (payload: any) => {
    const endpoint = `/chat/api/v1/chats/send-all`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  sendPrivate: async (payload: any) => {
    const endpoint = `/chat/api/v1/chats/send-private`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
  sendGroup: async (payload: any) => {
    const endpoint = `/chat/api/v1/chats/send-group`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
};

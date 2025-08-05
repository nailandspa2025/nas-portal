/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const DeeplinkApi = {
  getDetail: async (queryString: any) => {
    const endpoint = `/catalog/api/v1/appdeeplinks/detail?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  create: async (payload: any) => {
    const endpoint = `/catalog/api/v1/appdeeplinks`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const UploadApi = {
  create: async (payload: any) => {
    const endpoint = `/catalog/api/v1/uploads`;
    return await apiCall(API_METHOD.POST, endpoint, payload);
  },
};

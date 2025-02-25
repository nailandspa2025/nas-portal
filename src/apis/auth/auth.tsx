import apiCall from "../index";
import { LoginPayload, LoginResponse } from "./interface";
export const AuthApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const endpoint = `/api/admin/v1/login`;
    return await apiCall<LoginResponse>("POST", endpoint, payload);
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

// nas-godaddy-connector-service: {VITE_API_URL}/godaddy
export const PaylinkApi = {
  getById: async (id: string) => {
    const endpoint = `/godaddy/api/pay/${encodeURIComponent(id)}`;
    return await apiCall<any>(API_METHOD.GET, endpoint);
  },
  pay: async (id: string, payload: { nonce: string; email?: string }) => {
    const endpoint = `/godaddy/api/pay/${encodeURIComponent(id)}/pay`;
    return await apiCall<any>(API_METHOD.POST, endpoint, payload);
  },
};

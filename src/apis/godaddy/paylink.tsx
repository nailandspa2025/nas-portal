/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

// nas-godaddy-connector-service: {VITE_API_URL}/godaddy
export const PaylinkApi = {
  getById: async (id: string) => {
    const endpoint = `/godaddy/api/v1/pay/${encodeURIComponent(id)}`;
    return await apiCall<any>(API_METHOD.GET, endpoint);
  },
  // Phụ phí thẻ credit (surcharge GoDaddy) cho thẻ vừa nhập, tính bằng cents
  fees: async (id: string, payload: { nonce: string }) => {
    const endpoint = `/godaddy/api/v1/pay/${encodeURIComponent(id)}/fees`;
    return await apiCall<any>(API_METHOD.POST, endpoint, payload);
  },
  pay: async (
    id: string,
    payload: { nonce: string; email?: string; acceptedSurcharge?: number },
  ) => {
    const endpoint = `/godaddy/api/v1/pay/${encodeURIComponent(id)}/pay`;
    return await apiCall<any>(API_METHOD.POST, endpoint, payload);
  },
};

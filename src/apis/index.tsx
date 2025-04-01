import axios, { Method, RawAxiosRequestHeaders } from "axios";
import { STORAGE_KEY } from "../constants/application.constant";
import store from "../redux/store";
import { toggleLoading } from "../redux/actions/global.actions";

const API_URL = import.meta.env.VITE_API_URL as string;

const apiCall = async <T,>(
  method: Method,
  endpoint: string,
  data?: unknown,
  headers: RawAxiosRequestHeaders = {},
  baseUrl: string = API_URL
): Promise<T> => {
  try {
    store.dispatch(toggleLoading(true));
    const authToken = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    const response = await axios({
      method,
      url: `${baseUrl}${endpoint}`,
      data,
      headers,
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data: unknown }; message?: string };
    console.error("API Error:", err?.response?.data || err.message);
    throw err?.response?.data || err;
  } finally {
    store.dispatch(toggleLoading(false));
  }
};

export default apiCall;

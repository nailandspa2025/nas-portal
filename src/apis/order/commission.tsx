/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const CommissionApi = {
  getWithPagination: async (queryString: any) => {
    const endpoint = `/order/api/v1/commissions/pagingation?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
};

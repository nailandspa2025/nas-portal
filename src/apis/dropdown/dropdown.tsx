/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

export const DropdownApi = {
  getUsers: async (queryString: any) => {
    const endpoint = `/user/api/v1/dropdownlist/users?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getUserById: async (id: string) => {
    const endpoint = `/user/api/v1/dropdownlist/user/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getTechnicians: async (queryString: any) => {
    const endpoint = `/user/api/v1/dropdownlist/technicians?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getTechnicianById: async (id: number) => {
    const endpoint = `/user/api/v1/dropdownlist/technician/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getGroups: async (queryString: any) => {
    const endpoint = `/user/api/v1/dropdownlist/groups?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getGroupById: async (id: string) => {
    const endpoint = `/user/api/v1/dropdownlist/group/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getAppAccounts: async (queryString: any) => {
    const endpoint = `/user/api/v1/dropdownlist/appaccounts?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getAppAccountById: async (id: number) => {
    const endpoint = `/user/api/v1/dropdownlist/appaccount/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },

  getProducts: async (queryString: any) => {
    const endpoint = `/catalog/api/v1/dropdownlist/products?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getProductById: async (id: number) => {
    const endpoint = `/catalog/api/v1/dropdownlist/product/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getStores: async (queryString: any) => {
    const endpoint = `/catalog/api/v1/dropdownlist/stores?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getStoreById: async (id: number) => {
    const endpoint = `/catalog/api/v1/dropdownlist/store/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
};

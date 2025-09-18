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
  getUserByIds: async (ids: string) => {
    const endpoint = `/user/api/v1/dropdownlist/user-ids/${ids}`;
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
  getTechnicianByIds: async (ids: string) => {
    const endpoint = `/user/api/v1/dropdownlist/technician-ids/${ids}`;
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
  getGroupByIds: async (ids: string) => {
    const endpoint = `/user/api/v1/dropdownlist/group-ids/${ids}`;
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
  getAppAccountByIds: async (ids: string) => {
    const endpoint = `/user/api/v1/dropdownlist/appaccount-ids/${ids}`;
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
  getProductByIds: async (ids: string) => {
    const endpoint = `/catalog/api/v1/dropdownlist/product-ids/${ids}`;
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
  getStoreByIds: async (ids: string) => {
    const endpoint = `/catalog/api/v1/dropdownlist/store-ids/${ids}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getUserMerchants: async (queryString: any) => {
    const endpoint = `/user/api/v1/dropdownlist/user-merchants?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getUserMerchantById: async (id: string) => {
    const endpoint = `/user/api/v1/dropdownlist/user-merchant/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getUserMerchantByIds: async (ids: string) => {
    const endpoint = `/user/api/v1/dropdownlist/user-merchant-ids/${ids}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getMerchants: async (queryString: any) => {
    const endpoint = `/catalog/api/v1/dropdownlist/merchants?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getMerchantById: async (id: string) => {
    const endpoint = `/catalog/api/v1/dropdownlist/merchant/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getMerchantByIds: async (ids: string) => {
    const endpoint = `/catalog/api/v1/dropdownlist/merchant-ids/${ids}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },

  getRewards: async (queryString: any) => {
    const endpoint = `/catalog/api/v1/dropdownlist/rewards?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getRewardById: async (id: string) => {
    const endpoint = `/catalog/api/v1/dropdownlist/rewards/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getRewardByIds: async (ids: string) => {
    const endpoint = `/catalog/api/v1/dropdownlist/rewards-ids/${ids}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },

  getServices: async (queryString: any) => {
    const endpoint = `/catalog/api/v1/dropdownlist/services?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getServiceById: async (id: string) => {
    const endpoint = `/catalog/api/v1/dropdownlist/service/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getServiceByIds: async (ids: string) => {
    const endpoint = `/catalog/api/v1/dropdownlist/service-ids/${ids}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },

  getBanks: async (queryString: any) => {
    const endpoint = `/catalog/api/v1/dropdownlist/banks?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getBankById: async (id: string) => {
    const endpoint = `/catalog/api/v1/dropdownlist/bank/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getBankByIds: async (ids: string) => {
    const endpoint = `/catalog/api/v1/dropdownlist/bank-ids/${ids}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getLoyaltyPoints: async (queryString: any) => {
    const endpoint = `/loyalty/api/v1/dropdownlist/loyaltypoints?${queryString}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getLoyaltyPointById: async (id: any) => {
    const endpoint = `/loyalty/api/v1/dropdownlist/loyaltypoint/${id}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
  getLoyaltyPointByIds: async (ids: string) => {
    const endpoint = `/loyalty/api/v1/dropdownlist/loyaltypoint-ids/${ids}`;
    return await apiCall(API_METHOD.GET, endpoint);
  },
};

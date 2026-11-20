/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import queryString from "query-string";
import { DropdownApi } from "../../apis/dropdown/dropdown";
import { BOOKING_STATUS_OPTIONS } from "../filter/bookingHistory";
export const getDataForFilter = async (actionName: string, searchText = "") => {
  switch (actionName) {
    case "bookingStatus":
      return BOOKING_STATUS_OPTIONS;
    case "userType":
      return [
        {
          value: 2,
          label: "User",
        },
        {
          value: 1,
          label: "Admin",
        },
      ];
    case "rewardStauts":
      return [
        {
          value: 1,
          label: "Pending",
        },
        {
          value: 2,
          label: "Approved",
        },
        {
          value: 3,
          label: "Rejected",
        },
      ];
    case "merchant":
      const response: any = await DropdownApi.getMerchants(
        queryString.stringify({
          page: 1,
          pageSize: 50,
          searchText: searchText,
        }),
      );
      return (
        response?.data?.items?.map((item: any) => ({
          value: item.id,
          label: item.name,
        })) || []
      );
    case "technician":
      const responseTechnician: any = await DropdownApi.getTechnicians(
        queryString.stringify({
          page: 1,
          pageSize: 50,
          searchText: searchText,
        }),
      );
      return (
        responseTechnician?.data?.items?.map((item: any) => ({
          value: item.id,
          label: item.technicianName,
        })) || []
      );
    case "service":
      const service: any = await DropdownApi.getServices(
        queryString.stringify({
          page: 1,
          pageSize: 50,
          searchText: searchText,
        }),
      );
      return (
        service?.data?.items?.map((item: any) => ({
          value: item.id,
          label: item.name,
        })) || []
      );
    case "store":
      const store: any = await DropdownApi.getStores(
        queryString.stringify({
          page: 1,
          pageSize: 50,
          searchText: searchText,
        }),
      );
      return (
        store?.data?.items?.map((item: any) => ({
          value: item.id,
          label: item.storeName,
        })) || []
      );
    default:
      return [];
  }
};

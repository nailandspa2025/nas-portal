/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MerchantApi } from "../../apis/catalog/merchant";
import queryString from "query-string";
export const getDataForFilter = async (actionName: string, searchText = "") => {
  switch (actionName) {
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
      const response: any = await MerchantApi.getWithPagination(
        queryString.stringify({
          page: 1,
          pageSize: 50,
          searchText: searchText,
        })
      );
      return (
        response?.data?.items?.map((item: any) => ({
          value: item.id,
          label: item.name,
        })) || []
      );

    default:
      return [];
  }
};

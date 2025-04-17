/* eslint-disable @typescript-eslint/no-explicit-any */

import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import { useMemo, useState } from "react";
import { DropdownApi } from "../apis/dropdown/dropdown";
import { useTranslation } from "react-i18next";
import { debounce, uniqBy } from "lodash-es";
interface UserSelectProps {
  value?: string;
  onChange?: (value: any) => void;
  placeholder?: string;
  mode?: "multiple" | "tags" | "";
}
const UserSelect: React.FC<UserSelectProps> = ({
  value,
  onChange,
  placeholder = "Please choose",
  mode = "",
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const { data = [], isLoading } = useQuery({
    queryKey: ["optionUserMerchants", searchText],
    queryFn: async () => {
      const res: any = await DropdownApi.getUserMerchants(
        queryString.stringify({ page: 1, pageSize: 20, searchText: searchText })
      );
      return res?.data?.items || [];
    },
  });
  const valuesArray = Array.isArray(value) ? value : value ? [value] : [];
  const isDataInList = valuesArray.every((id) =>
    data.some((u: { id: string }) => u.id === id)
  );
  const { data: extraData } = useQuery({
    queryKey: ["userMerchantByIds", valuesArray],
    queryFn: async () => {
      if (!valuesArray.length || isDataInList) return [];
      if (valuesArray.length === 1) {
        const res: any = await DropdownApi.getUserMerchantById(valuesArray[0]);
        return res?.data ? [res.data] : [];
      } else {
        const res: any = await DropdownApi.getUserMerchantByIds(
          valuesArray.join(",")
        );
        return res?.data || [];
      }
    },
    enabled: !!valuesArray.length && !isDataInList,
  });
  const mergedData = useMemo(() => {
    if (searchText) return data;
    return uniqBy([...data, ...(extraData || [])], "id");
  }, [data, extraData, searchText]);
  const onSearch = debounce((value: string) => {
    setSearchText(value);
  }, 500);
  return (
    <Select
      mode={mode || undefined}
      showSearch
      placeholder={t(placeholder)}
      value={value || undefined}
      loading={isLoading}
      onSearch={onSearch}
      onChange={onChange}
      filterOption={false}
      allowClear
      options={mergedData.map((user: any) => ({
        label: `${user.fullName} - ${user.email}`,
        value: user.id,
      }))}
      notFoundContent={isLoading ? <Spin size="small" /> : t("No data")}
    />
  );
};

export default UserSelect;

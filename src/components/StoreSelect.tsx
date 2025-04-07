/* eslint-disable @typescript-eslint/no-explicit-any */

import { StoreApi } from "../apis/catalog/store";
import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
interface StoreSelectProps {
  value?: any;
  onChange?: (value: string) => void;
  placeholder?: string;
  mode?: any;
}
const StoreSelect: React.FC<StoreSelectProps> = ({
  value,
  onChange,
  placeholder = "Choose",
  mode = "",
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["storeOption", searchText],
    queryFn: () =>
      StoreApi.getWithPagination(
        queryString.stringify({ page: 1, pageSize: 20, searchText: searchText })
      ),
  });
  const isUserInList = (data as any)?.data?.items?.some(
    (u: { id: number }) => u.id == value
  );
  const { data: singleUserData } = useQuery({
    queryKey: ["singleStore", value],
    queryFn: () => (value ? StoreApi.getById(value) : Promise.resolve(null)),
    enabled: !!value && !isUserInList,
  });
  const storeList = (data as any)?.data?.items || [];
  const mergedStore = [...storeList];
  if ((singleUserData as any)?.succeeded && !isUserInList) {
    mergedStore.push((singleUserData as any).data);
  }
  const onSearch = (event: string) => {
    setSearchText(event);
  };
  return (
    <Select
      mode={mode}
      showSearch
      placeholder={t(placeholder)}
      value={value || null}
      loading={isLoading}
      onSearch={onSearch}
      onChange={onChange}
      filterOption={false}
      allowClear
      options={mergedStore.map((store: any) => ({
        label: `${store.storeName} - ${store.hotline}`,
        value: store.id,
      }))}
      notFoundContent={isLoading ? <Spin size="small" /> : t("No data")}
    />
  );
};

export default StoreSelect;

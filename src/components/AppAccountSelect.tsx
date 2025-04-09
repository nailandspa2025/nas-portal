/* eslint-disable @typescript-eslint/no-explicit-any */

import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownApi } from "../apis/dropdown/dropdown";
interface UserSelectProps {
  value?: any;
  onChange?: (value: string) => void;
  placeholder?: string;
  mode?: any;
  disabled?: boolean;
}
const AppAccuntSelect: React.FC<UserSelectProps> = ({
  value,
  onChange,
  placeholder = "Choose",
  mode = "",
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["appAccountOption", searchText],
    queryFn: () =>
      DropdownApi.getAppAccounts(
        queryString.stringify({ page: 1, pageSize: 20, searchText: searchText })
      ),
  });
  const isUserInList = (data as any)?.data?.items?.some(
    (u: { id: number }) => u.id == value
  );
  const { data: singleUserData } = useQuery({
    queryKey: ["singleAppAccount", value],
    queryFn: () =>
      value ? DropdownApi.getAppAccountById(value) : Promise.resolve(null),
    enabled: !!value && !isUserInList,
  });
  const userList = (data as any)?.data?.items || [];
  const mergedUsers = [...userList];
  if ((singleUserData as any)?.succeeded && !isUserInList) {
    mergedUsers.push((singleUserData as any).data);
  }
  const onSearch = (event: string) => {
    setSearchText(event);
  };
  return (
    <Select
      disabled={disabled}
      mode={mode}
      showSearch
      placeholder={t(placeholder)}
      value={value || undefined}
      loading={isLoading}
      onSearch={onSearch}
      onChange={onChange}
      filterOption={false}
      allowClear
      options={mergedUsers.map((user: any) => ({
        label: `${user.fullName} - ${user.email}`,
        value: user.id,
      }))}
      notFoundContent={isLoading ? <Spin size="small" /> : t("No data")}
    />
  );
};

export default AppAccuntSelect;

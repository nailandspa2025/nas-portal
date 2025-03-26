/* eslint-disable @typescript-eslint/no-explicit-any */

import { AuthApi } from "../apis/auth/auth";
import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import { useState } from "react";
interface UserSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  mode?: any;
}
const UserSelect: React.FC<UserSelectProps> = ({
  value,
  onChange,
  placeholder = "Chọn",
  mode = "",
}) => {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["userOption", searchText],
    queryFn: () =>
      AuthApi.getWithPagination(
        queryString.stringify({ page: 1, pageSize: 20, searchText: searchText })
      ),
  });
  const isUserInList = (data as any)?.data?.items?.some(
    (u: { id: string }) => u.id == value
  );
  const { data: singleUserData } = useQuery({
    queryKey: ["singleUser", value],
    queryFn: () => (value ? AuthApi.getById(value) : null),
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
      mode={mode}
      showSearch
      placeholder={placeholder}
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
      notFoundContent={isLoading ? <Spin size="small" /> : "Không tìm thấy"}
    />
  );
};

export default UserSelect;

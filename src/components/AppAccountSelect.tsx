/* eslint-disable @typescript-eslint/no-explicit-any */
import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownApi } from "../apis/dropdown/dropdown";
import { debounce, uniqBy } from "lodash-es";

interface UserSelectProps {
  value?: any;
  onChange?: (value: any, user?: any) => void; // 👈 emit cả user
  placeholder?: string;
  mode?: "multiple" | "tags" | "";
  disabled?: boolean;
}

const AppAccountSelect: React.FC<UserSelectProps> = ({
  value,
  onChange,
  placeholder = "Choose",
  mode = "",
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");

  // Fetch danh sách user theo search
  const { data = [], isLoading } = useQuery({
    queryKey: ["appAccountOption", searchText],
    queryFn: async () => {
      const res: any = await DropdownApi.getAppAccounts(
        queryString.stringify({ page: 1, pageSize: 20, searchText })
      );
      return res?.data?.items || [];
    },
  });

  const valuesArray = Array.isArray(value) ? value : value ? [value] : [];
  const isDataInList = valuesArray.every((id) =>
    data.some((u: { id: string }) => u.id === id)
  );

  // Fetch user nếu đang chọn mà không có trong list hiện tại
  const { data: extraData } = useQuery({
    queryKey: ["singleAppAccount", valuesArray],
    queryFn: async () => {
      if (!valuesArray.length || isDataInList) return [];
      if (valuesArray.length === 1) {
        const res: any = await DropdownApi.getAppAccountById(valuesArray[0]);
        return res?.data ? [res.data] : [];
      } else {
        const res: any = await DropdownApi.getAppAccountByIds(
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

  // ✅ Khi chọn user, emit cả object user ra ngoài
  const handleChange = (userId: any) => {
    const selectedUser = mergedData.find((u: any) => u.id === userId);
    onChange?.(userId, selectedUser);
  };

  return (
    <Select
      disabled={disabled}
      mode={mode || undefined}
      showSearch
      placeholder={t(placeholder)}
      value={value || undefined}
      loading={isLoading}
      onSearch={onSearch}
      onChange={handleChange}
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

export default AppAccountSelect;

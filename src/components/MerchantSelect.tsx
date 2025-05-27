/* eslint-disable @typescript-eslint/no-explicit-any */

import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { DropdownApi } from "../apis/dropdown/dropdown";
import { useTranslation } from "react-i18next";
import { debounce, uniqBy } from "lodash-es";
interface MerchantSelectProps {
  value?: string;
  onChange?: (value: any, merchant: any) => void;
  placeholder?: string;
  mode?: "multiple" | "tags" | "";
  selected?: any;
}
const MerchantSelect: React.FC<MerchantSelectProps> = ({
  value,
  onChange,
  placeholder = "Please choose",
  mode = "",
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const { data = [], isLoading } = useQuery({
    queryKey: ["merchantOption", searchText],
    queryFn: async () => {
      const res: any = await DropdownApi.getMerchants(
        queryString.stringify({
          page: 1,
          pageSize: 50,
          searchText: searchText,
        })
      );
      return res?.data?.items || [];
    },
  });
  const valuesArray = Array.isArray(value) ? value : value ? [value] : [];
  const isDataInList = valuesArray.every((id) =>
    data.some((u: { id: string }) => u.id === id)
  );
  const { data: extraData } = useQuery({
    queryKey: ["singleMerchant", valuesArray],
    queryFn: async () => {
      if (!valuesArray.length || isDataInList) return [];
      if (valuesArray.length === 1) {
        const res: any = await DropdownApi.getMerchantById(valuesArray[0]);
        return res?.data ? [res.data] : [];
      } else {
        const res: any = await DropdownApi.getMerchantByIds(
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
  const handleChange = (selectedValue: any) => {
    const selectedMerchant = Array.isArray(selectedValue)
      ? mergedData.filter((item: any) => selectedValue.includes(item.id))
      : mergedData.find((item: any) => item.id === selectedValue);

    onChange?.(selectedValue, selectedMerchant);
  };
  useEffect(() => {
    if (!value) return;
    const selectedMerchant = Array.isArray(value)
      ? mergedData.filter((item: any) => value.includes(item.id))
      : mergedData.find((item: any) => item.id === value);

    if (selectedMerchant) {
      onChange?.(value, selectedMerchant);
    }
  }, [mergedData, value]);
  return (
    <Select
      mode={mode || undefined}
      showSearch
      placeholder={t(placeholder)}
      value={value || undefined}
      loading={isLoading}
      onSearch={onSearch}
      onChange={handleChange}
      filterOption={false}
      allowClear
      options={mergedData.map((item: any) => ({
        label: `${item.name} `,
        value: item.id,
      }))}
      notFoundContent={isLoading ? <Spin size="small" /> : t("No data")}
    />
  );
};

export default MerchantSelect;

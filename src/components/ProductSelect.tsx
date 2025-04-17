/* eslint-disable @typescript-eslint/no-explicit-any */

import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownApi } from "../apis/dropdown/dropdown";
import { debounce, uniqBy } from "lodash-es";
interface ProductSelectProps {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  mode?: "multiple" | "tags" | "";
}
const ProductSelect: React.FC<ProductSelectProps> = ({
  value,
  onChange,
  placeholder = "Choose",
  mode = "",
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const { data = [], isLoading } = useQuery({
    queryKey: ["productOption", searchText],
    queryFn: async () => {
      const res: any = await DropdownApi.getProducts(
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
    queryKey: ["singleProduct", valuesArray],
    queryFn: async () => {
      if (!valuesArray.length || isDataInList) return [];
      if (valuesArray.length === 1) {
        const res: any = await DropdownApi.getProductById(valuesArray[0]);
        return res?.data ? [res.data] : [];
      } else {
        const res: any = await DropdownApi.getProductByIds(
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
      value={value || null}
      loading={isLoading}
      onSearch={onSearch}
      onChange={onChange}
      filterOption={false}
      allowClear
      options={mergedData.map((product: any) => ({
        label: `${product.productName} - ${product.price?.toLocaleString()}`,
        value: product.id,
      }))}
      notFoundContent={isLoading ? <Spin size="small" /> : t("No data")}
    />
  );
};

export default ProductSelect;

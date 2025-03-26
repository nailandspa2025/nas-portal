/* eslint-disable @typescript-eslint/no-explicit-any */

import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import { useState } from "react";
import { ProductApi } from "../apis/catalog/product";
interface ProductSelectProps {
  value?: any;
  onChange?: (value: string) => void;
  placeholder?: string;
  mode?: any;
}
const ProductSelect: React.FC<ProductSelectProps> = ({
  value,
  onChange,
  placeholder = "Chọn",
  mode = "",
}) => {
  const [searchText, setSearchText] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["storeOption", searchText],
    queryFn: () =>
      ProductApi.getWithPagination(
        queryString.stringify({ page: 1, pageSize: 20, searchText: searchText })
      ),
  });
  const isUserInList = (data as any)?.data?.items?.some(
    (u: { id: number }) => u.id == value
  );
  const { data: singleUserData } = useQuery({
    queryKey: ["mutiProduct", value],
    queryFn: () => (value ? ProductApi.getById(value) : null),
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
      placeholder={placeholder}
      value={value || null}
      loading={isLoading}
      onSearch={onSearch}
      onChange={onChange}
      filterOption={false}
      allowClear
      options={mergedStore.map((product: any) => ({
        label: `${product.productName} - ${product.price?.toLocaleString()}`,
        value: product.id,
      }))}
      notFoundContent={isLoading ? <Spin size="small" /> : "Không tìm thấy"}
    />
  );
};

export default ProductSelect;

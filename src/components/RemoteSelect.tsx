/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Select, Spin } from "antd";
import { t } from "i18next";
import { debounce, uniqBy } from "lodash-es";
import queryString from "query-string";
import { useMemo, useState } from "react";

interface RemoteSelectProps {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  mode?: "multiple" | "tags" | "";
  fetchList: (qs: any) => Promise<any>;
  fetchById: (id: any) => Promise<any>;
  fetchByIds?: (ids: any) => Promise<any>;
  labelKey?: string | ((item: any) => string);
  valueKey?: string;
  pageSize?: number;
  params?: Record<string, any>;
  disabled?: boolean;
}

const RemoteSelect: React.FC<RemoteSelectProps> = ({
  value,
  onChange,
  placeholder = "Choose",
  mode = "",
  fetchList,
  fetchById,
  fetchByIds,
  labelKey = "name",
  valueKey = "id",
  pageSize = 20,
  params = {},
  disabled = false,
}) => {
  const [searchText, setSearchText] = useState("");

  // ✅ tạo stable key từ params
  const paramKey = JSON.stringify(params || {});

  // 🧠 Query danh sách
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["remoteSelectInfinite", fetchList.name, searchText, paramKey],
      queryFn: async ({ pageParam = 1 }) => {
        if (disabled) return { items: [], total: 0, page: pageParam };

        const query = queryString.stringify({
          page: pageParam,
          pageSize,
          searchText,
          ...params,
        });

        const res: any = await fetchList(query);
        return {
          items: res?.data?.items || [],
          total: res?.data?.total || 0,
          page: pageParam,
        };
      },
      getNextPageParam: (lastPage) => {
        const total = lastPage.total ?? 0;
        const loaded = lastPage.page * pageSize;
        return loaded < total ? lastPage.page + 1 : undefined;
      },
      enabled: !disabled, // không gọi nếu đang disable
      initialPageParam: 1,
    });

  // 🧠 xử lý danh sách dữ liệu
  const listData = useMemo(
    () => uniqBy(data?.pages.flatMap((p) => p.items) || [], valueKey),
    [data, valueKey]
  );

  // 🧠 lấy dữ liệu thêm nếu value không nằm trong list
  const valuesArray = Array.isArray(value) ? value : value ? [value] : [];
  const isDataInList = valuesArray.every((id) =>
    listData.some((u: any) => u[valueKey] === id)
  );

  const { data: extraData } = useQuery({
    queryKey: ["remoteSelectExtra", valuesArray],
    queryFn: async () => {
      if (!valuesArray.length || isDataInList) return [];
      if (valuesArray.length === 1) {
        const res: any = await fetchById(valuesArray[0]);
        return res?.data ? [res.data] : [];
      } else if (fetchByIds) {
        const res: any = await fetchByIds(valuesArray.join(","));
        return res?.data || [];
      }
      return [];
    },
    enabled: !!valuesArray.length && !isDataInList,
  });

  const mergedData = useMemo(
    () => uniqBy([...listData, ...(extraData || [])], valueKey),
    [listData, extraData, valueKey]
  );

  const onSearch = debounce((v: string) => setSearchText(v), 500);

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 20) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  return (
    <Select
      mode={mode || undefined}
      showSearch
      allowClear
      disabled={disabled}
      placeholder={placeholder}
      value={value || null}
      loading={isLoading}
      onSearch={onSearch}
      onChange={onChange}
      filterOption={false}
      onPopupScroll={handlePopupScroll}
      notFoundContent={isLoading ? <Spin size="small" /> : t("No data")}
      dropdownRender={(menu) => (
        <>
          {menu}
          {isFetchingNextPage && (
            <div style={{ textAlign: "center", padding: 8 }}>
              <Spin size="small" />
            </div>
          )}
        </>
      )}
      options={mergedData.map((item: any) => ({
        label:
          typeof labelKey === "function"
            ? labelKey(item)
            : item[labelKey as string],
        value: item[valueKey],
      }))}
    />
  );
};

export default RemoteSelect;

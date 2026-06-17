/* eslint-disable @typescript-eslint/no-explicit-any */
import useElementHeight from "../../utils/useElementHeight";
import { useRef, useState, useMemo } from "react";
import { Row, Card } from "antd";
import DataTable from "../../components/common/DataTable";
import * as utils from "../../utils/filter/commissions";
import FilterData from "../../components/common/FilterData";
import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CommissionApi } from "../../apis/order/commission";
const Users = () => {
  const { t } = useTranslation();
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [filteredColumns, setFilteredColumns] = useState();
  const { data } = useQuery({
    queryKey: ["commissionList", { pageNumber, pageSize, ...filters }],
    queryFn: async () => {
      const response: any = await CommissionApi.getWithPagination(
        queryString.stringify({ pageNumber, pageSize, ...filters }),
      );
      return response.data || [];
    },
    enabled: !!filters,
  });
  const handleFilterChange = (params: Record<string, string>) => {
    setFilters(params);
    setPageNumber(1);
  };

  const columns = useMemo(() => {
    return utils.columns({
      t,
    });
  }, [t]);

  return (
    <Card className="ant-custom-pagination">
      <div ref={divRef}>
        <Row style={{ marginBottom: "16px" }}>
          <FilterData
            filteredColumns={columns}
            onColumnChange={setFilteredColumns}
            onFilterChange={handleFilterChange}
            utils={utils}
          />
        </Row>
      </div>
      <DataTable
        current={pageNumber}
        columns={filteredColumns}
        dataSource={data?.items}
        total={data?.totalCount}
        pageSize={pageSize}
        heightTable={heightElement}
        onChange={(page, pageSize) => {
          setPageSize(pageSize);
          setPageNumber(page);
        }}
      />
    </Card>
  );
};

export default Users;

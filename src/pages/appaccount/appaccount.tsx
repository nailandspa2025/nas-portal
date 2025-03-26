/* eslint-disable @typescript-eslint/no-explicit-any */
import useElementHeight from "../../utils/useElementHeight";
import { useRef, useState } from "react";
import { Row, Card } from "antd";
import DataTable from "../../components/common/DataTable";
import * as utils from "../../utils/filter/appaccounts";
import FilterData from "../../components/common/FilterData";
import { AppAccountApi } from "../../apis/auth/appaccount";
import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Appaccounts = () => {
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const handleItemTable = {
    handleEdit: (record: any) => {
      navigate(`/appaccount/${record.id}`);
    },
  };
  const [filteredColumns, setFilteredColumns] = useState(
    utils.columns(handleItemTable)
  );
  const { data } = useQuery({
    queryKey: ["appAccountList", { pageNumber, pageSize, ...filters }],
    queryFn: async () => {
      const response: any = await AppAccountApi.getWithPagination(
        queryString.stringify({ pageNumber, pageSize, ...filters })
      );
      return response.data;
    },
    enabled: !!filters,
  });
  const handleFilterChange = (params: Record<string, string>) => {
    setFilters(params);
    setPageNumber(1);
  };
  const handleActions = {
    createNew: () => {
      navigate("/appaccount/none");
    },
  };
  return (
    <Card className="ant-custom-pagination">
      <div ref={divRef}>
        <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
          <FilterData
            onColumnChange={setFilteredColumns}
            onFilterChange={handleFilterChange}
            handlers={handleActions}
            utils={utils}
            handleItemTable={handleItemTable}
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
export default Appaccounts;

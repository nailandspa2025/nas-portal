/* eslint-disable @typescript-eslint/no-explicit-any */
import useElementHeight from "../../utils/useElementHeight";
import { useRef, useState } from "react";
import { Row, Card } from "antd";
import DataTable from "../../components/common/DataTable";
import * as utils from "../../utils/filter/users";
import FilterData from "../../components/common/FilterData";
import { AuthApi } from "../../apis/auth/auth";
import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Users = () => {
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filteredColumns, setFilteredColumns] = useState(utils.columns);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data } = useQuery({
    queryKey: ["userList", { pageNumber, pageSize, ...filters }],
    queryFn: async () => {
      const response: any = await AuthApi.getWithPagination(
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
      navigate("/users/none");
    },
    importExcel: () => {
      toast.success("Đang phát triển");
    },
    exportExcel: () => {
      toast.success("Đang phát triển");
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import useElementHeight from "../../utils/useElementHeight";
import { useRef, useState } from "react";
import { Row, Card } from "antd";
import DataTable from "../../components/common/DataTable";
import * as utils from "../../utils/filter/bookings";
import FilterData from "../../components/common/FilterData";
import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BookingApi } from "../../apis/booking/booking";

const Bookings = () => {
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
    queryKey: ["bookingList", { pageNumber, pageSize, ...filters }],
    queryFn: async () => {
      const response: any = await BookingApi.getWithPagination(
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
      navigate("/booking/none");
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
        <Row style={{ marginBottom: "16px" }}>
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
export default Bookings;

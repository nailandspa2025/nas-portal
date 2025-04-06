/* eslint-disable @typescript-eslint/no-explicit-any */
import useElementHeight from "../../utils/useElementHeight";
import { useMemo, useRef, useState } from "react";
import { Row, Card } from "antd";
import DataTable from "../../components/common/DataTable";
import * as utils from "../../utils/filter/bookings";
import FilterData from "../../components/common/FilterData";
import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BookingApi } from "../../apis/booking/booking";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import { useTranslation } from "react-i18next";
const Bookings = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredColumns, setFilteredColumns] = useState();
  const handleItemTable = {
    handleEdit: (record: any) => {
      navigate(`/appaccount/${record.id}`);
    },
    handleDelete: (record: any) => {
      console.log(record);
    },
  };
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

  const columns = useMemo(() => {
    return utils.columns({
      hasEditPermission: checkAccessRight(accesses, "update", "group"),
      hasDeletePermission: checkAccessRight(accesses, "delete", "group"),
      t,
      handleEdit: handleItemTable.handleEdit,
      handleDelete: handleItemTable.handleDelete,
    });
  }, [accesses]);
  return (
    <Card className="ant-custom-pagination">
      <div ref={divRef}>
        <Row style={{ marginBottom: "16px" }}>
          <FilterData
            filteredColumns={columns}
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
export default Bookings;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Row } from "antd";

import { TechnicianApi } from "../../apis/technician/technician";
import { useQuery, useMutation } from "@tanstack/react-query";
import queryString from "query-string";
import * as utils from "../../utils/filter/technicians";
import FilterData from "../../components/common/FilterData";
import DataTable from "../../components/common/DataTable";
import useElementHeight from "../../utils/useElementHeight";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalConfirm from "../../components/ModalConfirm";
const Technicians = () => {
  const navigate = useNavigate();

  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);

  const handleItemTable = {
    handleEdit: (record: any) => {
      navigate(`/technician/${record.id}`);
    },
    handleDelete: (record: any) => {
      setRowId(record.id);
      setOpenModal(true);
    },
  };
  const [filteredColumns, setFilteredColumns] = useState(
    utils.columns(handleItemTable)
  );
  const { data } = useQuery({
    queryKey: ["technicianList", { pageNumber, pageSize, ...filters }],
    queryFn: async () => {
      const response: any = await TechnicianApi.getWithPagination(
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
      navigate("/technician/none");
    },
    importExcel: () => {
      toast.success("Đang phát triển");
    },
    exportExcel: () => {
      toast.success("Đang phát triển");
    },
  };
  const mutationDelete = useMutation({
    mutationFn: async (id: number) => {
      TechnicianApi.delete(id);
    },
    onSuccess: () => {
      setRowId(0);
      setOpenModal(false);
      toast.success("Xóa sản phẩm thành công!");
    },
    onError: (error) => {
      setRowId(0);
      setOpenModal(false);
      toast.error(`Lỗi: ${error.message}`);
    },
  });
  const confirmDelete = (id: number) => {
    mutationDelete.mutate(id);
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
      <ModalConfirm
        openModal={openModal}
        setOpenModal={setOpenModal}
        onChange={() => confirmDelete(rowId)}
      />
    </Card>
  );
};
export default Technicians;

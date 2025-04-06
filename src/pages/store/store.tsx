/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Row } from "antd";

import { StoreApi } from "../../apis/catalog/store";
import { useQuery, useMutation } from "@tanstack/react-query";
import queryString from "query-string";
import * as utils from "../../utils/filter/stores";
import FilterData from "../../components/common/FilterData";
import DataTable from "../../components/common/DataTable";
import useElementHeight from "../../utils/useElementHeight";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalConfirm from "../../components/ModalConfirm";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";

const Stores = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [filteredColumns, setFilteredColumns] = useState();
  const handleItemTable = {
    handleEdit: (record: any) => {
      navigate(`/store/${record.id}`);
    },
    handleDelete: (record: any) => {
      setRowId(record.id);
      setOpenModal(true);
    },
  };

  const { data } = useQuery({
    queryKey: ["storeList", { pageNumber, pageSize, ...filters }],
    queryFn: async () => {
      const response: any = await StoreApi.getWithPagination(
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
      navigate("/store/none");
    },
  };
  const mutationDelete = useMutation({
    mutationFn: async (id: number) => {
      StoreApi.delete(id);
    },
    onSuccess: () => {
      setRowId(0);
      setOpenModal(false);
      toast.success(t("Deleted successfully!"));
    },
    onError: (error) => {
      setRowId(0);
      setOpenModal(false);
      toast.error(t(error.message));
    },
  });
  const confirmDelete = (id: number) => {
    mutationDelete.mutate(id);
  };

  const columns = useMemo(() => {
    return utils.columns({
      hasEditPermission: checkAccessRight(accesses, "update", "store"),
      hasDeletePermission: checkAccessRight(accesses, "delete", "store"),
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
            onColumnChange={setFilteredColumns}
            onFilterChange={handleFilterChange}
            handlers={handleActions}
            utils={utils}
            filteredColumns={columns}
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
export default Stores;

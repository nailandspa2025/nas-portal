/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Row } from "antd";
import { useMemo, useRef, useState } from "react";
import useElementHeight from "../../../utils/useElementHeight";
import DataTable from "../../../components/common/DataTable";
import queryString from "query-string";
import { EarningApi } from "../../../apis/loyalty/earning";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import * as utils from "../../../utils/filter/earning.general";
import { checkAccessRight } from "../../../utils/common/accessUtils";
import FilterData from "../../../components/common/FilterData";
import ModalConfirm from "../../../components/ModalConfirm";
import { toast } from "react-toastify";
import EarningAction from "./EarningAction";

const EarningGeneral = ({ programId }: { programId: any }) => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredColumns, setFilteredColumns] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const handleFilterChange = (params: Record<string, string>) => {
    setFilters(params);
    setPageNumber(1);
  };
  const { data, refetch } = useQuery({
    queryKey: ["earingList", { programId, pageNumber, pageSize, ...filters }],
    queryFn: async () => {
      const response: any = await EarningApi.getWithPagination(
        queryString.stringify({ programId, pageNumber, pageSize, ...filters })
      );
      return response.data;
    },
    enabled: !!filters,
  });
  const detele = useMutation({
    mutationFn: async (id: any) => {
      return EarningApi.delete(id);
    },
    onSuccess: (res: any) => {
      setRowId(null);
      setOpenModal(false);
      if (res.succeeded) {
        refetch();
        toast.success(t("Delete successfully!"));
      } else {
        toast.error(t(res.message));
      }
    },
    onError: (error) => {
      setRowId(null);
      setOpenModal(false);
      toast.error(t(error.message));
    },
  });
  const confirmDelete = (id: any) => {
    detele.mutate(id);
  };

  const handleActions = {
    createNew: () => {
      setFormData({});
      setShowForm(true);
    },
  };
  const handleItemTable = {
    handleEdit: (record: any) => {
      setFormData(record);
      setShowForm(true);
    },
    handleDelete: (record: any) => {
      setRowId(record.id);
      setOpenModal(true);
    },
  };
  const handleSave = () => {
    setShowForm(false);
    setFormData({});
    refetch();
  };
  const columns = useMemo(() => {
    return utils.columns({
      hasEditPermission: checkAccessRight(accesses, "update", "loyalty-point"),
      hasDeletePermission: checkAccessRight(
        accesses,
        "delete",
        "loyalty-point"
      ),
      t,
      handleEdit: handleItemTable.handleEdit,
      handleDelete: handleItemTable.handleDelete,
    });
  }, [accesses]);
  return (
    <>
      {!showForm ? (
        <>
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
            <ModalConfirm
              openModal={openModal}
              setOpenModal={setOpenModal}
              onChange={() => confirmDelete(rowId)}
            />
          </Card>
        </>
      ) : (
        <>
          <EarningAction
            programId={programId}
            item={formData}
            onChange={handleSave}
          />
        </>
      )}
    </>
  );
};

export default EarningGeneral;

/* eslint-disable @typescript-eslint/no-explicit-any */
import useElementHeight from "../../utils/useElementHeight";
import { useMemo, useRef, useState } from "react";
import { Row, Card } from "antd";
import DataTable from "../../components/common/DataTable";
import * as utils from "../../utils/filter/booking.cancel.reasons";
import FilterData from "../../components/common/FilterData";
import queryString from "query-string";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import { useTranslation } from "react-i18next";
import ModalConfirm from "../../components/ModalConfirm";
import ModalFormReason from "../../components/ModalFormReason";
import { buildFormData } from "../../utils/common/buildFormData";
import { BookingCancelReasonApi } from "../../apis/order/booking.cancel.reason";
const Bookings = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();

  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredColumns, setFilteredColumns] = useState();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [openModalForm, setOpenModalForm] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<object>({});

  const handleActions = {
    createNew: () => {
      setOpenModalForm(true);
    },
  };
  const handleItemTable = {
    handleEdit: (record: any) => {
      setOpenModalForm(true);
      setDataDetail(record);
    },
    handleDelete: (record: any) => {
      setRowId(record.id);
      setOpenModal(true);
    },
  };
  const { data, refetch } = useQuery({
    queryKey: ["bookingCancelReasonList", { pageNumber, pageSize, ...filters }],
    queryFn: async () => {
      const response: any = await BookingCancelReasonApi.getWithPagination(
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

  const mutationDelete = useMutation({
    mutationFn: async (id: number) => {
      return BookingCancelReasonApi.delete(id);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        refetch();
        toast.success(t("Delete successfully!"));
      } else {
        toast.error(t(res.message));
      }
      setRowId(0);
      setOpenModal(false);
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
  const mutationForm = useMutation({
    mutationFn: async (values: any) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return values.id
        ? await BookingCancelReasonApi.update(values.id, formD)
        : await BookingCancelReasonApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success("Save successfully");
        refetch();
      } else toast.error(t(res.message));
      setOpenModalForm(false);
    },
    onError: () => {
      toast.error(t("An error occurred"));
      setOpenModalForm(false);
    },
  });

  const handleSubmit = async (values: any) => {
    mutationForm.mutate(values);
  };
  const columns = useMemo(() => {
    return utils.columns({
      hasEditPermission: checkAccessRight(accesses, "update", "config-reason"),
      hasDeletePermission: checkAccessRight(
        accesses,
        "delete",
        "config-reason"
      ),

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
      <ModalConfirm
        openModal={openModal}
        setOpenModal={setOpenModal}
        onChange={() => confirmDelete(rowId)}
      />
      <ModalFormReason
        title={rowId ? "Edit reason" : "Create reason"}
        openModal={openModalForm}
        setOpenModal={setOpenModalForm}
        onSubmit={handleSubmit}
        data={dataDetail}
      />
    </Card>
  );
};
export default Bookings;

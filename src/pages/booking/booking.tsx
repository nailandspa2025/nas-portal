/* eslint-disable @typescript-eslint/no-explicit-any */
import useElementHeight from "../../utils/useElementHeight";
import { useMemo, useRef, useState } from "react";
import { Row, Card } from "antd";
import DataTable from "../../components/common/DataTable";
import * as utils from "../../utils/filter/bookings";
import FilterData from "../../components/common/FilterData";
import queryString from "query-string";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BookingApi } from "../../apis/order/booking";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import { useTranslation } from "react-i18next";
import ModalConfirm from "../../components/ModalConfirm";
import ModalPayment from "../../components/ModalPayment";
import { buildFormData } from "../../utils/common/buildFormData";
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
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<number>(0);
  const [actionType, setActionType] = useState<"delete" | "cancel" | null>(
    null
  );
  const [openModalPayment, setOpenModalPayment] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<object>({});
  const handleItemTable = {
    handleEdit: (record: any) => {
      navigate(`/booking/${record.id}`);
    },
    handleDelete: (record: any) => {
      setRowId(record.id);
      setActionType("delete");
      setOpenModal(true);
    },
    handleCancel: (record: any) => {
      setRowId(record.id);
      setActionType("cancel");
      setOpenModal(true);
    },
    handlePayment: (record: any) => {
      setOpenModalPayment(true);
      setPaymentData(record);
    },
  };
  const { data, refetch } = useQuery({
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
  const mutationDelete = useMutation({
    mutationFn: async (id: number) => {
      return BookingApi.delete(id);
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
  const mutationCancel = useMutation({
    mutationFn: async (id: number) => {
      return BookingApi.cancel(id);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        refetch();
        toast.success(t("Cancel successfully!"));
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
  const onConfirm = (id: any, type: any) => {
    if (type === "delete") mutationDelete.mutate(id);
    else if (type == "cancel") mutationCancel.mutate(id);
  };
  const mutationPayment = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return await BookingApi.payment(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success("Save successfully");
        refetch();
      } else toast.error(t(res.message));
      setOpenModalPayment(false);
    },
    onError: () => {
      toast.error(t("An error occurred"));
      setOpenModalPayment(false);
    },
  });
  const handlePaymentSubmit = async (values: any) => {
    mutationPayment.mutate(values);
  };
  const columns = useMemo(() => {
    return utils.columns({
      hasEditPermission: checkAccessRight(accesses, "update", "booking"),
      hasDeletePermission: checkAccessRight(accesses, "delete", "booking"),
      hasPaymentPermission: checkAccessRight(accesses, "payment", "booking"),
      t,
      handleEdit: handleItemTable.handleEdit,
      handleDelete: handleItemTable.handleDelete,
      handleCancel: handleItemTable.handleCancel,
      handlePayment: handleItemTable.handlePayment,
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
        title={actionType == "delete" ? "Delete" : "Cancel"}
        content={
          actionType == "delete"
            ? "Are you sure you want to delete the data?"
            : "Are you sure you want to update the data?"
        }
        openModal={openModal}
        setOpenModal={setOpenModal}
        onChange={() => onConfirm(rowId, actionType)}
      />

      <ModalPayment
        data={paymentData}
        openModal={openModalPayment}
        setOpenModal={setOpenModalPayment}
        onSubmit={handlePaymentSubmit}
      />
    </Card>
  );
};
export default Bookings;

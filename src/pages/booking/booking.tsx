/* eslint-disable @typescript-eslint/no-explicit-any */
import useElementHeight from "../../utils/useElementHeight";
import { useMemo, useRef, useState } from "react";
import { Row, Card, Modal, Button } from "antd";
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
import ModalCancelBooking from "../../components/ModalCancelBooking";
import { QRCodeCanvas } from "qrcode.react";
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
  const [openModalPayment, setOpenModalPayment] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<object>({});
  const [openModalCancel, setOpenModalCancel] = useState<boolean>(false);
  const [qrModal, setQrModal] = useState<boolean>(false);
  const [approveUrl, setApproveUrl] = useState<any>(null);
  const handleItemTable = {
    handleEdit: (record: any) => {
      navigate(`/booking/${record.id}`);
    },
    handleDelete: (record: any) => {
      setRowId(record.id);
      setOpenModal(true);
    },
    handleCancel: (record: any) => {
      setRowId(record.id);
      setOpenModalCancel(true);
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
    mutationFn: async (values: any) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return BookingApi.cancel(rowId, formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        refetch();
        toast.success(t("Cancel successfully!"));
      } else {
        toast.error(t(res.message));
      }
      setRowId(0);
      setOpenModalCancel(false);
    },
    onError: (error) => {
      setRowId(0);
      setOpenModalCancel(false);
      toast.error(t(error.message));
    },
  });
  const onConfirmDelate = (id: number) => {
    mutationDelete.mutate(id);
  };
  const mutationPayment = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return await BookingApi.payment(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        const approveUrl = res.data?.approveUrl;
        if (approveUrl) {
          setApproveUrl(approveUrl);
          setQrModal(true);
          //window.location.href = approveUrl;
        }
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
    const payload = {
      ...values,
      returnUrl: window.location.origin + "/payment/success",
      cancelUrl: window.location.origin + "/payment/failed",
    };
    mutationPayment.mutate(payload);
  };
  const handleCancelSubmit = (values: any) => {
    const payload = {
      ...values,
      id: rowId,
    };
    mutationCancel.mutate(payload);
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
        openModal={openModal}
        setOpenModal={setOpenModal}
        onChange={() => onConfirmDelate(rowId)}
      />

      <ModalPayment
        data={paymentData}
        openModal={openModalPayment}
        setOpenModal={setOpenModalPayment}
        onSubmit={handlePaymentSubmit}
      />
      <ModalCancelBooking
        openModal={openModalCancel}
        setOpenModal={setOpenModalCancel}
        onSubmit={handleCancelSubmit}
      />
      <Modal
        title={<span className="font-semibold text-lg">💳 Scan QR to pay</span>}
        open={qrModal}
        onCancel={() => setQrModal(false)}
        footer={[
          <Button
            key="cancel"
            type="primary"
            danger
            onClick={() => setQrModal(false)}
          >
            {t("Cancel")}
          </Button>,
        ]}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <QRCodeCanvas value={approveUrl || ""} size={220} />
          <p style={{ marginTop: 16, fontSize: 14, color: "#555" }}>
            Use your banking app or e-wallet to scan the code
          </p>

          <a
            href={approveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", marginTop: 12, color: "#1677ff" }}
          >
            👉 Open payment link
          </a>
        </div>
      </Modal>
    </Card>
  );
};
export default Bookings;

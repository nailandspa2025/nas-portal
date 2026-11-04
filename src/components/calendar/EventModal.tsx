/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  TimePicker,
  Row,
  Col,
} from "antd";
import type { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import StoreSelect from "../StoreSelect";
import AppAccountSelect from "../AppAccountSelect";
import dayjs from "dayjs";
import {
  DeleteOutlined,
  BankOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import BookingCustomersEditor from "../../components/booking/BookingCustomersEditor";
import {
  bookingCustomersRule,
  toBookingPayload,
  toFormCustomers,
} from "../../components/booking/bookingCustomers";
import { BookingApi } from "../../apis/order/booking";
import { useQuery } from "@tanstack/react-query";
import { canCancelBooking, canPayBooking, isBookingLocked } from "../../utils/common/bookingStatus";

const SECTION_TITLE_STYLE = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: "uppercase" as const,
  opacity: 0.65,
  marginBottom: 8,
};
export interface EventData {
  title: string;
  start: Dayjs;
  calendarType: string;
}

interface EventModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  eventData?: any;
  setEventData: (data: any) => void;
  loading?: boolean;
  onSubmit?: (values: any) => void;
  handleDelete?: (values: any) => void;
  handlePayment?: (values: any) => void;
  handleCancel?: (values: any) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  open = false,
  setOpen,
  eventData,
  loading = false,
  onSubmit = () => {},
  handleDelete = () => {},
  handlePayment = () => {},
  handleCancel = () => {},
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const storeId = Form.useWatch("storeId", form);
  const bookingId = eventData?.originalId;

  // Event trên lịch chỉ có technicianIds/serviceIds phẳng -> lấy chi tiết để có dịch vụ theo từng thợ.
  const { data: bookingDetail } = useQuery({
    queryKey: ["bookingDetail", bookingId],
    queryFn: async () => {
      const res: any = await BookingApi.getById(bookingId);
      return res?.data ?? null;
    },
    enabled: open && !!bookingId,
  });
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        fullName: eventData.fullName || "",
        phone: eventData.phone || "",
        email: eventData.email || "",
        address: eventData.address || "",
        gender: eventData.gender ?? null,
        userId: eventData.userId ? Number(eventData.userId) : null,
        storeId: eventData.storeId || null,
        productId: eventData.productId || null,
        note: eventData.note || null,
        technicians: [],
        bookingDate: eventData.bookingDate
          ? dayjs(eventData.bookingDate, "YYYY-MM-DD")
          : null,
        bookingTime: eventData.bookingTime
          ? dayjs(eventData.bookingTime, "HH:mm:ss")
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [eventData, open, form]);
  useEffect(() => {
    if (open && bookingDetail) {
      form.setFieldValue("technicians", toFormCustomers(bookingDetail.technicians));
    }
  }, [bookingDetail, open, form]);
  const onFinish = (values: any) => {
    const payload = {
      ...toBookingPayload(values),
      ...(eventData?.originalId && { id: eventData.originalId }),
    };

    onSubmit(payload);
  };
  const handleUserChange = async (value: any, option: any) => {
    if (!value) return;
    const user = option || {};
    form.setFieldsValue({
      fullName: user.fullName || "",
      phone: user.phone || "",
      email: user.email || "",
      gender: user.gender || undefined,
      address: user.address || "",
    });
  };
  return (
    <Modal
      title={t("Calendar")}
      open={open}
      onCancel={() => setOpen(false)}
      width={1100}
      footer={[
        <Button
          key="cancel"
          type="primary"
          danger
          onClick={() => setOpen(false)}
        >
          {t("Cancel")}
        </Button>,
        !isBookingLocked(eventData?.status) && (
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            {t("Save")}
          </Button>
        ),
      ]}
    >
      {eventData?.originalId && (
        <div
          style={{
            position: "absolute",
            top: 13,
            right: 50,
            display: "flex",
            gap: "4px",
          }}
        >
          {canPayBooking(eventData?.status) && (
            <Button
              icon={<BankOutlined />}
              type="text"
              style={{ color: "#1890ff" }}
              onClick={() => {
                handlePayment(eventData);
              }}
            />
          )}
          {canCancelBooking(eventData?.status) && (
            <Button
              icon={<CloseCircleOutlined />}
              type="text"
              style={{ color: "red" }}
              onClick={() => {
                handleCancel(eventData);
              }}
            />
          )}
          {eventData?.status === 3 && (
            <Button
              icon={<DeleteOutlined />}
              type="text"
              danger
              onClick={() => {
                handleDelete(eventData);
              }}
            />
          )}
        </div>
      )}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <div style={SECTION_TITLE_STYLE}>{t("Booking information")}</div>
            <Form.Item
              label={t("Store")}
              name="storeId"
              rules={[{ required: true, message: t("Please choose store!") }]}
            >
              <StoreSelect
                placeholder={t("Choose store")}
                onChange={() => {
                  form.setFieldsValue({ technicians: [] });
                }}
              />
            </Form.Item>
            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="bookingDate"
                  label={t("Appointment date")}
                  rules={[{ required: true, message: t("Please choose date!") }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder={t("Choose date")}
                    format="DD/MM/YYYY"
                    // disabled={!!eventData?.originalId}
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf("day");
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="bookingTime"
                  label={t("Appointment time")}
                  rules={[{ required: true, message: t("Please choose time!") }]}
                >
                  <TimePicker
                    format="hh:mm A"
                    style={{ width: "100%" }}
                    minuteStep={5}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div style={SECTION_TITLE_STYLE}>{t("Booker")}</div>
            <Form.Item
              name="userId"
              label={t("User mobile")}
              rules={[{ required: true, message: t("Please choose user!") }]}
            >
              <AppAccountSelect
                placeholder={t("Please choose user")}
                onChange={handleUserChange}
              />
            </Form.Item>
            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item name="fullName" label={t("Full name")}>
                  <Input placeholder={t("Enter full name")} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="phone" label={t("Phone")}>
                  <Input placeholder={t("Enter phone")} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ type: "email", message: t("Invalid email") }]}
                >
                  <Input placeholder="Enter email" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="gender" label={t("Gender")}>
                  <Select
                    style={{ width: "100%" }}
                    showSearch
                    placeholder={t("Choose gender")}
                    allowClear
                  >
                    <Select.Option value={1}>{t("Male")}</Select.Option>
                    <Select.Option value={2}>{t("Female")}</Select.Option>
                    <Select.Option value={3}>{t("Other")}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="address" label={t("Address")}>
              <Input placeholder={t("Enter address")} />
            </Form.Item>
            <Form.Item label={t("Note")} name={"note"}>
              <Input.TextArea
                rows={3}
                placeholder={t("Enter note")}
              ></Input.TextArea>
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="technicians" rules={[bookingCustomersRule(t)]}>
              <BookingCustomersEditor
                storeId={storeId}
                disabled={isBookingLocked(eventData?.status)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EventModal;

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  TimePicker,
  InputNumber,
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
import { DropdownApi } from "../../apis/dropdown/dropdown";
import RemoteSelect from "../../components/RemoteSelect";
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
        number: eventData.number ?? null,
        note: eventData.note || null,
        serviceIds: eventData.serviceIds || null,
        technicianIds: eventData.technicianIds || null,
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
  const onFinish = (values: any) => {
    const payload = {
      ...values,
      bookingDate: dayjs(values.bookingDate).format("YYYY-MM-DD") ?? null,
      bookingTime: dayjs(values.bookingTime).format("HH:mm:ss") ?? null,
    };
    if (eventData?.originalId) payload.id = eventData.originalId;

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
      width={900}
      footer={[
        <Button
          key="cancel"
          type="primary"
          danger
          onClick={() => setOpen(false)}
        >
          {t("Cancel")}
        </Button>,
        eventData?.status === 1 && (
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
          {eventData?.status === 1 && (
            <>
              <Button
                icon={<BankOutlined />}
                type="text"
                style={{ color: "#1890ff" }}
                onClick={() => {
                  handlePayment(eventData);
                }}
              />
              <Button
                icon={<CloseCircleOutlined />}
                type="text"
                style={{ color: "red" }}
                onClick={() => {
                  handleCancel(eventData);
                }}
              />
            </>
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
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
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
            <Form.Item name="fullName" label={t("Full name")}>
              <Input placeholder={t("Enter full name")} />
            </Form.Item>
            <Form.Item name="address" label={t("Address")}>
              <Input placeholder={t("Enter address")} />
            </Form.Item>
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
            <Form.Item name="phone" label={t("Phone")}>
              <Input placeholder={t("Enter phone")} />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: "email", message: t("Invalid email") }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={t("Store")}
              name="storeId"
              rules={[{ required: true, message: t("Please choose store!") }]}
            >
              <StoreSelect
                placeholder={t("Choose store")}
                onChange={() => {
                  form.setFieldsValue({ technicianIds: [] });
                }}
              />
            </Form.Item>

            <Form.Item
              label={t("Technician")}
              name="technicianIds"
              rules={[
                { required: true, message: t("Please choose technician!") },
              ]}
            >
              <RemoteSelect
                placeholder={t("Select technician")}
                mode="multiple"
                fetchList={DropdownApi.getTechnicians}
                fetchById={DropdownApi.getTechnicianById}
                fetchByIds={DropdownApi.getTechnicianByIds}
                labelKey={(item) => `${item.technicianName} - ${item.phone}`}
                valueKey="id"
                params={{ storeId }}
                disabled={!storeId}
              />
            </Form.Item>

            <Form.Item
              name="number"
              label={t("Number")}
              rules={[{ required: true, message: t("Please enter number") }]}
            >
              <InputNumber
                placeholder={t("Enter number")}
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </Form.Item>
            <Form.Item name="serviceIds" label={t("Service")}>
              <RemoteSelect
                placeholder={t("Select service name")}
                fetchList={DropdownApi.getServices}
                fetchById={DropdownApi.getServiceById}
                fetchByIds={DropdownApi.getServiceByIds}
                mode="multiple"
                labelKey={(item) => `${item.name}`}
                valueKey="id"
              />
            </Form.Item>
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
            <Form.Item
              name="bookingTime"
              label={t("Appointment time")}
              rules={[{ required: true, message: t("Please choose time!") }]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={t("Note")} name={"note"}>
              <Input.TextArea
                rows={3}
                placeholder={t("Enter note")}
              ></Input.TextArea>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EventModal;

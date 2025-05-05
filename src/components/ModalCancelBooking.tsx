/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { BookingCancelReasonApi } from "../apis/order/booking.cancel.reason";
interface ModalCancelBookingProps {
  title?: string;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  loading?: boolean;
  onSubmit?: (values: any) => void;
}

const ModalCancelBooking: React.FC<ModalCancelBookingProps> = ({
  title = "Cancel booking",
  openModal = false,
  setOpenModal,
  loading = false,
  onSubmit = () => {},
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { data } = useQuery({
    queryKey: ["getAllReason"],
    queryFn: async () => {
      const response: any = await BookingCancelReasonApi.getAll();
      return response.data;
    },
  });
  console.log("data", data);
  useEffect(() => {
    if (!openModal) {
      form.resetFields();
    }
  }, [openModal]);
  const onFinish = (values: any) => {
    onSubmit(values);
  };
  return (
    <Modal
      title={t(title)}
      open={openModal}
      onCancel={() => setOpenModal(false)}
      footer={[
        <Button
          key="cancel"
          type="primary"
          danger
          onClick={() => setOpenModal(false)}
        >
          {t("Cancel")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          {t("Agree")}
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row>
          <Col span={24}>
            <Form.Item
              label={t("Select booking reason")}
              name={"reasonId"}
              rules={[{ required: true, message: t("Please choose reason!") }]}
            >
              <Select
                showSearch
                allowClear
                placeholder={t("Choose reason")}
                options={data?.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))}
                filterOption={(input, option) =>
                  String(option?.label)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item label={t("Other reasons")} name={"reason"}>
              <Input.TextArea rows={5} placeholder={t("Enter other reason")} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalCancelBooking;

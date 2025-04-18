/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import { useTranslation } from "react-i18next";
import { validatePhoneNumber } from "../utils/common/validate";
const PaymentMethod = [
  {
    label: "Cash",
    value: 1,
  },
  {
    label: "BankTransfer",
    value: 5,
  },
  {
    label: "CreditCard",
    value: 2,
  },
  {
    label: "Momo",
    value: 3,
  },
  {
    label: "Zalopay",
    value: 4,
  },

  {
    label: "MoMo",
    value: 6,
  },
  {
    label: "VNPay",
    value: 7,
  },
];

interface ModalPaymentProps {
  data?: any;
  title?: string;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  loading?: boolean;
  onSubmit?: (values: any) => void;
}

const ModalPayment: React.FC<ModalPaymentProps> = ({
  title = "Payment",
  openModal = false,
  setOpenModal,
  loading = false,
  onSubmit = () => {},
  data = {},
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [selectedMethod, setSelectedMethod] = React.useState<number | null>(
    null
  );

  useEffect(() => {
    form.setFieldsValue({
      fullName: data.fullName || "",
      emial: data?.email || "",
      phone: data?.phone || "",
    });
    if (!openModal) {
      form.resetFields();
      setSelectedMethod(null);
    }
  }, [data, openModal]);
  const onFinish = (values: any) => {
    const payload = {
      ...values,
      bookingId: data.id,
    };
    onSubmit(payload);
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
              label={t("Amount")}
              name={"amount"}
              rules={[{ required: true, message: t("Please enter amount!") }]}
            >
              <InputNumber
                placeholder={t("Enter amount")}
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </Form.Item>
            <Form.Item
              label={t("Pament method")}
              name={"method"}
              rules={[{ required: true, message: t("Please choose method!") }]}
            >
              <Select
                style={{ width: "100%" }}
                showSearch
                allowClear
                placeholder={t("Choose method")}
                options={PaymentMethod}
                onChange={(value) => setSelectedMethod(value)}
              ></Select>
            </Form.Item>
            {selectedMethod === 5 && (
              <div
                style={{
                  border: "1px solid #f0f0f0",
                  borderRadius: 8,
                  textAlign: "center",
                  marginBottom: 10,
                  backgroundColor: "#fafafa",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h3 style={{ marginBottom: 5, color: "#1890ff" }}>
                  {t("Bank Transfer Info")}
                </h3>
                <div>
                  <strong>{t("Bank")}:</strong> Vietcombank
                </div>
                <div>
                  <strong>{t("Account Name")}:</strong> Nguyen Van A
                </div>
                <div>
                  <strong>{t("Account Number")}:</strong> 0123456789
                </div>
                <img
                  src="/images/qr-code.jpeg"
                  alt="QR code"
                  style={{ width: 200, height: 200 }}
                />
                <div style={{ fontStyle: "italic", color: "#888" }}>
                  {t("Scan QR code to pay")}
                </div>
              </div>
            )}
            <Form.Item label={t("FullName")} name={"fullName"}>
              <Input placeholder={t("Enter fullName")} />
            </Form.Item>
            <Form.Item
              label={t("Email")}
              name={"email"}
              rules={[
                {
                  type: "email",
                  message: t("Invalid email"),
                },
              ]}
            >
              <Input placeholder={t("Enter email")} />
            </Form.Item>
            <Form.Item
              label={t("Phone")}
              name={"phone"}
              rules={[
                {
                  validator: validatePhoneNumber,
                },
              ]}
            >
              <Input placeholder={t("Enter phone")} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalPayment;

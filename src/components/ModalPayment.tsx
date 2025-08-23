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
import { BankAccountApi } from "../apis/catalog/bank";
import queryString from "query-string";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";

const PaymentMethod = [
  {
    label: "Cash",
    value: 1,
  },
  {
    label: "BankTransfer",
    value: 5,
  },
  // {
  //   label: "CreditCard",
  //   value: 2,
  // },
  // {
  //   label: "Momo",
  //   value: 3,
  // },
  // {
  //   label: "Zalopay",
  //   value: 4,
  // },

  // {
  //   label: "MoMo",
  //   value: 6,
  // },
  // {
  //   label: "VNPay",
  //   value: 7,
  // },
  {
    label: "PayPal",
    value: 8,
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
    if (openModal) {
      form.setFieldsValue({
        fullName: data.fullName || "",
        email: data?.email || "",
        phone: data?.phone || "",
      });
      setSelectedMethod(data.method || null);
    } else {
      form.resetFields();
      setSelectedMethod(null);
    }
  }, [data, openModal]);
  const { data: bankData } = useQuery({
    queryKey: ["getBankByStore", { storeId: data.storeId }],
    queryFn: async () => {
      const response: any = await BankAccountApi.getBankByStore(
        queryString.stringify({ storeId: data.storeId })
      );
      return response.data;
    },
    enabled: !!data.storeId,
  });
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
            {selectedMethod === 5 && bankData?.length > 0 && (
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 12,
                  backgroundColor: "#fafafa",
                  padding: 16,
                  marginTop: 12,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h3
                  style={{
                    textAlign: "center",
                    marginBottom: 20,
                    color: "#1890ff",
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  {t("Bank Transfer Info")}
                </h3>

                {bankData.map((bank: any, index: number) => {
                  const qrContent = `
                    Bank: ${bank.bankName}
                    Account Name: ${bank.accountName}
                    Account Number: ${bank.accountNumber}
                    Branch: ${bank.branchName}
                  `.trim();

                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 16,
                        borderRadius: 10,
                        border: "1px solid #f0f0f0",
                        marginBottom: 16,
                        backgroundColor: "#fff",
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: 20 }}>
                        <div style={{ marginBottom: 6 }}>
                          <strong>{t("Bank")}:</strong> {bank.bankName}
                        </div>
                        <div style={{ marginBottom: 6 }}>
                          <strong>{t("Account Name")}:</strong>{" "}
                          {bank.accountName}
                        </div>
                        <div style={{ marginBottom: 6 }}>
                          <strong>{t("Account Number")}:</strong>{" "}
                          {bank.accountNumber}
                        </div>
                        <div>
                          <strong>{t("Branch Name")}:</strong> {bank.branchName}
                        </div>
                      </div>

                      <div style={{ textAlign: "center" }}>
                        <QRCodeSVG value={qrContent} size={150} />
                        <div
                          style={{
                            fontStyle: "italic",
                            color: "#888",
                            marginTop: 8,
                            fontSize: 12,
                          }}
                        >
                          {t("Scan QR code to pay")}
                        </div>
                      </div>
                    </div>
                  );
                })}
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

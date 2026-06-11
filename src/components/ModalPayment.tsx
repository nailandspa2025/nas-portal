/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Card,
  Divider,
  Typography,
  Radio,
  Descriptions,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { validatePhoneNumber } from "../utils/common/validate";
import { BankAccountApi } from "../apis/catalog/bank";
import { useQuery } from "@tanstack/react-query";
//import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-toastify";
const { Text } = Typography;
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
    null,
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
  const serviceAmount = useMemo(() => {
    if (!data?.technicians?.length) return 0;

    return data.technicians.reduce(
      (total: any, technician: { services: any[] }) => {
        const serviceTotal = technician.services.reduce(
          (sum: number, service: { priceTo: any }) =>
            sum + Number(service.priceTo || 0),
          0,
        );
        return total + serviceTotal;
      },
      0,
    );
  }, [data?.technicians]);
  const discountAmount = Form.useWatch("discountAmount", form) || 0;
  const surchargeAmount = Form.useWatch("surchargeAmount", form) || 0;
  const customerPaid = Form.useWatch("customerPaid", form) || 0;
  const finalAmount = Math.max(
    serviceAmount - discountAmount + surchargeAmount,
    0,
  );
  const changeAmount = Math.max(customerPaid - finalAmount, 0);
  const amount = Math.max(finalAmount - customerPaid, 0);
  const { data: paymentProviders } = useQuery({
    queryKey: ["getPaymentProviders", { storeId: data.storeId }],
    queryFn: async () => {
      const response: any = await BankAccountApi.getPaymentProviders(
        data.storeId,
      );
      return response.data;
    },
    enabled: !!data.storeId,
  });
  const onFinish = (values: any) => {
    const payload = {
      ...values,
      bookingId: data.id,
      serviceAmount: serviceAmount,
      discountAmount: discountAmount,
      surchargeAmount: surchargeAmount,
      customerPaid: customerPaid,
      changeAmount: changeAmount,
      amount: amount,
      method: selectedMethod,
    };
    onSubmit(payload);
  };
  return (
    <Modal
      title={t(title)}
      open={openModal}
      onCancel={() => setOpenModal(false)}
      footer={null}
      width={900}
      centered
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={12}>
          <Col xs={24} lg={10}>
            <Card
              title="Tóm tắt thanh toán"
              style={{
                borderRadius: 16,
              }}
            >
              <Row justify="space-between">
                <Col>{t("Total Services")}</Col>

                <Col>
                  <Text strong>{serviceAmount?.toLocaleString()}</Text>
                </Col>
              </Row>
              <Form.Item
                label={t("Discount")}
                name="discountAmount"
                style={{ marginTop: 20 }}
              >
                <InputNumber
                  placeholder={t("Enter discount")}
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Form.Item label={t("Surcharge")} name="surchargeAmount">
                <InputNumber
                  placeholder={t("Enter surcharge")}
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>

              <Divider />
              <Row justify="space-between">
                <Col>
                  <Text strong>{t("Subtotal")}</Text>
                </Col>

                <Col>
                  <Text strong>{finalAmount?.toLocaleString()}</Text>
                </Col>
              </Row>
              <Form.Item
                label={t("Customer Paid")}
                name="customerPaid"
                style={{
                  marginTop: 20,
                }}
              >
                <InputNumber
                  placeholder={t("Enter amount paid by customer")}
                  style={{
                    width: "100%",
                  }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Row justify="space-between">
                <Col>
                  <Text strong>{t("Change")}</Text>
                </Col>

                <Col>
                  <Text strong type="success">
                    {changeAmount?.toLocaleString()}
                  </Text>
                </Col>
              </Row>
              <Divider />
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <Text type="secondary">{t("Amount Due")}</Text>

                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#ff4d4f",
                    marginTop: 10,
                  }}
                >
                  {amount?.toLocaleString()}
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={14}>
            <Card
              title={t("Payment Method")}
              style={{
                borderRadius: 16,
              }}
            >
              <Form.Item
                name="method"
                rules={[
                  {
                    required: true,
                    message: t("Please select a payment method"),
                  },
                ]}
              >
                <Radio.Group
                  style={{
                    width: "100%",
                  }}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                >
                  <Row gutter={[12, 12]}>
                    <Col span={6}>
                      <Radio value={1}>{t("Cash")}</Radio>
                    </Col>

                    {paymentProviders?.map((item: any) => (
                      <Col span={6} key={item.paymentMethod}>
                        <Radio value={item.paymentMethod}>
                          {t(item.paymentMethodName)}
                        </Radio>
                      </Col>
                    ))}
                  </Row>
                </Radio.Group>
              </Form.Item>
              {selectedMethod == 5 && (
                <>
                  <Card
                    size="small"
                    title={t("Cash Payment")}
                    style={{
                      marginTop: 16,
                    }}
                  >
                    <Row gutter={24}>
                      <Col xs={24} md={24}>
                        <Descriptions bordered size="small" column={1}>
                          <Descriptions.Item label="Bank Name">
                            {
                              paymentProviders
                                ?.find(
                                  (x: { paymentMethod: number }) =>
                                    x.paymentMethod === 5,
                                )
                                ?.settings?.find(
                                  (s: { key: string }) => s.key === "BankName",
                                )?.value
                            }
                          </Descriptions.Item>
                          <Descriptions.Item label={t("Account Holder")}>
                            {
                              paymentProviders
                                ?.find(
                                  (x: { paymentMethod: number }) =>
                                    x.paymentMethod === 5,
                                )
                                ?.settings?.find(
                                  (s: { key: string }) =>
                                    s.key === "AccountHolder",
                                )?.value
                            }
                          </Descriptions.Item>
                          <Descriptions.Item label={t("Account Number")}>
                            {
                              paymentProviders
                                ?.find(
                                  (x: { paymentMethod: number }) =>
                                    x.paymentMethod === 5,
                                )
                                ?.settings?.find(
                                  (s: { key: string }) =>
                                    s.key === "AccountNumber",
                                )?.value
                            }
                            <Button
                              size="small"
                              type="link"
                              icon={<CopyOutlined />}
                              onClick={() => {
                                const accountNumber = paymentProviders
                                  ?.find(
                                    (x: { paymentMethod: number }) =>
                                      x.paymentMethod === 5,
                                  )
                                  ?.settings?.find(
                                    (s: { key: string }) =>
                                      s.key === "AccountNumber",
                                  )?.value;
                                navigator.clipboard.writeText(
                                  accountNumber || "",
                                );
                                toast.success(
                                  t("Account number copied to clipboard"),
                                );
                              }}
                            >
                              Copy
                            </Button>
                          </Descriptions.Item>
                        </Descriptions>
                      </Col>
                    </Row>
                  </Card>
                </>
              )}
            </Card>
            <Card
              title={t("Customer Information")}
              style={{
                marginTop: 20,
                borderRadius: 16,
              }}
            >
              <Form.Item label={t("Full Name")} name="fullName">
                <Input placeholder={t("Enter full name...")} />
              </Form.Item>
              <Form.Item label={t("Email")} name="email">
                <Input placeholder={t("Enter email...")} />
              </Form.Item>

              <Form.Item
                label={t("Phone Number")}
                name="phone"
                rules={[
                  {
                    validator: validatePhoneNumber,
                  },
                ]}
              >
                <Input placeholder={t("Enter phone number...")} />
              </Form.Item>

              <Form.Item label={t("Note")} name="note">
                <Input.TextArea rows={3} placeholder={t("Enter note...")} />
              </Form.Item>
            </Card>
          </Col>
        </Row>
        <Divider />
        <Row justify="end" gutter={12}>
          <Col>
            <Button size="large" onClick={() => setOpenModal(false)}>
              {t("Cancel")}
            </Button>
          </Col>

          <Col>
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={() => form.submit()}
            >
              {t("Confirm Payment")}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalPayment;

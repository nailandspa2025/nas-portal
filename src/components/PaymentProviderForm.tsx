import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  CREDIT_ONLY_SURCHARGE_METHODS,
  GODADDY_SURCHARGE_METHODS,
} from "../utils/paymentSurcharge";
const paymentOptions = [
  {
    label: "🏦 Bank Transfer",
    value: 5,
  },
  {
    label: "🟦 PayPal",
    value: 8,
  },
  {
    label: "💳 Stripe",
    value: 9,
  },
  {
    label: "🟧 Paylink",
    value: 10,
  },
  {
    label: "🖥️ POS Payment",
    value: 11,
  },
];

const PaymentProviderForm = () => {
  return (
    <Form.List name="paymentProviders">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name }) => (
            <Card
              key={key}
              size="small"
              style={{
                marginBottom: 16,
                borderRadius: 12,
              }}
              extra={
                <Button
                  danger
                  type="text"
                  icon={<MinusCircleOutlined />}
                  onClick={() => remove(name)}
                ></Button>
              }
            >
              {/* Header */}
              <Row gutter={16} align="middle">
                <Col flex="1">
                  <Form.Item
                    label="Payment Method"
                    name={[name, "paymentMethod"]}
                    rules={[
                      {
                        required: true,
                        message: "Please select payment method",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select payment method"
                      options={paymentOptions}
                    />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    label="Status"
                    name={[name, "isActive"]}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                noStyle
                shouldUpdate={(prev, cur) =>
                  prev.paymentProviders?.[name]?.paymentMethod !==
                  cur.paymentProviders?.[name]?.paymentMethod
                }
              >
                {({ getFieldValue }) => {
                  const method = getFieldValue([
                    "paymentProviders",
                    name,
                    "paymentMethod",
                  ]);

                  if (!method) return null;

                  if (method === 5) {
                    return (
                      <>
                        <Divider orientation="center">Bank Information</Divider>

                        <Row gutter={16}>
                          <Col xs={24} md={12}>
                            <Form.Item
                              label="Bank Name"
                              name={[name, "bankName"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Bank Name is required",
                                },
                              ]}
                            >
                              <Input placeholder="Vietcombank" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={12}>
                            <Form.Item
                              label="Account Number"
                              name={[name, "accountNumber"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Account Number is required",
                                },
                              ]}
                            >
                              <Input placeholder="0123456789" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={12}>
                            <Form.Item
                              label="Account Holder"
                              name={[name, "accountHolder"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Account Holder is required",
                                },
                              ]}
                            >
                              <Input placeholder="NGUYEN VAN A" />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={12}>
                            <Form.Item
                              label="Bank Code"
                              name={[name, "bankCode"]}
                            >
                              <Input placeholder="VCB" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    );
                  }

                  if (method === 8) {
                    return (
                      <>
                        <Divider orientation="center">
                          PayPal Configuration
                        </Divider>

                        <Row gutter={16}>
                          <Col xs={24} md={11}>
                            <Form.Item
                              label="Client ID"
                              name={[name, "clientId"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Client ID is required",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={11}>
                            <Form.Item
                              label="Client Secret"
                              name={[name, "clientSecret"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Client Secret is required",
                                },
                              ]}
                            >
                              <Input.Password />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={2}>
                            <Form.Item
                              label="Sandbox"
                              name={[name, "isSandbox"]}
                              valuePropName="checked"
                            >
                              <Switch />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    );
                  }

                  if (method === 9) {
                    return (
                      <>
                        <Divider orientation="center">
                          Stripe Configuration
                        </Divider>

                        <Row gutter={16}>
                          <Col xs={24} md={12}>
                            <Form.Item
                              label="Publishable Key"
                              name={[name, "publishableKey"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Publishable Key is required",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={12}>
                            <Form.Item
                              label="Secret Key"
                              name={[name, "secretKey"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Secret Key is required",
                                },
                              ]}
                            >
                              <Input.Password />
                            </Form.Item>
                          </Col>

                          <Col span={24}>
                            <Form.Item
                              label="Webhook Secret"
                              name={[name, "webhookSecret"]}
                            >
                              <Input.Password />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    );
                  }

                  // Poynt (paylink) và POS Payment (gửi giao dịch xuống máy POS) dùng cùng bộ field,
                  // nhưng POS Payment bắt buộc Store ID + Device ID để biết máy nào nhận giao dịch
                  if (method === 10 || method === 11) {
                    const isPos = method === 11;
                    return (
                      <>
                        <Divider orientation="center">
                          {isPos
                            ? "POS Payment Configuration"
                            : "Poynt Configuration"}
                        </Divider>

                        <Row gutter={16}>
                          <Col xs={24} md={8}>
                            <Form.Item
                              label="Business ID"
                              name={[name, "businessId"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Business ID is required",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={8}>
                            <Form.Item
                              label="Store ID"
                              name={[name, "storeId"]}
                              rules={[
                                {
                                  required: isPos,
                                  message: "Store ID is required",
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                          </Col>

                          <Col xs={24} md={8}>
                            <Form.Item
                              label="Device ID"
                              name={[name, "deviceId"]}
                              tooltip={
                                isPos
                                  ? "Mã máy POS nhận giao dịch, dạng urn:tid:..."
                                  : undefined
                              }
                              rules={[
                                {
                                  required: isPos,
                                  message: "Device ID is required",
                                },
                              ]}
                            >
                              <Input
                                placeholder={isPos ? "urn:tid:..." : undefined}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        {isPos && (
                          <Row gutter={16}>
                            <Col xs={24} md={8}>
                              <Form.Item
                                label="Timeout (seconds)"
                                name={[name, "timeoutSeconds"]}
                                tooltip="Quá thời gian này mà khách chưa thanh toán thì giao dịch tự huỷ, máy POS nhận được giao dịch mới. Để trống = 60 giây."
                              >
                                <InputNumber
                                  min={10}
                                  max={86400}
                                  precision={0}
                                  placeholder="60"
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        )}
                      </>
                    );
                  }

                  return null;
                }}
              </Form.Item>

              {/* Phí cà thẻ NAS: cộng vào Surcharge khi khách thanh toán bằng phương thức này.
                  Poynt (10) dùng surcharge của GoDaddy nên không cấu hình ở đây.
                  POS Payment (11) chỉ cộng khi nhân viên chọn thẻ credit lúc thanh toán. */}
              <Form.Item
                noStyle
                shouldUpdate={(prev, cur) =>
                  prev.paymentProviders?.[name]?.paymentMethod !==
                  cur.paymentProviders?.[name]?.paymentMethod
                }
              >
                {({ getFieldValue }) => {
                  const method = getFieldValue([
                    "paymentProviders",
                    name,
                    "paymentMethod",
                  ]);
                  if (!method) return null;
                  if (GODADDY_SURCHARGE_METHODS.includes(method)) {
                    return (
                      <Alert
                        type="info"
                        showIcon
                        message="Card surcharge is applied by GoDaddy Payments (credit cards only). Enable it in the GoDaddy account of this store."
                      />
                    );
                  }
                  return (
                    <>
                      <Divider orientation="center">Card Surcharge</Divider>
                      {CREDIT_ONLY_SURCHARGE_METHODS.includes(method) && (
                        <Alert
                          type="info"
                          showIcon
                          style={{ marginBottom: 16 }}
                          message="Only applied when staff selects Credit card at checkout. Debit cards are never surcharged. Keep Surcharging OFF for the terminal in GoDaddy to avoid charging twice."
                        />
                      )}
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Surcharge (%)"
                            name={[name, "surchargePercent"]}
                            tooltip="Tính trên phần trả bằng thẻ: tiền dịch vụ - giảm giá - tiền mặt khách đưa (không tính trên tip). Để trống = không thu."
                          >
                            <InputNumber
                              min={0}
                              max={100}
                              step={0.1}
                              placeholder="0"
                              addonAfter="%"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Fixed surcharge"
                            name={[name, "surchargeFixedAmount"]}
                            tooltip="Số tiền cố định cộng thêm mỗi giao dịch. Để trống = không thu."
                          >
                            <InputNumber
                              min={0}
                              placeholder="0"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  );
                }}
              </Form.Item>
            </Card>
          ))}

          <Button
            type="dashed"
            size="large"
            block
            icon={<PlusOutlined />}
            onClick={() =>
              add({
                isActive: true,
              })
            }
          >
            Add Payment Provider
          </Button>
        </>
      )}
    </Form.List>
  );
};

export default PaymentProviderForm;

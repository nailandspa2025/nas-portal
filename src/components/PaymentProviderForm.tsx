import React from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

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

                  return null;
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

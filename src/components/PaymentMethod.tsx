import React, { useMemo } from "react";
import {
  Card,
  Form,
  Radio,
  Row,
  Col,
  Typography,
  Descriptions,
  Button,
  Divider,
  Space,
} from "antd";
import { WalletOutlined, BankOutlined, CopyOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { BankAccountApi } from "../apis/catalog/bank";

const { Text } = Typography;

interface Props {
  form: any;
  data: any;
}

const PaymentMethod: React.FC<Props> = ({ form, data }) => {
  const method = Form.useWatch("method", form);

  const { data: paymentProviders } = useQuery({
    queryKey: ["paymentProviders", data?.storeId],
    enabled: !!data?.storeId,
    queryFn: async () => {
      const response: any = await BankAccountApi.getPaymentProviders(
        data.storeId,
      );

      return response.data;
    },
  });

  const provider = useMemo(() => {
    return paymentProviders?.find((x: any) => x.paymentMethod === method);
  }, [paymentProviders, method]);

  const getSetting = (key: string) =>
    provider?.settings?.find((x: any) => x.key === key)?.value;

  const copy = (value: string, message: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value);

    toast.success(message);
  };

  return (
    <Card
      title="Payment Method"
      style={{
        borderRadius: 12,
      }}
    >
      <Form.Item
        name="method"
        rules={[
          {
            required: true,
            message: "Please select payment method",
          },
        ]}
      >
        <Radio.Group
          style={{
            width: "100%",
          }}
        >
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <Radio value={1}>
                <WalletOutlined /> Cash
              </Radio>
            </Col>

            {paymentProviders?.map((item: any) => (
              <Col span={12} key={item.paymentMethod}>
                <Radio value={item.paymentMethod}>
                  <BankOutlined /> {item.paymentMethodName}
                </Radio>
              </Col>
            ))}
          </Row>
        </Radio.Group>
      </Form.Item>

      {method !== 1 && provider && (
        <>
          <Divider />

          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Bank">
              {getSetting("BankName") ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Account Holder">
              {getSetting("AccountHolder") ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Account Number">
              <Row justify="space-between" align="middle">
                <Text strong>{getSetting("AccountNumber")}</Text>

                <Button
                  type="link"
                  icon={<CopyOutlined />}
                  onClick={() =>
                    copy(getSetting("AccountNumber"), "Account number copied")
                  }
                >
                  Copy
                </Button>
              </Row>
            </Descriptions.Item>

            <Descriptions.Item label="Branch">
              {getSetting("Branch") ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Swift Code">
              {getSetting("Swift") ?? "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Currency">
              {getSetting("Currency") ?? "USD"}
            </Descriptions.Item>
          </Descriptions>

          {getSetting("QrContent") && (
            <>
              <Divider />

              <Space
                direction="vertical"
                style={{
                  width: "100%",
                }}
              >
                <Text strong>QR Payment Content</Text>

                <Button
                  block
                  icon={<CopyOutlined />}
                  onClick={() =>
                    copy(getSetting("QrContent"), "QR content copied")
                  }
                >
                  Copy QR Content
                </Button>
              </Space>
            </>
          )}
        </>
      )}
    </Card>
  );
};

export default PaymentMethod;

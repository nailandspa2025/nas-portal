import React from "react";
import { Card, Button, Space, Typography, InputNumber, Row, Col } from "antd";

const { Text } = Typography;

interface Props {
  subtotal: number;
  value: number;
  onChange: (value: number) => void;
}

const QuickTip: React.FC<Props> = ({ subtotal, value, onChange }) => {
  const formatMoney = (money: number) => money.toLocaleString("vi-VN") + " ₫";

  const tipButtons = [
    {
      label: "15%",
      percent: 0.15,
    },
    {
      label: "20%",
      percent: 0.2,
    },
    {
      label: "25%",
      percent: 0.25,
    },
  ];

  const currentPercent = subtotal === 0 ? 0 : value / subtotal;

  return (
    <Card
      size="small"
      title="Quick Tip"
      style={{
        marginTop: 16,
        borderRadius: 10,
        background: "#f6ffed",
      }}
    >
      <Space wrap style={{ marginBottom: 16 }}>
        {tipButtons.map((item) => {
          const tipValue = Math.round(subtotal * item.percent);

          const active = Math.abs(currentPercent - item.percent) < 0.001;

          return (
            <Button
              key={item.percent}
              type={active ? "primary" : "default"}
              onClick={() => onChange(tipValue)}
            >
              {item.label}
            </Button>
          );
        })}

        <Button
          type={value === 0 ? "primary" : "default"}
          onClick={() => onChange(0)}
        >
          No Tip
        </Button>
      </Space>

      <Row gutter={12}>
        <Col span={24}>
          <Text strong>Tip Amount</Text>

          <InputNumber
            value={value}
            min={0}
            style={{
              width: "100%",
              marginTop: 8,
            }}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => Number(v?.replace(/,/g, "") || 0)}
            onChange={(v) => onChange(Number(v || 0))}
          />
        </Col>
      </Row>

      <div
        style={{
          marginTop: 16,
          padding: 12,
          background: "#fff",
          borderRadius: 8,
          border: "1px solid #f0f0f0",
        }}
      >
        <Row justify="space-between">
          <Text type="secondary">Current Tip</Text>

          <Text strong>{formatMoney(value)}</Text>
        </Row>

        <Row
          justify="space-between"
          style={{
            marginTop: 8,
          }}
        >
          <Text type="secondary">Percentage</Text>

          <Text strong>{(currentPercent * 100).toFixed(1)}%</Text>
        </Row>
      </div>
    </Card>
  );
};

export default QuickTip;

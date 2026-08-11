import React, { useMemo } from "react";
import { Card, Table, Tag, Typography, Space } from "antd";

const { Text } = Typography;

interface Service {
  priceFrom: number;
}

interface Technician {
  id?: number;
  services: Service[];
  technician: any;
}

interface Props {
  technicians?: Technician[];
}

const formatMoney = (v: number) => v.toLocaleString();

const TechnicianRevenue: React.FC<Props> = ({ technicians = [] }) => {
  const data = useMemo(() => {
    return technicians.map((t, index) => ({
      key: t.id ?? index,

      name: t.technician?.technicianName ?? `Technician ${index + 1}`,

      total: t.services.reduce(
        (sum, service) => sum + Number(service.priceFrom || 0),
        0,
      ),
    }));
  }, [technicians]);

  return (
    <Card
      title="Service Confirmation and Payment"
      style={{
        borderRadius: 12,
      }}
    >
      <Table
        rowKey="key"
        size="small"
        bordered
        pagination={false}
        dataSource={data}
        columns={[
          {
            title: "Technician",
            dataIndex: "name",
            render: (value: string) => (
              <Space>
                <Text strong>{value}</Text>

                <Tag color="success">Done</Tag>
              </Space>
            ),
          },
          {
            title: "Service revenue",
            dataIndex: "total",
            width: 180,
            align: "right",
            render: (value: number) => <Text strong>{formatMoney(value)}</Text>,
          },
        ]}
      />

      <Text
        type="secondary"
        italic
        style={{
          marginTop: 12,
          display: "block",
        }}
      >
        Service revenue per worker = basis for calculating Proportional Tip.
      </Text>
    </Card>
  );
};

export default TechnicianRevenue;

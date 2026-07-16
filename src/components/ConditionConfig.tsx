import React, { useEffect } from "react";
import { Row, Col, Typography, Form } from "antd";
import { ConditionBuilder } from "./ConditionBuilder";
import { SchemaField } from "../utils/conditionBuilderTypes";
import { FilterOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface ConditionConfigProps {
  form: any;
}

const VOUCHER_SCHEMA_FIELDS: SchemaField[] = [
  // { key: 'serviceCode', label: 'service_code (Mã dịch vụ)', type: 'string' },
  {
    key: "totalAmount",
    label: "Amount",
    type: "number",
    min: 0,
  },
  {
    key: "point",
    label: "Total point",
    type: "number",
  },
];

const ConditionConfig: React.FC<ConditionConfigProps> = ({ form }) => {
  const { t } = useTranslation();
  useEffect(() => {
    console.log("condition form:", form);
  }, []);
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title
          level={4}
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          <FilterOutlined
            style={{ color: "#1890ff", fontSize: 18, paddingRight: 12 }}
          />
          <span>{t("Voucher subject to conditions")}</span>
        </Typography.Title>
      </Col>
      <Col span={24}>
        <Form.Item
          name="condition"
          valuePropName="value"
          trigger="onChange"
          rules={[
            {
              required: true,
              message: t("Please configure the conditions"),
            },
          ]}
        >
          <ConditionBuilder schemaFields={VOUCHER_SCHEMA_FIELDS} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default ConditionConfig;

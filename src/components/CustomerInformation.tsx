import React from "react";
import { Card, Form, Input, Row, Col } from "antd";
import { validatePhoneNumber } from "../utils/common/validate";

interface Props {}

const CustomerInformation: React.FC<Props> = () => {
  return (
    <Card
      title="Customer Information"
      style={{
        marginTop: 20,
        borderRadius: 16,
      }}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Full Name" name="fullName">
            <Input placeholder="Enter customer's full name" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              {
                validator: validatePhoneNumber,
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "Invalid email",
              },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Note" name="note">
            <Input.TextArea
              rows={4}
              placeholder="Payment note..."
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default CustomerInformation;

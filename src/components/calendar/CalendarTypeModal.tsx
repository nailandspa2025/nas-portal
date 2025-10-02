/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, ColorPicker, Form, Input, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ModalProps {
  data?: any;
  title?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  loading?: boolean;
  onSubmit?: (values: any) => void;
}
const CalendarTypeModal: React.FC<ModalProps> = ({
  title = "Create label",
  open = false,
  setOpen,
  loading = false,
  onSubmit = () => {},
  data = {},
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState("");
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: data.name || "",
        color: data?.color || "",
      });
      setSelectedColor(data.color);
    } else {
      form.resetFields();
    }
  }, [data, open, form]);
  const onFinish = (values: any) => {
    const payload = {
      ...values,
      color: selectedColor,
      id: data?.id,
    };
    onSubmit(payload);
  };

  return (
    <Modal
      title={t(title)}
      open={open}
      onCancel={() => setOpen(false)}
      footer={[
        <Button
          key="cancel"
          type="primary"
          danger
          onClick={() => setOpen(false)}
        >
          {t("Cancel")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          {t("Save")}
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={t("Label name")}
              name="name"
              rules={[
                { required: true, message: t("Please enter label name!") },
              ]}
            >
              <Input placeholder={t("Enter label name")} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t("Color")}
              name="color"
              rules={[{ required: true, message: t("Please select a color!") }]}
            >
              <ColorPicker
                // allowClear
                showText
                format={"hex"}
                value={data?.color}
                style={{ width: "100%", justifyContent: "flex-end" }}
                onChange={(e) => setSelectedColor(e.toHexString())}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CalendarTypeModal;

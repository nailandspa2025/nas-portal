/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Button, Col, Form, Input, Modal, Row, Space, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

interface ModalFormAppVersionProps {
  data?: any;
  title?: string;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  loading?: boolean;
  onSubmit?: (values: any) => void;
}

const ModalFormAppVersion: React.FC<ModalFormAppVersionProps> = ({
  title = "Create app version",
  openModal = false,
  setOpenModal,
  loading = false,
  onSubmit = () => {},
  data = {},
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!openModal) {
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      name: data?.name || "",
      platform: data?.platform || "",
      version: data?.version || "",
      isRequired: data?.isRequired ?? false,
    });
  }, [data, openModal, form]);

  const onFinish = (values: any) => {
    const payload = { ...values, isRequired: !!values.isRequired };
    if (data?.id) payload.id = data.id;
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
          {t("Save")}
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row>
          <Col span={24}>
            <Form.Item
              label={t("Name")}
              name="name"
              rules={[{ required: true, message: t("Please enter name!") }]}
            >
              <Input placeholder={t("Enter name")} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t("Platform")}
              name="platform"
              rules={[{ required: true, message: t("Please enter platform!") }]}
            >
              <Input placeholder="ios / android" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t("Version")}
              name="version"
              rules={[{ required: true, message: t("Please enter version!") }]}
            >
              <Input placeholder="1.0.0" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Space align="center">
              <Form.Item name="isRequired" valuePropName="checked" noStyle>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                />
              </Form.Item>
              <span>{t("Required update")}</span>
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalFormAppVersion;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Button, Col, Form, Input, Modal, Row, Space, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
interface ModalFormReasonProps {
  data?: any;
  title?: string;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  loading?: boolean;
  onSubmit?: (values: any) => void;
}

const ModalFormReason: React.FC<ModalFormReasonProps> = ({
  title = "Create reason",
  openModal = false,
  setOpenModal,
  loading = false,
  onSubmit = () => {},
  data = {},
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name || "",
        isActive: data?.isActive || true,
      });
    }
    if (!openModal) {
      form.resetFields();
    }
  }, [data, openModal]);
  const onFinish = (values: any) => {
    const payload = {
      ...values,
    };
    if (data.id) payload.id = data.id;
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
              name={"name"}
              rules={[{ required: true, message: t("Please enter name!") }]}
            >
              <Input placeholder={t("Enter name")} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Space align="center">
              <Form.Item name="isActive" valuePropName="checked" noStyle>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  defaultChecked={true}
                />
              </Form.Item>
              <span>{t("Active")}</span>
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalFormReason;

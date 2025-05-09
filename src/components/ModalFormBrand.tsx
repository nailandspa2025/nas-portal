/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import { useTranslation } from "react-i18next";
import AvatarUploader from "./AvatarUploader";
interface ModalFormBrandProps {
  data?: any;
  title?: string;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  loading?: boolean;
  onSubmit?: (values: any) => void;
}
const ModalFormBrand: React.FC<ModalFormBrandProps> = ({
  title = "Create",
  openModal = false,
  setOpenModal,
  loading = false,
  onSubmit = () => {},
  data = {},
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name || "",
        logo: data.logo || undefined, // <-
      });
      if (data.logo instanceof File || data.logo instanceof Blob) {
        const objectUrl = URL.createObjectURL(data.logo);
        setImageUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      } else if (typeof data.logo === "string") {
        setImageUrl(data.logo);
      } else {
        setImageUrl(null);
      }
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
              label={t("Logo")}
              name={"logo"}
              rules={[{ required: true, message: t("Choose image!") }]}
            >
              <AvatarUploader
                data={imageUrl || null}
                placeholder={t("Choose  image")}
              />
            </Form.Item>
            <Form.Item
              label={t("Name")}
              name={"name"}
              rules={[{ required: true, message: t("Please enter name!") }]}
            >
              <Input placeholder={t("Enter name")} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default ModalFormBrand;

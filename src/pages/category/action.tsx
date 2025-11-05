/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Form, Input, Space, Switch, InputNumber } from "antd";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { checkAccessRight } from "../../utils/common/accessUtils";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { buildFormData } from "../../utils/common/buildFormData";
import { CategoryApi } from "../../apis/catalog/category";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DropdownApi } from "../../apis/dropdown/dropdown";

import RemoteSelect from "../../components/RemoteSelect";
const { TextArea } = Input;
const CateoryActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data } = useQuery({
    queryKey: ["categoryDetail", params.id],
    queryFn: async () => {
      const res: any = await CategoryApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && data) {
      form.setFieldsValue({
        name: data.name || "",
        description: data.description || "",
        isActive: data.isActive || true,
        serviceIds: data.serviceIds || null,
        parentId: data.parentId || null,
        orderNo: data.orderNo || null,
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await CategoryApi.update(params.id as any, formD)
        : await CategoryApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/category");
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  const handleSubmit = () => {
    form.submit();
  };
  const onFinish = (values: any) => {
    const payload = {
      ...values,
      isActive: values.isActive ?? true,
    };
    if (params.id) {
      payload.id = params.id;
    }
    mutation.mutate(payload);
  };
  return (
    <>
      <Row
        className="custom-row"
        justify="space-between"
        align="middle"
        gutter={[0, 16]}
      >
        <Col flex="auto">
          <div className="custom-title">
            {params?.id ? t("Update banner") : t("Create banner")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/category"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(
              accesses,
              "update",
              "category"
            )}
          />
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24}>
              <Form.Item
                label={t("Category name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("Please enter category name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter category name")} />
              </Form.Item>
              <Form.Item label={t("Parent category")} name="parentId">
                <RemoteSelect
                  placeholder={t("Select parent category (optional)")}
                  fetchList={CategoryApi.getWithPagination}
                  fetchById={CategoryApi.getById}
                  labelKey="name"
                  valueKey="id"
                />
              </Form.Item>
              <Form.Item label={t("Service")} name="serviceIds">
                <RemoteSelect
                  placeholder={t("Select parent category (optional)")}
                  fetchList={DropdownApi.getServices}
                  fetchById={DropdownApi.getServiceById}
                  fetchByIds={DropdownApi.getServiceByIds}
                  labelKey="name"
                  valueKey="id"
                  mode="multiple"
                />
              </Form.Item>
              <Form.Item label={t("Order No")} name="orderNo">
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder={t("Enter order no (optional)")}
                />
              </Form.Item>

              <Form.Item label={t("Description")} name="description">
                <TextArea
                  rows={4}
                  placeholder={t("Enter description (optional)")}
                />
              </Form.Item>
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
      </Card>
      <TopActionButtons
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
        backUrl="/category"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(accesses, "update", "banner")}
      />
    </>
  );
};
export default CateoryActions;

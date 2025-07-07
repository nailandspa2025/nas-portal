import { Card, Form, Row, Col, Input, Space, Switch, InputNumber } from "antd";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { buildFormData } from "../../utils/common/buildFormData";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PackageApi } from "../../apis/catalog/package";
import { useEffect } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ServiceSelect from "../../components/ServiceSelect";
const PackageActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const { data } = useQuery({
    queryKey: ["servicePackageDetail", params.id],
    queryFn: async () => {
      const res: any = await PackageApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && data) {
      form.setFieldsValue({
        name: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        serviceIds: data.serviceIds || null,
        durationDays: data.durationDays || 0,
        isActive: data.isActive || true,
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await PackageApi.update(params.id as any, formD)
        : await PackageApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/package");
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  const onFinish = (values: any) => {
    const payload = {
      ...values,
      serviceIds: values.serviceIds ?? null,
    };
    if (params.id) {
      payload.id = params.id;
    }
    console.log("payload", payload);
    mutation.mutate(payload);
  };
  const handleSubmit = () => {
    form.submit();
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
            {params?.id ? t("Update package") : t("Create package")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/package"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(
              accesses,
              "update",
              "package"
            )}
          />
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("Name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("Please enter service name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter service name")} />
              </Form.Item>
              <Form.Item label={t("Price")} name="price">
                <InputNumber
                  placeholder={t("Enter price")}
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Form.Item label={t("Description")} name="description">
                <Input.TextArea rows={4} placeholder={t("Enter description")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label={t("Service")} name="serviceIds">
                <ServiceSelect mode="multiple" />
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
    </>
  );
};

export default PackageActions;

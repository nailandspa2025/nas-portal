import { Button, Card, Col, Form, Input, Row, Space } from "antd";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { checkAccessRight } from "../../../utils/common/accessUtils";
import RemoteSelect from "../../../components/RemoteSelect";
import { DropdownApi } from "../../../apis/dropdown/dropdown";
import { useMutation, useQuery } from "@tanstack/react-query";
import { buildFormData } from "../../../utils/common/buildFormData";
import { toast } from "react-toastify";
import { PointSettingApi } from "../../../apis/loyalty/pointSetting";
const SetPointAction = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { data } = useQuery({
    queryKey: ["roleDetail", params.id],
    queryFn: async () => {
      const res: any = await PointSettingApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && data) {
      form.setFieldsValue({
        name: data.name || "",
        isDraft: data.isDraft || false,
        merchantId: data.merchantId || null,
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await PointSettingApi.update(params.id as string, formD)
        : await PointSettingApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/loyalty-point");
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  const handleSubmit = (type: boolean) => {
    setIsDraft(type);
    form.submit();
  };
  const onFinish = (values: any) => {
    const payload = { ...values, isDraft };
    if (params?.id) payload.id = params.id;
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
            {params?.id ? t("Update set points") : t("Create set points")}
          </div>
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                label={t("Merchant name")}
                name={"merchantId"}
                rules={[
                  {
                    required: true,
                    message: t("Please enter merchant name!"),
                  },
                ]}
              >
                <RemoteSelect
                  placeholder={t("Select merchant")}
                  fetchList={DropdownApi.getMerchants}
                  fetchById={DropdownApi.getUserById}
                  fetchByIds={DropdownApi.getUserByIds}
                  labelKey={(item) => `${item.name}`}
                  valueKey="id"
                />
              </Form.Item>
              <Form.Item
                label={t("Point name")}
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: t("Please enter point name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter point name")} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Space
        wrap
        style={{
          width: "100%",
          justifyContent: "flex-end",
          marginTop: 20,
        }}
      >
        <Button
          type="default"
          style={{ background: "#FF1818", color: "#fff" }}
          onClick={() => navigate("/loyalty-point")}
        >
          {t("Cancel")}
        </Button>

        <>
          <Button
            type="default"
            onClick={() => handleSubmit(true)}
            style={{ background: "#00A537", color: "#fff" }}
          >
            {t("Draft")}
          </Button>
          <Button
            type="default"
            onClick={() => handleSubmit(false)}
            style={{ background: "#1890FF", color: "#fff" }}
          >
            {t("Save")}
          </Button>
        </>
      </Space>
    </>
  );
};

export default SetPointAction;

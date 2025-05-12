/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Form, Row, Col, Input, Select, InputNumber } from "antd";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { buildFormData } from "../../utils/common/buildFormData";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import MerchantSelect from "../../components/MerchantSelect";
import { RewardApi } from "../../apis/catalog/reward";
const RewardActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();

  const { data } = useQuery({
    queryKey: ["rewardDetail", params.id],
    queryFn: async () => {
      const res: any = await RewardApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && data) {
      form.setFieldsValue({
        name: data.name || "",
        merchantId: data.merchantId || null,
        rewardType: data.rewardType || "",
        point: data.point || "",
        cash: data.cash || "",
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await RewardApi.update(params.id as any, formD)
        : await RewardApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/reward");
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
    };
    if (params.id) payload.id = params.id;
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
            {params?.id ? t("Update reward") : t("Create reward")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/reward"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(accesses, "update", "reward")}
          />
        </Col>
      </Row>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Form.Item
                label={t("Merchant name")}
                name="merchantId"
                rules={[
                  {
                    required: true,
                    message: t("Please enter reward name!"),
                  },
                ]}
              >
                <MerchantSelect />
              </Form.Item>
              <Form.Item
                label={t("Reward name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("Please enter reward name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter reward name")} />
              </Form.Item>
              <Form.Item
                label={t("Reward type")}
                name="rewardType"
                rules={[
                  {
                    required: true,
                    message: t("Please enter reward name!"),
                  },
                ]}
              >
                <Select placeholder={t("Choose reward type")} allowClear>
                  <Select.Option value={3}>Booking</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("Point")}
                name="point"
                rules={[
                  {
                    required: true,
                    message: t("Please enter point!"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("Enter point")}
                  style={{
                    width: "100%",
                  }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("Cash")}
                name="cash"
                rules={[
                  {
                    required: true,
                    message: t("Please enter cash!"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("Enter  cash")}
                  style={{
                    width: "100%",
                  }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <TopActionButtons
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
        backUrl="/reward"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(accesses, "update", "reward")}
      />
    </>
  );
};

export default RewardActions;

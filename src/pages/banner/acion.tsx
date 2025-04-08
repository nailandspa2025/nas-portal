/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Form, Input, DatePicker, Space, Switch } from "antd";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { checkAccessRight } from "../../utils/common/accessUtils";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { buildFormData } from "../../utils/common/buildFormData";
import { BannerApi } from "../../apis/catalog/banner";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ImagesUploader from "../../components/ImagesUploader";
const BannerActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState([]);
  const [linkUrls, setLinkUrls] = useState([]);
  const { data } = useQuery({
    queryKey: ["bookingDetail", params.id],
    queryFn: () => BannerApi.getById(params.id as any),
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && (data as any)?.data) {
      const value = (data as any).data;
      setImageUrls(value.imageUrls);
      setLinkUrls(value.imageUrls);
      form.setFieldsValue({
        title: value.title || "",
        link: value.link || "",
        isActive: value.isActive || true,
        showTo: value.showTo ? dayjs(value.showTo, "YYYY-MM-DD") : null,
        showFrom: value.showFrom ? dayjs(value.showTo, "YYYY-MM-DD") : null,
        images: value.imageUrls || null,
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await BannerApi.update(params.id as any, formD)
        : await BannerApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/banner");
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
      payload.linkUrls = linkUrls.filter(
        (item: any) => typeof item === "string"
      );
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
            backUrl="/banner"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(
              accesses,
              "update",
              "booking"
            )}
          />
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label={t("Title")} name={"title"}>
                <Input placeholder={t("Enter title")} />
              </Form.Item>
              <Form.Item
                label={t("Link")}
                name={"link"}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      try {
                        new URL(value); // Đây sẽ tự xử lý cả IP, port, domain, v.v.
                        return Promise.resolve();
                      } catch {
                        return Promise.reject(new Error(t("Invalid URL")));
                      }
                    },
                  },
                ]}
              >
                <Input placeholder={t("Enter link")} />
              </Form.Item>
              <Row gutter={15}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item label={t("From date")} name={"showFrom"}>
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder={t("Choose date")}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item label={t("To date")} name={"showTo"}>
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder={t("Choose date")}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
              </Row>
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
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("Images")}
                name="images"
                rules={[
                  {
                    required: true,
                    message: t("Please choose image!"),
                  },
                ]}
              >
                <ImagesUploader
                  value={imageUrls || undefined}
                  onChange={(e) => {
                    setLinkUrls(e);
                    form.setFieldsValue({ images: e });
                  }}
                  placeholder="Chose images"
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
        backUrl="/banner"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(accesses, "update", "banner")}
      />
    </>
  );
};
export default BannerActions;

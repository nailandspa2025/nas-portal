import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Rate,
  InputNumber,
  TimePicker,
  Select,
} from "antd";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { buildFormData } from "../../utils/common/buildFormData";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ServiceApi } from "../../apis/catalog/service";
import { useState, useEffect } from "react";
import AvatarUploader from "../../components/AvatarUploader";
import dayjs from "dayjs";

const ServiceActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAvatar, setIsAvatar] = useState(false);
  const { data } = useQuery({
    queryKey: ["serviceDetail", params.id],
    queryFn: async () => {
      const res: any = await ServiceApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && data) {
      setImageUrl(data.urlImage || null);
      form.setFieldsValue({
        name: data.name || "",
        code: data.code || "",
        description: data.description || "",
        urlImage: data.urlImage || "",
        priceFrom: data.priceFrom || 0,
        priceTo: data.priceTo || 0,
        rating: data.rating || 0,
        workingTime: data.workingTime ? dayjs(data.workingTime, "HH:mm") : null,
        currency: data.currency || null,
        commission: data.commission || 0,
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await ServiceApi.update(params.id as any, formD)
        : await ServiceApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/service");
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  const onFinish = (values: any) => {
    const payload = {
      ...values,
      userIds: values.userIds ?? null,
    };
    if (params.id) {
      payload.id = params.id;
      payload.isAvatar = isAvatar;
    }
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
            {params?.id ? t("Update service") : t("Create service")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/service"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(
              accesses,
              "update",
              "service",
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
              <Form.Item
                label={t("Code")}
                name="code"
                rules={[
                  {
                    required: true,
                    message: t("Please enter service code!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter service code")} />
              </Form.Item>
              <Form.Item
                label={t("Working time")}
                name={"workingTime"}
                rules={[
                  {
                    required: true,
                    message: t("Please choose time"),
                  },
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  placeholder={t("Choose  time")}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item label={t("Description")} name="description">
                <Input.TextArea rows={4} placeholder={t("Enter description")} />
              </Form.Item>
              <Form.Item label={t("Commission")} name="commission">
                <InputNumber
                  placeholder={t("Enter commission")}
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Form.Item name="rating" label={t("Rating")}>
                <Rate />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label={t("Price from")} name="priceFrom">
                <InputNumber
                  placeholder={t("Enter price from")}
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  onChange={() => {
                    // Khi priceFrom thay đổi, validate lại priceTo
                    form.validateFields(["priceTo"]);
                  }}
                />
              </Form.Item>

              <Form.Item
                label={t("Price to")}
                name="priceTo"
                dependencies={["priceFrom"]}
                rules={[
                  {
                    validator: (_, value) => {
                      const priceFrom = form.getFieldValue("priceFrom");

                      if (
                        priceFrom != null &&
                        (value == null || value === "")
                      ) {
                        return Promise.reject(
                          new Error(
                            t(
                              "Please enter Price to when Price from is filled",
                            ),
                          ),
                        );
                      }

                      if (
                        priceFrom != null &&
                        value != null &&
                        value < priceFrom
                      ) {
                        return Promise.reject(
                          new Error(
                            t(
                              "Price to must be greater than or equal to Price from",
                            ),
                          ),
                        );
                      }

                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("Enter price to")}
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Form.Item
                label={t("Currency")}
                name="currency"
                rules={[
                  {
                    required: true,
                    message: t("Please choose currency!"),
                  },
                ]}
              >
                <Select
                  allowClear
                  autoClearSearchValue
                  placeholder={t("Select currency")}
                >
                  <Select.Option value={1}>USD - US Dollar</Select.Option>
                  <Select.Option value={2}>EUR - Euro</Select.Option>
                  <Select.Option value={3}>VND - Vietnamese Dong</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label={t("Image")} name="image">
                <AvatarUploader
                  data={imageUrl || undefined}
                  placeholder="Choose image"
                  onChange={() => {
                    setIsAvatar(true);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default ServiceActions;

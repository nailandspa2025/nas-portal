import {
  Card,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Typography,
  Radio,
  DatePicker,
  Switch,
  Space,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import { useSelector } from "react-redux";
import { checkAccessRight } from "../../../utils/common/accessUtils";
import TopActionButtons from "../../../components/common/TopActionButtons";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { buildFormData } from "../../../utils/common/buildFormData";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { VoucherApi } from "../../../apis/loyalty/voucher";
import { useState, useEffect } from "react";
import AvatarUploader from "../../../components/AvatarUploader";
import dayjs from "dayjs";
import StoreSelect from "../../../components/StoreSelect";
import ConditionConfig from "../../../components/ConditionConfig";
import "./style.scss";
import VoucherPreview from "./VoucherPreview";
const { TextArea } = Input;
const VoucherAction = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAvatar, setIsAvatar] = useState(false);
  const { data } = useQuery({
    queryKey: ["voucherDetail", params.id],
    queryFn: async () => {
      const res: any = await VoucherApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (!data || !params.id) return;

    setImageUrl(data.urlImg || null);

    form.setFieldsValue({
      name: data.name ?? "",
      code: data.code ?? "",
      description: data.description ?? "",

      storeId: data.storeId,

      validityDays: data.validityDays,

      requiredPoint: data.requiredPoint,

      totalQuantity: data.totalQuantity,

      discountType: data.discountType === "Percentage" ? 1 : 2,

      discountValue: data.discountValue,

      discountMaxAmount: data.discountMaxAmount,

      isActive: data.isActive,

      issuedAt: data.issuedAt ? dayjs(data.issuedAt) : null,

      // quan trọng
      condition: data.condition,
    });
  }, [data, params.id, form]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await VoucherApi.update(params.id as any, formD)
        : await VoucherApi.create(formD);
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
      isActive: values.isActive ?? true,
    };
    if (params.id) {
      payload.id = params.id;
      payload.isAvatar = isAvatar;
    }
    console.log("valuse", payload);
    mutation.mutate(payload);
  };
  const handleSubmit = () => {
    form.submit();
  };
  const discountType = Form.useWatch("discountType", form);
  const discountValue = Form.useWatch("discountValue", form);
  const discountMax = Form.useWatch("discountMaxAmount", form);
  const point = Form.useWatch("requiredPoint", form);
  const urlImg = Form.useWatch("urlImg", form);
  const currentYear = new Date().getFullYear();
  const name = Form.useWatch("name", form);
  const generatedCode =
    name && discountValue
      ? `${name}-${currentYear}-OFF${discountValue}`
      : `VOUCHER-TEMP-${currentYear}-OFF`;
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
            {params?.id ? t("Update voucher") : t("Create voucher")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/voucher"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(
              accesses,
              "update",
              "voucher",
            )}
          />
        </Col>
      </Row>
      <Card>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{
            discountType: 1,
          }}
        >
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("Name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("Please enter voucher name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter voucher name")} />
              </Form.Item>
              <Form.Item
                label={t("Issuance date")}
                name={"issuedAt"}
                rules={[
                  {
                    required: true,
                    message: t("Please select issuance date!"),
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item label={t("Circulation")} name={"totalQuantity"}>
                <InputNumber
                  placeholder={t("Enter circulation")}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              {/* <Form.Item
                label={t("Type")}
                name="type"
                rules={[
                  {
                    required: true,
                    message: t("Please enter voucher type!"),
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder={t("Please select voucher type")}
                >
                  <Select.Option value={1}>{t("Internal")}</Select.Option>
                  <Select.Option value={2}>{t("External")}</Select.Option>
                </Select>
              </Form.Item> */}
              <Form.Item
                label={t("Store")}
                name="storeId"
                rules={[{ required: true, message: t("Please choose store!") }]}
              >
                <StoreSelect placeholder={t("Choose store")} />
              </Form.Item>
              <Form.Item label={t("Description")} name={"description"}>
                <TextArea rows={4} placeholder={t("Enter description")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label={t("Image")} name="urlImg">
                <AvatarUploader
                  data={imageUrl || undefined}
                  placeholder="Choose image"
                  onChange={() => {
                    setIsAvatar(true);
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <ConditionConfig form={form} />
            </Col>
            <Col span={24}>
              <Typography.Title
                level={4}
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: 16,
                }}
              >
                <FilterOutlined
                  style={{ color: "#1890ff", fontSize: 18, paddingRight: 12 }}
                />
                <span>{t("Discount")}</span>
              </Typography.Title>
            </Col>
            <Col xs={24} sm={24} md={16} lg={16}>
              <Form.Item
                name="discountType"
                label={t("Discount type")}
                rules={[{ required: true }]}
              >
                <Radio.Group style={{ width: "100%" }}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Radio value={1} className="discount-radio">
                        <div>
                          <div className="discount-title">
                            By percentage (%)
                          </div>
                          <div className="discount-desc">
                            Discount based on order value
                          </div>
                        </div>
                      </Radio>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12}>
                      <Radio value={2} className="discount-radio">
                        <div>
                          <div className="discount-title">
                            Fixed amount (USD)
                          </div>
                          <div className="discount-desc">
                            Reduce a specific amount
                          </div>
                        </div>
                      </Radio>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
              <Row gutter={16}>
                <Col
                  xs={24}
                  sm={24}
                  md={discountType === 1 ? 12 : 24}
                  lg={discountType === 1 ? 12 : 24}
                >
                  <Form.Item
                    label={
                      discountType === 1
                        ? t("Decrease in value (%)")
                        : t("Fixed discount amount (USD)")
                    }
                    name="discountValue"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      placeholder={
                        discountType === 1
                          ? t("Enter a number from 1 to 100%")
                          : t("Specific discount amount")
                      }
                      min={0}
                      max={discountType === 1 ? 100 : undefined}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                {discountType === 1 && (
                  <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                      label={t("Maximum discount")}
                      name="discountMaxAmount"
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        placeholder={t("Limit the amount of the discount")}
                        min={0}
                        style={{ width: "100%" }}
                        formatter={(v) =>
                          `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    label={t("Converted points")}
                    name="requiredPoint"
                    rules={[{ required: true }]}
                    //extra="Đơn hàng cần đạt mức này để áp dụng voucher"
                  >
                    <InputNumber
                      placeholder={t(
                        "Points required to apply for the voucher",
                      )}
                      min={0}
                      style={{ width: "100%" }}
                      formatter={(v) =>
                        `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <Form.Item
                    label={t("Voucher expiration date")}
                    name="validityDays"
                    rules={[{ required: true }]}
                    //extra="Số ngày voucher có hiệu lực"
                  >
                    <InputNumber
                      placeholder={t("Number of days the voucher is valid")}
                      min={1}
                      style={{ width: "100%" }}
                      addonAfter="Days"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <VoucherPreview
                discountType={discountType}
                discountValue={discountValue}
                maximumDiscountAmount={discountMax}
                minimumOrderAmount={point}
                imageUrl={urlImg}
                code={generatedCode}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
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
      </Card>
    </>
  );
};
export default VoucherAction;

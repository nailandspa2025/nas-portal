/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Form, Row, Col, Input, Rate, TimePicker, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { StoreApi } from "../../apis/catalog/store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { buildFormData } from "../../utils/common/buildFormData";
import TopActionButtons from "../../components/common/TopActionButtons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import UserMerchnatSelect from "../../components/UserMerchantSelect";
import AvatarUploader from "../../components/AvatarUploader";
import ImagesUploader from "../../components/ImagesUploader";
import {
  validateLongitude,
  validateLatitude,
  validatePhoneNumber,
} from "../../utils/common/validate";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import MerchantSelect from "../../components/MerchantSelect";
import { DropdownApi } from "../../apis/dropdown/dropdown";
const StoreAction = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [linkUrls, setLinkUrls] = useState([]);
  const [isAvatar, setIsAvatar] = useState(false);
  const [brands, setBrands] = useState<any>([]);
  const { data } = useQuery({
    queryKey: ["storeDetail", params.id],
    queryFn: async () => {
      const res: any = await StoreApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  const { data: merchantDetail } = useQuery({
    queryKey: ["merchantDetail", data?.merchantId],
    queryFn: async () => {
      const res: any = await DropdownApi.getMerchantById(
        data?.merchantId as any
      );
      return res?.data || {};
    },
    enabled: !!data?.merchantId,
  });
  useEffect(() => {
    if (merchantDetail) {
      setBrands(merchantDetail?.brands || []);
    }
  }, [merchantDetail]);
  useEffect(() => {
    if (params.id && data) {
      setImageUrls(data.imageUrls);
      setImageUrl(data.avatar);
      setLinkUrls(data.imageUrls);
      form.setFieldsValue({
        storeName: data.storeName || "",
        hotline: data.hotline || "",
        openTime: data.openTime ? dayjs(data.openTime, "HH:mm") : null,
        closeTime: data.closeTime ? dayjs(data.closeTime, "HH:mm") : null,
        addressStore: data.addressStore || "",
        lng: data.lng || "",
        lat: data.lat || "",
        ownerId: data.ownerId || "",
        googleReviewLink: data.googleReviewLink || "",
        ratingStar: data.ratingStar || null,
        images: data.imageUrls || null,
        userIds: data.userIds || null,
        merchantId: data.merchantId || null,
        brandId: data.brandId || null,
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await StoreApi.update(params.id as any, formD)
        : await StoreApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/store");
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
      payload.linkUrls = linkUrls.filter(
        (item: any) => typeof item === "string"
      );
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
            {params?.id ? t("Update store") : t("Create store")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/store"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(accesses, "update", "store")}
          />
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("Merchant")}
                name={"merchantId"}
                rules={[
                  {
                    required: true,
                    message: t("Please choose merchant!"),
                  },
                ]}
              >
                <MerchantSelect
                  onChange={(_: any, merchant: any) => {
                    setBrands(merchant?.brands || []);
                  }}
                />
              </Form.Item>
              <Form.Item shouldUpdate>
                {({ getFieldValue }) => (
                  <Form.Item label={t("Brand")} name="brandId">
                    <Select
                      allowClear
                      placeholder={t("Choose brand")}
                      disabled={!getFieldValue("merchantId")}
                      options={brands?.map((item: any) => ({
                        label: `${item.name}`,
                        value: item.id,
                      }))}
                    />
                  </Form.Item>
                )}
              </Form.Item>
              <Form.Item
                label={t("Store name")}
                name="storeName"
                rules={[
                  {
                    required: true,
                    message: t("Please enter store name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter store name")} />
              </Form.Item>
              <Form.Item
                label={t("Hotline")}
                name="hotline"
                rules={[
                  {
                    required: true,
                    message: t("Please enter hotline"),
                  },
                  {
                    validator: validatePhoneNumber,
                  },
                ]}
              >
                <Input placeholder={t("Enter hotline")} />
              </Form.Item>
              <Row gutter={15}>
                <Col span={12}>
                  <Form.Item
                    label={t("Opne Time")}
                    name="openTime"
                    rules={[
                      {
                        required: true,
                        message: t("Please enter open time!"),
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const closeTime = getFieldValue("closeTime");
                          if (!value || !closeTime) return Promise.resolve();

                          if (dayjs(value).isAfter(dayjs(closeTime))) {
                            return Promise.reject(
                              new Error(
                                t("Open time must be before close time!")
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      placeholder={t("Enter open time")}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("Close Time")}
                    name="closeTime"
                    rules={[
                      {
                        required: true,
                        message: t("Please enter close time!"),
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const openTime = getFieldValue("openTime");
                          if (!value || !openTime) return Promise.resolve();

                          if (dayjs(value).isBefore(dayjs(openTime))) {
                            return Promise.reject(
                              new Error(
                                t("Close time must be after open time!")
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <TimePicker
                      format="HH:mm"
                      placeholder={t("Enter close time")}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={t("Address")}
                name="addressStore"
                rules={[
                  {
                    required: true,
                    message: t("Please enter address!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter address")} />
              </Form.Item>
              <Form.Item
                label={t("Latitude")}
                name="lat"
                rules={[
                  {
                    required: true,
                    message: t("Please enter latitude!"),
                  },
                  { validator: validateLatitude },
                ]}
              >
                <Input placeholder={t("Enter latitude")} />
              </Form.Item>
              <Form.Item
                label={t("Longitude")}
                name="lng"
                rules={[
                  {
                    required: true,
                    message: t("Please enter longitude!"),
                  },
                  { validator: validateLongitude },
                ]}
              >
                <Input placeholder={t("Enter longitude")} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label={t("User")} name="userIds">
                <UserMerchnatSelect
                  mode={"multiple"}
                  placeholder={t("Please choose user")}
                />
              </Form.Item>
              <Form.Item
                label={t("Google review link")}
                name="googleReviewLink"
              >
                <Input placeholder={t("Enter google review link")} />
              </Form.Item>
              <Form.Item label={t("Rating star")} name="ratingStar">
                <Rate />
              </Form.Item>
              <Form.Item label={t("Avatar")} name="avatar">
                <AvatarUploader
                  data={imageUrl || undefined}
                  placeholder="Choose avatar"
                  onChange={() => {
                    setIsAvatar(true);
                  }}
                />
              </Form.Item>
              <Form.Item label={t("Images")} name="images">
                <ImagesUploader
                  value={imageUrls || undefined}
                  placeholder="Chose images"
                  onChange={(e) => {
                    setLinkUrls(e);
                    form.setFieldsValue({ images: e });
                  }}
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
        backUrl="/store"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(accesses, "update", "store")}
      />
    </>
  );
};
export default StoreAction;

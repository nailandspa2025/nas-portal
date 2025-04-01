/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Form, Row, Col, Input, Rate, TimePicker } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { StoreApi } from "../../apis/catalog/store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { buildFormData } from "../../utils/common/buildFormData";
import TopActionButtons from "../../components/common/TopActionButtons";
import BottomActionButtons from "../../components/common/BottomActionButtons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import UserSelect from "../../components/UserSelect";
import AvatarUploader from "../../components/AvatarUploader";
import ImagesUploader from "../../components/ImagesUploader";
import {
  validateLongitude,
  validateLatitude,
  validatePhoneNumber,
} from "../../utils/common/validate";

const StoreAction = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState([]);

  const { data = { data: {} } } = useQuery({
    queryKey: ["storeDetail", params.id],
    queryFn: () => StoreApi.getById(params.id as any),
    enabled: !!params.id,
  });
  useEffect(() => {
    if ((data as any)?.data) {
      const value = (data as any).data;
      setImageUrls(value.imageUrls);
      setImageUrl(value.avatar);
      form.setFieldsValue({
        storeName: value.storeName || "",
        hotline: value.hotline || "",
        openTime: value.openTime ? dayjs(value.openTime, "HH:mm") : null,
        closeTime: value.closeTime ? dayjs(value.closeTime, "HH:mm") : null,
        addressStore: value.addressStore || "",
        lng: value.lng || "",
        lat: value.lat || "",
        ownerId: value.ownerId || "",
        googleReviewLink: value.googleReviewLink || "",
        ratingStar: value.ratingStar || "",
      });
    }
  }, [data, form]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await StoreApi.update(params.id as string, formD)
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
    };
    if (params.id) payload.id = params.id;
    mutation.mutate(payload);
  };
  const handleSubmit = () => {
    form.submit();
  };
  return (
    <>
      <Row className="custom-row" justify="space-between" align="middle">
        <Col>
          <div className="custom-title">
            {params?.id ? t("Update store") : t("Create store")}
          </div>
        </Col>
        <Col>
          <TopActionButtons backUrl="/store" onSubmit={handleSubmit} />
        </Col>
      </Row>
      <Card style={{ padding: "10px 20px" }}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
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

              <Form.Item
                label={t("User")}
                name="ownerId"
                rules={[
                  {
                    required: true,
                    message: t("Please choose user!"),
                  },
                ]}
              >
                <UserSelect placeholder={t("Please choose user")} />
              </Form.Item>
              <Form.Item
                label={t("Google review link")}
                name="googleReviewLink"
              >
                <Input placeholder={t("Enter google review link")} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label={t("Rating star")} name="ratingStar">
                <Rate />
              </Form.Item>
              <Form.Item label={t("Avatar")} name="avatar">
                <AvatarUploader
                  data={imageUrl || undefined}
                  placeholder="Choose avatar"
                />
              </Form.Item>
              <Form.Item label={t("Images")} name="images">
                <ImagesUploader
                  data={imageUrls || undefined}
                  placeholder="Chose images"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <BottomActionButtons backUrl="/store" onSubmit={handleSubmit} />
    </>
  );
};
export default StoreAction;

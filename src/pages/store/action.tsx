/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Rate,
  TimePicker,
  Select,
  Button,
  Typography,
  Space,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  TikTokOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
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
import PackageSelect from "../../components/PackageSelect";
import BankSelect from "../../components/BankSelect";
import { DeeplinkApi } from "../../apis/catalog/deeplink";
import queryString from "query-string";
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

  const { data: deeplink, refetch: refetchDeeplink } = useQuery({
    queryKey: ["deeplinkDetail", params.id],
    queryFn: async () => {
      const res: any = await DeeplinkApi.getDetail(
        queryString.stringify({ id: params.id, type: "store" })
      );
      return res?.data || {};
    },
    enabled: !!params.id,
  });
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
        email: data.email || "",
        description: data.description || "",
        servicePackageId: data.servicePackageId || null,
        bankIds: data.bankIds || null,
        socialNetworks: data.socialNetworks || null,
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values: any) => {
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
      images:
        values.images.filter(
          (item: any): item is File => item instanceof File
        ) || [],
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
  const generateLink = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return await DeeplinkApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        refetchDeeplink();
      } else toast.error(t(res.message));
    },
  });
  const createDeeplink = () => {
    const payload: any = {
      type: "store",
      androidLink: `intent://store-detail/${params.id}#Intent;package=com.nas.nas_mobile;scheme=nasshine;end`,
      iosLink: `nasshine://store-detail/${params.id}`,
      targetId: params.id,
      webFallback: `https://nasshine.com/${params.id}`,
    };
    if (params.id) {
      generateLink.mutate(payload);
    }
  };
  const socialNetworkOptions = [
    { label: "Facebook", value: 1, icon: <FacebookOutlined /> },
    { label: "Instagram", value: 2, icon: <InstagramOutlined /> },
    { label: "TikTok", value: 3, icon: <TikTokOutlined /> }, // custom icon
    { label: "YouTube", value: 4, icon: <YoutubeOutlined /> },
    { label: "Twitter", value: 5, icon: <TwitterOutlined /> },
    { label: "LinkedIn", value: 6, icon: <LinkedinOutlined /> },
    { label: "Website", value: 7, icon: <GlobalOutlined /> },
  ];
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
                  onChange={(selectedValue: any, merchant: any) => {
                    if (selectedValue != data?.merchantId) {
                      form.setFieldsValue({ brandId: null });
                    }
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
                label={t("Email")}
                name="email"
                rules={[
                  {
                    required: true,
                    message: t("Please enter email!"),
                  },
                  {
                    type: "email",
                    message: t("Invalid email"),
                  },
                ]}
              >
                <Input placeholder={t("Enter email")} />
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
              <Form.Item label={t("Banks")} name="bankIds">
                <BankSelect
                  mode={"multiple"}
                  placeholder={t("Please choose bank")}
                />
              </Form.Item>
              <Form.Item label={t("Description")} name={"description"}>
                <Input.TextArea rows={5} placeholder={t("Enter description")} />
              </Form.Item>
              {params.id && (
                <>
                  <Form.Item label={t("Deeplink")} name="deeplink">
                    <Space.Compact style={{ width: "100%" }}>
                      <Input
                        placeholder={t("Enter deeplink")}
                        value={deeplink?.shortLink || ""}
                        disabled
                      />
                      <Button
                        type="primary"
                        disabled={!!deeplink?.shortLink}
                        onClick={createDeeplink}
                      >
                        {t("Create link")}
                      </Button>
                    </Space.Compact>
                  </Form.Item>

                  {deeplink?.shortLink && (
                    <Form.Item label={t("QR Code")}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                          deeplink.shortLink
                        )}`}
                        alt="QR Code"
                        style={{
                          width: 150,
                          height: 150,
                          border: "1px solid #ccc",
                        }}
                      />
                    </Form.Item>
                  )}
                </>
              )}
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label={t("Package")} name="servicePackageId">
                <PackageSelect placeholder={t("Please choose package")} />
              </Form.Item>
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
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            {t("SocialNetwork")}
          </Typography.Title>
          <Form.List name="socialNetworks">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row gutter={8} key={key} style={{ width: "100%" }}>
                    {/* Select + Name */}
                    <Col xs={24} md={12}>
                      <Row gutter={8}>
                        {/* Select */}
                        <Col xs={24} md={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "icon"]}
                            rules={[
                              {
                                required: true,
                                message: t("Please select social network!"),
                              },
                            ]}
                          >
                            <Select
                              placeholder="Select"
                              optionLabelProp="label"
                            >
                              {socialNetworkOptions.map((opt) => (
                                <Select.Option
                                  key={opt.value}
                                  value={opt.value}
                                  label={opt.label}
                                >
                                  {opt.icon} {opt.label}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        {/* Name */}
                        <Col xs={24} md={16}>
                          <Form.Item
                            {...restField}
                            name={[name, "name"]}
                            rules={[
                              {
                                required: true,
                                message: t("Please enter name!"),
                              },
                            ]}
                          >
                            <Input placeholder="Enter Facebook, YouTube, TikTok..." />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    {/* URL */}
                    <Col xs={24} lg={12}>
                      <Space.Compact style={{ width: "100%" }}>
                        <Form.Item
                          {...restField}
                          name={[name, "url"]}
                          style={{ flex: 1, marginBottom: 0 }} // ép full và bỏ margin
                          rules={[
                            {
                              required: true,
                              message: t("Please enter url!"),
                            },
                            {
                              validator: (_, value) => {
                                if (!value || /^https?:\/\/.+$/.test(value)) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    t("URL must start with http:// or https://")
                                  )
                                );
                              },
                            },
                          ]}
                        >
                          <Input placeholder="Enter url" />
                        </Form.Item>
                        <Button
                          danger
                          type="text"
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                        />
                      </Space.Compact>
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    block
                  >
                    Add Social Network
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
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

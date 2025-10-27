/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  TimePicker,
  Select,
  Typography,
  Divider,
  DatePicker,
  Button,
  Switch,
  Space,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { MerchantApi } from "../../apis/catalog/merchant";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { buildFormData } from "../../utils/common/buildFormData";
import TopActionButtons from "../../components/common/TopActionButtons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AvatarUploader from "../../components/AvatarUploader";
import ImagesUploader from "../../components/ImagesUploader";
import { validatePhoneNumber } from "../../utils/common/validate";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import ModalFormBrand from "../../components/ModalFormBrand";
const weekdayOffMerchant = [
  {
    label: "Monday",
    value: 1,
  },
  {
    label: "Tuesday",
    value: 2,
  },
  {
    label: "Wednesday",
    value: 3,
  },
  {
    label: "Thursday",
    value: 4,
  },
  {
    label: "Friday",
    value: 5,
  },
  {
    label: "Saturday",
    value: 6,
  },
  {
    label: "Sunday",
    value: 7,
  },
];
const MerchantActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [linkUrls, setLinkUrls] = useState([]);
  const [isAvatar, setIsAvatar] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [brands, setBrands] = useState<any>([]);
  const [selectedBrand, setSelectedBrand] = useState<any>({});
  const { data } = useQuery({
    queryKey: ["merchantDetail", params.id],
    queryFn: async () => {
      const res: any = await MerchantApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && data) {
      setImageUrls(data.imageUrls);
      setImageUrl(data.logo);
      setLinkUrls(data.imageUrls);
      setBrands(
        data?.brands.map((item: any) => ({
          name: item.name,
          logoLink: item.logo,
          logo: item.logo,
        }))
      );
      form.setFieldsValue({
        name: data.name || "",
        shortName: data.shortName || "",
        endTime: data.endTime ? dayjs(data.endTime, "HH:mm") : null,
        startTime: data.startTime ? dayjs(data.startTime, "HH:mm") : null,
        address: data.address || "",
        taxCode: data.taxCode || "",
        zaloOA: data.zaloOA || "",
        weekdayOffs: data.weekdayOffs || "",
        contractDate: data.contractDate
          ? dayjs(data.contractDate, "YYYY-MM-DD")
          : null,
        contractNumber: data.contractNumber || null,
        images: data.imageUrls || null,
        servicePadkageId: data.servicePadkageId ?? null,
        represent: data.represent || null,
        phoneNumber: data.phoneNumber || null,
        email: data.email || null,
        contactPhoneNumber: data.contactPhoneNumber || "",
        fanpage: data.fanpage || "",
        website: data.website || "",
        deploymentDate: data.deploymentDate
          ? dayjs(data.deploymentDate, "YYYY-MM-DD")
          : null,
        isActive: data.isActive ?? true,
        country: data.country || "",
      });
    }
  }, [data, form, params.id]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      brands.forEach((item: any, index: number) => {
        formD.append(`brands[${index}].name`, item.name);
        formD.append(`brands[${index}].logoLink`, item.logoLink);
        if (item.logo instanceof File) {
          formD.append(`brands[${index}].logo`, item.logo);
        }
      });
      return params.id
        ? await MerchantApi.update(params.id as any, formD)
        : await MerchantApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/merchant");
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  const onFinish = (values: any) => {
    const payload = {
      ...values,
      servicePadkageId: values.servicePadkageId ?? null,
      brands: brands,
      isActive: values.isActive ?? true,
      contractDate: values.contractDate
        ? values.contractDate.toISOString() // ISO 8601 format in UTC
        : null,
      deploymentDate: values.contractDate
        ? values.contractDate.toISOString() // ISO 8601 format in UTC
        : null,
      images:
        values?.images?.filter(
          (item: any): item is File => item instanceof File
        ) || [],
    };
    if (params.id) {
      payload.id = params.id;
      payload.linkUrls = linkUrls?.filter(
        (item: any) => typeof item === "string"
      );
      payload.isAvatar = isAvatar;
    }
    mutation.mutate(payload);
  };
  const handleSubmit = () => {
    form.submit();
  };
  const handleBrandAdd = () => {
    setOpenModal(true);
  };
  const onSubmitBrand = (values: any) => {
    if (selectedBrand?.id) {
      setBrands((prev: any) =>
        prev.map((b: any) =>
          b.id === selectedBrand.id ? { ...b, ...values } : b
        )
      );
    } else {
      const maxId =
        brands.length > 0 ? Math.max(...brands.map((b: any) => b.id)) : 0;
      const newBrand = {
        ...values,
        id: maxId + 1,
      };
      setBrands([...brands, newBrand]);
    }
    setSelectedBrand({});
    setOpenModal(false);
  };

  const handleBrandEdit = (index: number) => {
    const brandToEdit = brands[index];
    setSelectedBrand(brandToEdit);
    setOpenModal(true);
  };
  const handleBrandDelete = (index: number) => {
    setBrands((prev: any) => prev?.filter((_: any, i: any) => i !== index));
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
            {params?.id ? t("Update merchant") : t("Create merchant")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/merchant"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(
              accesses,
              "update",
              "merchant"
            )}
          />
        </Col>
      </Row>
      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Typography.Title level={4} style={{ marginTop: 0 }}>
            {t("Merchant Information")}
          </Typography.Title>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("Merchant name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("Please enter merchant name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter merchant name")} />
              </Form.Item>
              <Form.Item
                label={t("Country")}
                name="country"
                rules={[
                  {
                    required: true,
                    message: t("Please enter country name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter country name")} />
              </Form.Item>
              <Form.Item
                label={t("Tax code")}
                name="taxCode"
                rules={[
                  {
                    required: true,
                    message: t("Please enter tax code!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter tax code")} />
              </Form.Item>
              <Form.Item
                label={t("Address")}
                name="address"
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
                label={t("Website")}
                name="website"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      try {
                        new URL(value);
                        return Promise.resolve();
                      } catch {
                        return Promise.reject(new Error(t("Invalid website")));
                      }
                    },
                  },
                ]}
              >
                <Input placeholder={t("Enter website")} />
              </Form.Item>
              <Form.Item label={t("Zalo OA")} name="zaloOA">
                <Input placeholder={t("Enter zalo OA")} />
              </Form.Item>
              <Form.Item label={t("Fanpage")} name="fanpage">
                <Input placeholder={t("Enter fanpage")} />
              </Form.Item>
              <Row gutter={15}>
                <Col span={12}>
                  <Form.Item
                    label={t("Start Time")}
                    name="startTime"
                    rules={[
                      {
                        required: true,
                        message: t("Please enter start time!"),
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const closeTime = getFieldValue("endTime");
                          if (!value || !closeTime) return Promise.resolve();

                          if (dayjs(value).isAfter(dayjs(closeTime))) {
                            return Promise.reject(
                              new Error(
                                t("Start time must be before end time!")
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
                      placeholder={t("Enter end time")}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={t("End Time")}
                    name="endTime"
                    rules={[
                      {
                        required: true,
                        message: t("Please enter end time!"),
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const openTime = getFieldValue("startTime");
                          if (!value || !openTime) return Promise.resolve();

                          if (dayjs(value).isBefore(dayjs(openTime))) {
                            return Promise.reject(
                              new Error(t("End time must be after start time!"))
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
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label={t("Short name")} name="shortName">
                <Input placeholder={t("Enter short namee")} />
              </Form.Item>
              <Form.Item
                label={t("Contact phone number")}
                name="contactPhoneNumber"
                rules={[
                  {
                    validator: validatePhoneNumber,
                  },
                ]}
              >
                <Input placeholder={t("Enter phone")} />
              </Form.Item>
              <Form.Item label={t("Weekdays off (if any)")} name="weekdayOffs">
                <Select
                  placeholder={t("Choose weekdays off")}
                  allowClear
                  mode="multiple"
                  options={weekdayOffMerchant}
                />
              </Form.Item>
              <Form.Item label={t("Logo merchant")} name="logo">
                <AvatarUploader
                  data={imageUrl || undefined}
                  placeholder="Choose logo"
                  onChange={() => {
                    setIsAvatar(true);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Typography.Title level={4} style={{ marginTop: 0 }}>
            {t("Contract Information")}
          </Typography.Title>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label={t("Contract date")} name="contractDate">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder={t("Choose date")}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
              <Form.Item label={t("Deployment date")} name="deploymentDate">
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder={t("Choose date")}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    const contractDate = form.getFieldValue("contractDate");
                    return contractDate
                      ? current && current.isBefore(contractDate, "day")
                      : false;
                  }}
                  disabled={!Form.useWatch("contractDate", form)}
                />
              </Form.Item>
              <Form.Item label={t("Contract number")} name="contractNumber">
                <Input placeholder={t("Enter contract number")} />
              </Form.Item>
              <Form.Item label={t("Service package")} name="servicePadkageId">
                <Select placeholder={t("Choose service package")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("File contract (File PDF or Image)")}
                name="images"
              >
                <ImagesUploader
                  value={imageUrls || undefined}
                  placeholder="Chose file"
                  onChange={(e) => {
                    setLinkUrls(e);
                    form.setFieldsValue({ images: e });
                  }}
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
          <Divider />
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 16 }}
          >
            <Col>
              <Typography.Title level={4} style={{ margin: 0 }}>
                {t("Brand Information")}
              </Typography.Title>
            </Col>
            <Col>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={handleBrandAdd}
              >
                {t("Add Brand")}
              </Button>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            {brands.map((brand: any, index: number) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  cover={
                    <img
                      alt={brand.name}
                      src={
                        typeof brand.logo === "string"
                          ? brand.logo
                          : URL.createObjectURL(brand.logo)
                      }
                      style={{ height: 150, objectFit: "cover" }}
                    />
                  }
                  actions={[
                    <EditOutlined
                      key="edit"
                      onClick={() => handleBrandEdit(index)}
                    />,
                    <DeleteOutlined
                      key="delete"
                      onClick={() => handleBrandDelete(index)}
                    />,
                  ]}
                >
                  <Card.Meta
                    title={brand.name}
                    description={brand.description}
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <Divider />
          <Typography.Title level={4} style={{ marginTop: 0 }}>
            {t("Representative Information")}
          </Typography.Title>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={8} lg={8}>
              <Form.Item
                label={"Represent"}
                name={"represent"}
                rules={[
                  { required: true, message: t("Please enter represent!") },
                ]}
              >
                <Input placeholder={t("Entter represent")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <Form.Item
                label={"Phone number"}
                name={"phoneNumber"}
                rules={[
                  { required: true, message: t("Please enter phone numer!") },
                  {
                    validator: validatePhoneNumber,
                  },
                ]}
              >
                <Input placeholder={t("Entter phone number")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <Form.Item
                label={"Email"}
                name={"email"}
                rules={[
                  { required: true, message: t("Please enter email!") },
                  {
                    type: "email",
                    message: t("Invalid email"),
                  },
                ]}
              >
                <Input placeholder={t("Entter email")} />
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
        backUrl="/merchant"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(accesses, "update", "merchant")}
      />
      <ModalFormBrand
        title={selectedBrand?.id ? "Update" : "Create"}
        openModal={openModal}
        setOpenModal={setOpenModal}
        onSubmit={onSubmitBrand}
        data={selectedBrand}
      />
    </>
  );
};
export default MerchantActions;

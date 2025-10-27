/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserMerchantApi } from "../../apis/auth/userMerchant";
import { buildFormData } from "../../utils/common/buildFormData";
import { validatePhoneNumber } from "../../utils/common/validate";
import dayjs from "dayjs";
import AvatarUploader from "../../components/AvatarUploader";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import GroupSelect from "../../components/GroupSelect";
import StoreSelect from "../../components/StoreSelect";
const MerchantUserActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAvatar, setIsAvatar] = useState(false);
  const { data } = useQuery({
    queryKey: ["userDetail", params.id],
    queryFn: async () => {
      const res: any = await UserMerchantApi.getById(params.id as string);
      return res?.data || {};
    },
    enabled: !!params.id,
  });

  useEffect(() => {
    if (params.id && data) {
      setImageUrl(data.avatar);
      form.setFieldsValue({
        fullName: data.fullName || "",
        isActive: data.isActive ?? true,
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        dateOfBirth: data.dateOfBirth
          ? dayjs(data.dateOfBirth, "YYYY-MM-DD")
          : null,
        gender: data.gender ?? null,
        street: data.street || "",
        wardId: data.wardId || null,
        districtId: data.districtId || null,
        cityId: data.cityId || null,
        groupIds: data.groupIds || null,
        storeIds: data.storeIds || null,
        isOwner: data.isOwner || false,
      });
    }
  }, [data, form, params.id]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await UserMerchantApi.update(params.id as string, formD)
        : await UserMerchantApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/usermerchant");
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
            {params?.id ? t("Update user merchant") : t("Create user merchant")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/usermerchant"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(
              accesses,
              "update",
              "usermerchant"
            )}
          />
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="Email" name="email">
                <Input placeholder={t("Enter email")} />
              </Form.Item>
              {!params.id && (
                <Form.Item
                  label={t("Password")}
                  name="password"
                  rules={[
                    { required: true, message: t("Please enter password") },
                  ]}
                >
                  <Input.Password
                    placeholder={t("Enter password")}
                    disabled={!!params.id}
                  />
                </Form.Item>
              )}
              <Form.Item
                label={t("Full name")}
                name="fullName"
                rules={[
                  { required: true, message: t("Please enter full name!") },
                ]}
              >
                <Input placeholder={t("Enter full name")} />
              </Form.Item>
              <Form.Item
                label={t("Phone number")}
                name="phoneNumber"
                rules={[
                  { required: true, message: t("Please enter phone number") },
                  {
                    validator: validatePhoneNumber,
                  },
                ]}
              >
                <Input placeholder={t("Enter phone number")} />
              </Form.Item>
              <Form.Item
                label={t("Birthday")}
                name="dateOfBirth"
                rules={[
                  { required: true, message: t("Please enter birthday!") },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder={t("Enter birthday")}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
              <Form.Item
                label={t("Gender")}
                name="gender"
                rules={[{ required: true, message: t("Please enter gender!") }]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  allowClear
                  placeholder={t("Choose gender")}
                >
                  <Select.Option value={1}>{t("Male")}</Select.Option>
                  <Select.Option value={2}>{t("Female")}</Select.Option>
                  <Select.Option value={3}>{t("Other")}</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label={t("Group")} name={"groupIds"}>
                <GroupSelect
                  roleType={1}
                  mode="multiple"
                  placeholder={t("Choose group")}
                />
              </Form.Item>
              <Form.Item label={t("Store")} name={"storeIds"}>
                <StoreSelect mode="multiple" placeholder={t("Choose group")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label={t("Avatar")} name="avatar">
                <AvatarUploader
                  placeholder={t("Avatar")}
                  data={imageUrl || undefined}
                  onChange={() => setIsAvatar(true)}
                />
              </Form.Item>
              <Form.Item label={t("City")} name="cityId">
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("Choose city")}
                ></Select>
              </Form.Item>
              <Form.Item label={t("District")} name="districtId">
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("Choose district")}
                ></Select>
              </Form.Item>
              <Form.Item label={t("Ward")} name="wardId">
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("Choose ward")}
                ></Select>
              </Form.Item>
              <Space align="center">
                <Form.Item name="isOwner" valuePropName="checked" noStyle>
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={false}
                  />
                </Form.Item>
                <span>{t("Owner")}</span>
              </Space>
            </Col>
            <Col span={24}>
              <Form.Item label={t("Address")} name="street">
                <Input.TextArea rows={4} placeholder={t("Enter address")} />
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
      <TopActionButtons
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
        backUrl="/usermerchant"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(
          accesses,
          "update",
          "usermerchant"
        )}
      />
    </>
  );
};

export default MerchantUserActions;

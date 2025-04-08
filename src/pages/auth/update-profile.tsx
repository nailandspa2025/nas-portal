/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Space,
} from "antd";
import TopActionButtons from "../../components/common/TopActionButtons";
import { validatePhoneNumber } from "../../utils/common/validate";
import AvatarUploader from "../../components/AvatarUploader";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import BottomActionButtons from "../../components/common/BottomActionButtons";
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import { AuthApi } from "../../apis/auth/auth";
import { buildFormData } from "../../utils/common/buildFormData";
import { toast } from "react-toastify";
import { userLoadded } from "../../redux/actions/user.actions";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.auth.user);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAvatar, setIsAvatar] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (user) {
      setImageUrl(user.avatar || null);
      form.setFieldsValue({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth
          ? dayjs(user.dateOfBirth, "YYYY-MM-DD")
          : null,
        gender: user.gender ?? 1,
        street: user.street || "",
        isActive: user.isActive ?? false,
      });
    }
  }, [user, form]);

  const updateProfile = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return await AuthApi.updateProfile(user.id, formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        dispatch(userLoadded(res.data));
        navigate("/profile");
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  const onFinish = (values: any) => {
    const payload = {
      ...values,
      id: user.id,
      isAvatar: isAvatar,
    };
    updateProfile.mutate(payload);
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
          <div className="custom-title">{t("Update profile")}</div>
        </Col>
        <Col flex="auto">
          <TopActionButtons backUrl="/profile" onSubmit={handleSubmit} />
        </Col>
      </Row>
      <Card style={{ padding: "10px 20px" }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
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
                  { validator: validatePhoneNumber },
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
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item
                label={t("Gender")}
                name="gender"
                rules={[{ required: true, message: t("Please enter gender!") }]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("Choose gender")}
                >
                  <Select.Option value={1}>{t("Male")}</Select.Option>
                  <Select.Option value={2}>{t("Female")}</Select.Option>
                  <Select.Option value={3}>{t("Other")}</Select.Option>
                </Select>
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
                  />
                </Form.Item>
                <span>{t("Active")}</span>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      <BottomActionButtons backUrl="/profile" onSubmit={handleSubmit} />
    </>
  );
};

export default UpdateProfile;

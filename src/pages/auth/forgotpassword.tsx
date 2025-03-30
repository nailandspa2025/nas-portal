/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AuthApi } from "../../apis/auth/auth";
import { toast } from "react-toastify";
import { useState } from "react";
const { Title, Text } = Typography;
const Forgotpassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const regainPassword = useMutation({
    mutationFn: async (values) => {
      return await AuthApi.forgotPassword(values);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t(res.message));
        navigate("/resetpassword");
      } else {
        toast.error(t(res.message));
      }
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const onFinish = (values: any) => {
    regainPassword.mutate(values);
  };
  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={3} className="login-title">
          <span style={{ fontSize: 20 }}>{t("Nas Portal")}</span>
        </Title>
        <Text
          type="secondary"
          style={{ paddingBottom: 20, textAlign: "center", display: "block" }}
        >
          {t("Enter your email to retrieve your password")}
        </Text>
        <Form name="login-form" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: t("Please enter email!"),
              },
              { type: "email", message: t("Invalid email!") },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder={t("Email")} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {t("Retrieve password")}
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ display: "block", textAlign: "center" }}>
          <Button type="link" onClick={() => navigate("/sign-up")}>
            {t("Back to login page")}
          </Button>
        </Text>
      </Card>
    </div>
  );
};

export default Forgotpassword;

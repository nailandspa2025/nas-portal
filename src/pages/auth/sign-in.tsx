/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Button, Card, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthApi } from "../../apis/auth/auth";
import { useMutation } from "@tanstack/react-query";
import { LoginPayload, LoginResponse } from "../../apis/auth/interface";
import { userLoggedIn } from "../../redux/actions/user.actions";
// import { getDeviceInfo } from "../../firebase/firebaseConfig";
// import { AppAccountApi } from "../../apis/auth/appaccount";

import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const SignIn = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signInMutation = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (request: LoginPayload) => AuthApi.login(request),
  });
  // const trackingDevice = useMutation({
  //   mutationFn: async () => {
  //     const payload = await getDeviceInfo();
  //     return AppAccountApi.trackingDevice(payload);
  //   },
  // });
  const onFinish = async (values: LoginPayload) => {
    signInMutation.mutate(values, {
      onSuccess: (res: any) => {
        if (res.succeeded) {
          dispatch(userLoggedIn(res));
          toast.success(t("Login successful!"));
          navigate("/");
          //trackingDevice.mutate();
          return;
        } else {
          toast.error(res.message);
        }
      },
      onError: () => toast.error(t("Incorrect username and password!")),
    });
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
          {t("Enter account & password to login")}
        </Text>
        <Form name="login-form" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: t("Please enter email or username!"),
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t("Email or username")}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: t("Please enter password !") }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("Password")}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t("Login")}
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ display: "block", textAlign: "center" }}>
          <Button type="link" onClick={() => navigate("/forgotpassword")}>
            {t("Forgot Password?")}
          </Button>
        </Text>
      </Card>
    </div>
  );
};

export default SignIn;

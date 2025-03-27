/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Button, Card, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthApi } from "../../apis/auth/auth";
import { useMutation } from "@tanstack/react-query";
import { LoginPayload, LoginResponse } from "../../apis/auth/interface";
import { userLoggedIn } from "../../redux/actions/user.actions";
import { getDeviceInfo } from "../../firebase/firebaseConfig";

import { useDispatch } from "react-redux";
import { AppAccountApi } from "../../apis/auth/appaccount";
import { useTranslation } from "react-i18next";

const { Title } = Typography;
const SignIn = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signInMutation = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (request: LoginPayload) => AuthApi.login(request),
  });
  const trackingDevice = useMutation({
    mutationFn: async () => {
      const payload = await getDeviceInfo();
      return AppAccountApi.trackingDevice(payload);
    },
  });
  const onFinish = async (values: LoginPayload) => {
    signInMutation.mutate(values, {
      onSuccess: (res: any) => {
        if (res.succeeded) {
          dispatch(userLoggedIn(res));
          toast.success(t("Login successful!"));
          navigate("/dashboard");
          trackingDevice.mutate();
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
          Đăng nhập
        </Title>
        <Form name="login-form" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email hoặc tài khoản!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email hoặc Tài khoản"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;

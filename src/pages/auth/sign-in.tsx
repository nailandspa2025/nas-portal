import { Form, Input, Button, Card, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthApi } from "../../apis/auth/auth";
import { useMutation } from "@tanstack/react-query";
import { LoginPayload, LoginResponse } from "../../apis/auth/interface";
import { userLoggedIn } from "../../redux/actions/user.actions";
//import { STORAGE_KEY } from "../../constants/application.constant";
import { useDispatch } from "react-redux";
const { Title } = Typography;
const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signInMutation = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (request: LoginPayload) => AuthApi.login(request),
  });
  const onFinish = (values: LoginPayload) => {
    //window.location.replace("/");
    signInMutation.mutate(values, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (res: any) => {
        if (res.succeeded) {
          dispatch(userLoggedIn(res));
          toast.success("Đăng nhập thành công!");
          navigate("/dashboard");
          return;
        } else {
          toast.error(res.message);
        }
      },
      onError: () => toast.error("Tên đăng nhập và mật khẩu không đúng!"),
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

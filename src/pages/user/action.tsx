/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Image,
  Switch,
  Upload,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthApi } from "../../apis/auth/auth";
import { buildFormData } from "../../utils/common/buildFormData";
import { validatePhoneNumber } from "../../utils/common/validate";
import dayjs from "dayjs";
const UserAction = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { data = { data: {} }, isLoading } = useQuery({
    queryKey: ["userDetail", params.id],
    queryFn: () => AuthApi.detail(params.id as string),
    enabled: !!params.id,
  });
  useEffect(() => {
    if ((data as Record<string, any>)?.data?.avatar) {
      setImageUrl((data as Record<string, any>)?.data?.avatar);
    }
  }, [data]);
  const handleUpload = (info: any) => {
    const file = info.file;
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Chỉ được chọn file ảnh!");
      return;
    }
    form.setFieldsValue({ avatar: file });
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);
  };
  const handleRemoveImage = () => {
    setImageUrl(null);
    form.setFieldsValue({ avatar: undefined });
  };
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await AuthApi.update(params.id as string, formD)
        : await AuthApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success("Lưu thành công");
        navigate("/users");
      } else toast.error(res.message);
    },
    onError: () => {
      toast.error("Xảy ra lỗi");
    },
  });
  const onFinish = (values: any) => {
    const payload = {
      ...values,
    };
    if (params.id) payload.id = params.id;
    mutation.mutate(payload);
  };
  const initialValues = {
    fullName: (data as Record<string, any>)?.data?.fullName || "",
    isActive: (data as Record<string, any>)?.data?.isActive ?? true,
    email: (data as Record<string, any>)?.data?.email || "",
    phoneNumber: (data as Record<string, any>)?.data?.phoneNumber || "",
    dateOfBirth: (data as Record<string, any>)?.data?.dateOfBirth
      ? dayjs((data as Record<string, any>)?.data?.dateOfBirth, "YYYY-MM-DD")
      : null,
    gender: (data as Record<string, any>)?.data?.gender ?? null,
    street: (data as Record<string, any>)?.data?.street || "",
    wardId: (data as Record<string, any>)?.data?.wardId || null,
    districtId: (data as Record<string, any>)?.data?.districtId || null,
    cityId: (data as Record<string, any>)?.data?.cityId || null,
  };
  console.log("Gender from API:", (data as Record<string, any>)?.data?.gender);
  return (
    <>
      {!isLoading && (
        <Card>
          <Form
            layout="vertical"
            form={form}
            initialValues={initialValues}
            onFinish={onFinish}
          >
            <Row>
              <Space
                wrap
                style={{
                  width: "100%",
                  justifyContent: "right",
                }}
              >
                <Button type="default" onClick={() => navigate("/users")}>
                  Quay lại
                </Button>
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Space>
            </Row>
            <Row gutter={32}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email!",
                      type: "email",
                    },
                  ]}
                >
                  <Input placeholder="Nhập email" disabled={!!params.id} />
                </Form.Item>
                {!params.id && (
                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập tài khoản!" },
                    ]}
                  >
                    <Input.Password
                      placeholder="Nhập mật khẩu"
                      disabled={!!params.id}
                    />
                  </Form.Item>
                )}
                <Form.Item
                  label="Tên đầy đủ"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đầy đủ!" },
                  ]}
                >
                  <Input placeholder="Nhập tên đầy đủ" />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      validator: validatePhoneNumber,
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item
                  label="Ngày sinh"
                  name="dateOfBirth"
                  rules={[{ required: true, message: "Vui chọn ngày sinh!" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Ngày sinh"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
                <Form.Item
                  label="Giới tính"
                  name="gender"
                  rules={[{ required: true, message: "Vui chọn giới tính!" }]}
                >
                  <Select
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="Giới tính"
                  >
                    <Select.Option value={0}>Nam</Select.Option>
                    <Select.Option value={1}>Nữ</Select.Option>
                    <Select.Option value={2}>Khác</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item label="Ảnh đại diện" name="avatar">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Logo doanh nghiệp"
                        width={"100%"}
                        height={150}
                        style={{
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px solid #ddd",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: 150,
                          borderRadius: "8px",
                          backgroundColor: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px dashed #ccc",
                          color: "#888",
                        }}
                      >
                        Ảnh đại diện
                      </div>
                    )}

                    <Space
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <Upload
                        name="logo"
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={handleUpload}
                        accept="image/png, image/jpeg, image/gif"
                      >
                        <Button type="primary" ghost icon={<PlusOutlined />}>
                          Chọn ảnh
                        </Button>
                      </Upload>
                      {imageUrl && (
                        <Button
                          type="primary"
                          danger
                          ghost
                          icon={<DeleteOutlined />}
                          onClick={handleRemoveImage}
                        >
                          Xóa ảnh
                        </Button>
                      )}
                    </Space>
                  </div>
                </Form.Item>
                <Form.Item label="Tỉnh/thành phố" name="cityId">
                  <Select
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="Tỉnh/thành phố"
                  ></Select>
                </Form.Item>
                <Form.Item label="Quận/huyện" name="districtId">
                  <Select
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="Quận/huyện"
                  ></Select>
                </Form.Item>
                <Form.Item label="Phường/xã" name="wardId">
                  <Select
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="Phường/xã"
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Địa chỉ" name="street">
                  <Input.TextArea rows={4} placeholder="Nhập địa chỉ" />
                </Form.Item>
                <Space align="center">
                  <Form.Item name="isActive" valuePropName="checked" noStyle>
                    <Switch
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      defaultChecked={true}
                    />
                  </Form.Item>
                  <span>Hoạt động</span>
                </Space>
              </Col>
            </Row>
            <Space
              wrap
              style={{
                width: "100%",
                justifyContent: "right",
                marginTop: "3.5rem",
                paddingBottom: "1rem",
              }}
            >
              <Button type="default" onClick={() => navigate("/users")}>
                Quay lại
              </Button>
              <Button type="primary" htmlType="submit">
                Luu
              </Button>
            </Space>
          </Form>
        </Card>
      )}
    </>
  );
};

export default UserAction;

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Col,
  Row,
  Form,
  Input,
  Space,
  Switch,
  InputNumber,
  Select,
} from "antd";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { checkAccessRight } from "../../utils/common/accessUtils";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { buildFormData } from "../../utils/common/buildFormData";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DropdownApi } from "../../apis/dropdown/dropdown";
import RemoteSelect from "../../components/RemoteSelect";
import { ReminderApi } from "../../apis/order/reminder";
const ConfigReminderAction = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data } = useQuery({
    queryKey: ["config-reminder-detail", params.id],
    queryFn: async () => {
      const res: any = await ReminderApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && data) {
      form.setFieldsValue({
        name: data.name || "",
        isActive: data.isActive || true,
        storeId: data.storeId || null,
        beforeMinute: data.beforeMinute || null,
        channel: data.channel || null,
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await ReminderApi.update(params.id as any, formD)
        : await ReminderApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/config-reminder");
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  const handleSubmit = () => {
    form.submit();
  };
  const onFinish = (values: any) => {
    const payload = {
      ...values,
      isActive: values.isActive ?? true,
    };
    if (params.id) {
      payload.id = params.id;
    }
    mutation.mutate(payload);
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
            {params?.id
              ? t("Update config reminder")
              : t("Create config reminder")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/config-reminder"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(
              accesses,
              "update",
              "config-reminder",
            )}
          />
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24}>
              <Form.Item
                label={t("Name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("Please enter reminder name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter reminder name")} />
              </Form.Item>
              <Form.Item
                label={t("Store")}
                name="storeId"
                rules={[
                  {
                    required: true,
                    message: t("Please select s!"),
                  },
                ]}
              >
                <RemoteSelect
                  placeholder={t("Select store")}
                  fetchList={DropdownApi.getStores}
                  fetchById={DropdownApi.getStoreById}
                  labelKey="storeName"
                  valueKey="id"
                />
              </Form.Item>
              <Form.Item
                label={t("Reminder before (minutes)")}
                name="beforeMinute"
                rules={[
                  {
                    required: true,
                    message: t("Please enter reminder before minutes!"),
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder={t("Enter Reminder")}
                />
              </Form.Item>
              <Form.Item
                label={t("Channel")}
                name="channel"
                rules={[
                  {
                    required: true,
                    message: t("Please select channel!"),
                  },
                ]}
              >
                <Select placeholder={t("Select channel")} showSearch allowClear>
                  <Select.Option value={3}>Notification</Select.Option>
                  <Select.Option value={1}>Email</Select.Option>
                </Select>
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
        backUrl="/config-reminder"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(
          accesses,
          "update",
          "config-reminder",
        )}
      />
    </>
  );
};
export default ConfigReminderAction;

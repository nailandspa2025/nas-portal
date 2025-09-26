import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
} from "antd";
import { useTranslation } from "react-i18next";
import RemoteSelect from "../../../components/RemoteSelect";
import { DropdownApi } from "../../../apis/dropdown/dropdown";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { buildFormData } from "../../../utils/common/buildFormData";
import { UpgradeApi } from "../../../apis/loyalty/upgrage";
import { toast } from "react-toastify";
import { useEffect } from "react";
const UpgradeAction = ({ programId, item, onChange }: any) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  useEffect(() => {
    if (item?.id && item) {
      form.setFieldsValue({
        name: item.name || "",
        process: item.process || null,
        standard: item.standard || null,
        tierId: item.tierId || null,
        isActive: item.isActive ?? true,
      });
    }
  }, [item?.id, form]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return item.id
        ? await UpgradeApi.update(item.id as string, formD)
        : await UpgradeApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        if (onChange) onChange(false);
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  const onFinish = (values: any) => {
    const payload = {
      ...values,
      programId: programId,
      isActive: values.isActive ?? true,
    };
    if (item?.id) payload.id = item.id;
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
            {item?.id ? t("Update upgrading") : t("Create upgrading")}
          </div>
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                label={t("Name")}
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: t("Please enter name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter name")} />
              </Form.Item>
              <Form.Item
                label={t("Process")}
                name={"process"}
                rules={[
                  {
                    required: true,
                    message: t("Please select process name!"),
                  },
                ]}
              >
                <Select placeholder={t("Select process")} showSearch allowClear>
                  <Select.Option value={1}>{t("Payment")}</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label={t("Standard")}
                name={"standard"}
                rules={[
                  {
                    required: true,
                    message: t("Please select standard name!"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("Enter standard")}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                label={t("Rank")}
                name={"tierId"}
                rules={[
                  {
                    required: true,
                    message: t("Please select rank name!"),
                  },
                ]}
              >
                <RemoteSelect
                  placeholder={t("Select rank name")}
                  fetchList={DropdownApi.getLoyaltyTiers}
                  fetchById={DropdownApi.getLoyaltyTierById}
                  labelKey={(item) => `${item.name}`}
                  valueKey="id"
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
        </Form>
      </Card>
      <Space
        wrap
        style={{
          width: "100%",
          justifyContent: "flex-end",
          marginTop: 20,
        }}
      >
        <Button
          type="default"
          style={{ background: "#FF1818", color: "#fff" }}
          onClick={() => onChange(false)}
        >
          {t("Cancel")}
        </Button>
        <Button
          type="default"
          onClick={() => handleSubmit()}
          style={{ background: "#1890FF", color: "#fff" }}
        >
          {t("Save")}
        </Button>
      </Space>
    </>
  );
};
export default UpgradeAction;

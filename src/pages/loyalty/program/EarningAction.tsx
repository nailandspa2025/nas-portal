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
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { buildFormData } from "../../../utils/common/buildFormData";
import { EarningApi } from "../../../apis/loyalty/earning";
const EarningAction = ({ programId, item, onChange }: any) => {
  console.log("item", item);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  useEffect(() => {
    if (item?.id && item) {
      form.setFieldsValue({
        name: item.name || "",
        rule: item.rule || null,
        amount: item.amount || null,
        point: item.point || null,
        tierId: item.tierId || null,
        groupId: item.groupId || null,
        isActive: item.isActive ?? true,
      });
    }
  }, [item, form]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return item.id
        ? await EarningApi.update(item.id as string, formD)
        : await EarningApi.create(formD);
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
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Point")}
                name={"point"}
                rules={[
                  {
                    required: true,
                    message: t("Please enter point!"),
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  placeholder={t("Enter point")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Amount")}
                name={"amount"}
                rules={[
                  {
                    required: true,
                    message: t("Please enter amount!"),
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  placeholder={t("Enter amount")}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("Tier")}
                name={"tierId"}
                rules={[
                  {
                    required: true,
                    message: t("Please select tier name!"),
                  },
                ]}
              >
                <RemoteSelect
                  placeholder={t("Select tier name")}
                  fetchList={DropdownApi.getLoyaltyTiers}
                  fetchById={DropdownApi.getLoyaltyTierById}
                  labelKey={(item) => `${item.name}`}
                  valueKey="id"
                />
              </Form.Item>
              <Form.Item
                label={t("Group")}
                name={"groupId"}
                rules={[
                  {
                    required: true,
                    message: t("Please select group name!"),
                  },
                ]}
              >
                <RemoteSelect
                  placeholder={t("Select group name")}
                  fetchList={DropdownApi.getLoyaltyGroups}
                  fetchById={DropdownApi.getLoyaltyGroupById}
                  labelKey={(item) => `${item.name}`}
                  valueKey="id"
                />
              </Form.Item>

              <Form.Item
                label={t("Reward Calculation")}
                name={"rule"}
                rules={[
                  {
                    required: true,
                    message: t("Please select reward calculation!"),
                  },
                ]}
              >
                <Select
                  placeholder={t("Select reward calculation")}
                  showSearch
                  allowClear
                >
                  <Select.Option value={1}>{t("Round up")}</Select.Option>
                  <Select.Option value={2}>{t("Round down")}</Select.Option>
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
export default EarningAction;

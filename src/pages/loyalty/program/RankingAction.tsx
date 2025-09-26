import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Switch,
} from "antd";
import { useTranslation } from "react-i18next";
import RemoteSelect from "../../../components/RemoteSelect";
import { DropdownApi } from "../../../apis/dropdown/dropdown";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { buildFormData } from "../../../utils/common/buildFormData";
import { TierApi } from "../../../apis/loyalty/ranking";
import { toast } from "react-toastify";
import { useEffect } from "react";
const RankingAction = ({ programId, item, onChange }: any) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (item?.id && item) {
      form.setFieldsValue({
        name: item.name || "",
        level: item.level || null,
        groupId: item.groupId || null,
        isActive: item.isActive ?? true,
      });
    }
  }, [item, form, item?.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return item.id
        ? await TierApi.update(item.id as string, formD)
        : await TierApi.create(formD);
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
            {item?.id ? t("Update ranking") : t("Create ranking")}
          </div>
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                label={t("Ranking name")}
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: t("Please enter ranking name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter ranking name")} />
              </Form.Item>
              <Form.Item
                label={t("Level")}
                name={"level"}
                rules={[
                  {
                    required: true,
                    message: t("Please enter level name!"),
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={t("Enter level")}
                />
              </Form.Item>
              <Form.Item label={t("Group")} name={"groupId"}>
                <RemoteSelect
                  placeholder={t("Select group name")}
                  fetchList={DropdownApi.getLoyaltyGroups}
                  fetchById={DropdownApi.getLoyaltyGroupById}
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
export default RankingAction;

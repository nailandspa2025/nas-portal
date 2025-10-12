/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Row, Form, Input, Space, Button, DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import RemoteSelect from "../../../components/RemoteSelect";
import { DropdownApi } from "../../../apis/dropdown/dropdown";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { buildFormData } from "../../../utils/common/buildFormData";
import { ProgramApi } from "../../../apis/loyalty/program";
import { toast } from "react-toastify";
const GeneralInfoAction = ({ item, onSaved }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isDraft, setIsDraft] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return item?.id
        ? await ProgramApi.update(item.id, formD)
        : await ProgramApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        if (onSaved) onSaved(res.data?.id);
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  useEffect(() => {
    if (item?.id && item) {
      form.setFieldsValue({
        name: item.name || "",
        isDraft: item.isDraft || false,
        pointSettingId: item.pointSettingId || null,
        startDate: item.startDate ? dayjs(item.startDate, "YYYY-MM-DD") : null,
        endDate: item.endDate ? dayjs(item.endDate, "YYYY-MM-DD") : null,
      });
    }
  }, [item?.id, form]);

  const handleSubmit = (type: boolean) => {
    setIsDraft(type);
    form.submit();
  };
  const onFinish = (values: any) => {
    const payload = { ...values, isDraft };
    if (item?.id) payload.id = item.id;
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
            {item?.id ? t("Update set points") : t("Create set points")}
          </div>
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                label={t("Program name")}
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: t("Please enter program name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter program name")} />
              </Form.Item>
              <Form.Item
                label={t("Selcet point")}
                name={"pointSettingId"}
                rules={[
                  {
                    required: true,
                    message: t("Please choose point!"),
                  },
                ]}
              >
                <RemoteSelect
                  placeholder={t("Select point")}
                  fetchList={DropdownApi.getLoyaltyPoints}
                  fetchById={DropdownApi.getUserById}
                  //fetchByIds={DropdownApi.getUserByIds}
                  labelKey={(item) => `${item.name}`}
                  valueKey="id"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("Start date")}
                name="startDate"
                rules={[
                  { required: true, message: t("Please enter start date!") },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder={t("Enter start date")}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End date"
                name="endDate"
                dependencies={["startDate"]}
                rules={[
                  { required: true, message: "Please enter end date!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const start = getFieldValue("startDate");
                      if (!value || !start) return Promise.resolve();
                      if (dayjs(value).isBefore(dayjs(start), "day")) {
                        return Promise.reject(
                          new Error(
                            "End date cannot be earlier than start date!"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
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
          onClick={() => navigate("/loyalty-program")}
        >
          {t("Cancel")}
        </Button>

        <>
          <Button
            type="default"
            onClick={() => handleSubmit(true)}
            style={{ background: "#00A537", color: "#fff" }}
          >
            {t("Draft")}
          </Button>
          <Button
            type="default"
            onClick={() => handleSubmit(false)}
            style={{ background: "#1890FF", color: "#fff" }}
          >
            {t("Save")}
          </Button>
        </>
      </Space>
    </>
  );
};

export default GeneralInfoAction;

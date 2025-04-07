/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Form, Row, Col, Input, Rate, DatePicker } from "antd";

import { TechnicianApi } from "../../apis/technician/technician";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { validatePhoneNumber } from "../../utils/common/validate";
import dayjs from "dayjs";
import { buildFormData } from "../../utils/common/buildFormData";
import AvatarUploader from "../../components/AvatarUploader";
import AppAccountSelect from "../../components/AppAccountSelect";
import StoreSelect from "../../components/StoreSelect";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
const TechnicianAction = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data = { data: {} } } = useQuery({
    queryKey: ["technicianDetail", params.id],
    queryFn: () => TechnicianApi.getById(params.id as any),
    enabled: !!params.id,
  });

  useEffect(() => {
    if (params.id && (data as any)?.data) {
      const value = (data as any).data;
      setImageUrl(value.avatar);
      form.setFieldsValue({
        technicianName: value.technicianName || "",
        technicianAddress: value.technicianAddress || "",
        phone: value.phone || "",
        ratingStar: value.ratingStar || "",
        workingSchedule: value.workingSchedule
          ? dayjs(value.workingSchedule, "YYYY-MM-DD")
          : null,
        accountId: value.accountId || "",
        storeId: value.storeId || "",
      });
    }
  }, [data, form, params.id]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await TechnicianApi.update(params.id as any, formD)
        : await TechnicianApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success("Lưu thành công");
        navigate("/technician");
      } else toast.error(t(res.message));
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
            {params?.id ? t("Update technician") : t("Create technician")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/technician"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(
              accesses,
              "update",
              "technician"
            )}
          />
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("Technician")}
                name="technicianName"
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
                label={t("Phone number")}
                name="phone"
                rules={[
                  {
                    required: true,
                    message: t("Please enter phone number"),
                  },
                  {
                    validator: validatePhoneNumber,
                  },
                ]}
              >
                <Input placeholder={t("Enter phone number")} maxLength={10} />
              </Form.Item>
              <Form.Item label={t("User")} name="accountId">
                <AppAccountSelect
                  value={(data as any)?.data?.accountId}
                  placeholder={t("Choose user")}
                />
              </Form.Item>
              <Form.Item label={t("Store")} name="storeId">
                <StoreSelect
                  placeholder={t("Choose store")}
                  value={(data as any)?.data?.storeId}
                />
              </Form.Item>
              <Form.Item label={t("Address")} name="technicianAddress">
                <Input.TextArea rows={4} placeholder={t("Enter address")} />
              </Form.Item>
              <Form.Item name="ratingStar" label={t("Rating")}>
                <Rate />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label={t("Avatar")} name="avatar">
                <AvatarUploader
                  data={imageUrl || undefined}
                  placeholder={t("Avatar")}
                />
              </Form.Item>
              <Form.Item
                label={t("Work Schedule")}
                name="workingSchedule"
                rules={[
                  {
                    required: true,
                    message: t("Please choose Work Schedule"),
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder={t("Work Schedule")}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <TopActionButtons
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
        backUrl="/technician"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(accesses, "update", "technician")}
      />
    </>
  );
};
export default TechnicianAction;

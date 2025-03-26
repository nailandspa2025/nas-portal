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
import UserSelect from "../../components/UserSelect";
import StoreSelect from "../../components/StoreSelect";
import TopActionButtons from "../../components/common/TopActionButtons";
import BottomActionButtons from "../../components/common/BottomActionButtons";
import { useTranslation } from "react-i18next";
const TechnicianAction = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data = { data: {} }, isLoading } = useQuery({
    queryKey: ["userDetail", params.id],
    queryFn: () => TechnicianApi.getById(params.id as string),
    enabled: !!params.id,
  });

  useEffect(() => {
    if ((data as Record<string, any>)?.data?.avatar) {
      setImageUrl((data as Record<string, any>)?.data?.avatar);
    }
  }, [data]);
  const initialValues = {
    technicianName: (data as Record<string, any>)?.data?.technicianName || "",
    technicianAddress:
      (data as Record<string, any>)?.data?.technicianAddress || "",
    phone: (data as Record<string, any>)?.data?.phone || "",
    ratingStar: (data as Record<string, any>)?.data?.ratingStar || "",
    workingSchedule: (data as Record<string, any>)?.data?.workingSchedule
      ? dayjs(
          (data as Record<string, any>)?.data?.workingSchedule,
          "YYYY-MM-DD"
        )
      : null,
    userId: (data as Record<string, any>)?.data?.userId || "",
    storeId: (data as Record<string, any>)?.data?.storeId || "",
  };
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await TechnicianApi.update(params.id as string, formD)
        : await TechnicianApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success("Lưu thành công");
        navigate("/technician");
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
            <TopActionButtons backUrl="/technician" />
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
                <Form.Item label={t("User")} name="userId">
                  <UserSelect
                    value={(data as any)?.data?.userId}
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
            <BottomActionButtons backUrl="/technician" />
          </Form>
        </Card>
      )}
    </>
  );
};
export default TechnicianAction;

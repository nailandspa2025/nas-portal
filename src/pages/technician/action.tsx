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
import StoreSelect from "../../components/StoreSelect";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import RemoteSelect from "../../components/RemoteSelect";
import { DropdownApi } from "../../apis/dropdown/dropdown";
const TechnicianAction = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAvatar, setIsAvatar] = useState(false);
  const { data } = useQuery({
    queryKey: ["technicianDetail", params.id],
    queryFn: async () => {
      const res: any = await TechnicianApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });

  useEffect(() => {
    if (params.id && data) {
      setImageUrl(data.avatar);
      form.setFieldsValue({
        technicianName: data.technicianName || "",
        technicianAddress: data.technicianAddress || "",
        phone: data.phone || "",
        ratingStar: data.ratingStar || "",
        workingSchedule: data.workingSchedule
          ? dayjs(data.workingSchedule, "YYYY-MM-DD")
          : null,
        userMerchantId: data.userMerchantId || "",
        storeId: data.storeId || "",
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
        toast.success(t("Save successfully"));
        navigate("/technician");
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  const onFinish = (values: any) => {
    const payload = {
      ...values,
    };
    if (params.id) {
      payload.id = params.id;
      payload.IsAvatar = isAvatar;
    }
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
              <Form.Item label={t("User Merchant")} name="userMerchantId">
                {/* <AppAccountSelect placeholder={t("Choose user")} /> */}
                <RemoteSelect
                  placeholder={t("Choose user")}
                  fetchList={DropdownApi.getUserMerchants}
                  fetchById={DropdownApi.getUserMerchantById}
                  labelKey={(item) => `${item.fullName} - ${item.phoneNumber}`}
                  valueKey="id"
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
                  onChange={() => {
                    setIsAvatar(true);
                  }}
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Col,
  Row,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  TimePicker,
} from "antd";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { checkAccessRight } from "../../utils/common/accessUtils";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { buildFormData } from "../../utils/common/buildFormData";

import StoreSelect from "../../components/StoreSelect";
import ProductSelect from "../../components/ProductSelect";
import AppAccuntSelect from "../../components/AppAccountSelect";
import { BookingApi } from "../../apis/booking/booking";
import { validatePhoneNumber } from "../../utils/common/validate";
import TechnicianSelect from "../../components/TechnicianSelect";
const BookingActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data } = useQuery({
    queryKey: ["bookingDetail", params.id],
    queryFn: () => BookingApi.getById(params.id as any),
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && (data as any)?.data) {
      const value = (data as any).data;
      form.setFieldsValue({
        fullName: value.fullName || "",
        email: value.email || "",
        phone: value.phone || "",
        bookingDate: value.bookingDate
          ? dayjs(value.bookingDate, "YYYY-MM-DD")
          : null,
        bookingTime: value.bookingTime
          ? dayjs(value.bookingTime, "HH:mm")
          : null,
        gender: value.gender ?? null,
        note: value.note || "",
        address: value.address || "",
        userId: (value.userId ? Number(value.userId) : null) as number | null,
        productId: value.productId || null,
        technicianId: value.technicianId || null,
        storeId: value.storeId || null,
        number: value.number ?? null,
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await BookingApi.update(params.id as any, formD)
        : await BookingApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/booking");
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
      bookingDate: values?.bookingDate?.toISOString() ?? null,
    };
    if (params.id) payload.id = params.id;
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
            {params?.id ? t("Update booking") : t("Create booking")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/booking"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(
              accesses,
              "update",
              "booking"
            )}
            disabled={
              (data as any)?.data.status == 2 || (data as any)?.data.status == 3
            }
          />
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("Full name")}
                name={"fullName"}
                rules={[
                  {
                    required: true,
                    message: t("Please enter full name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter full name")} />
              </Form.Item>
              <Form.Item label={t("Address")} name={"address"}>
                <Input placeholder={t("Enter address")} />
              </Form.Item>
              <Form.Item
                label={t("Gender")}
                name={"gender"}
                rules={[
                  {
                    required: true,
                    message: t("Please enter gender!"),
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder={t("Choose gender")}
                  allowClear
                >
                  <Select.Option value={1}>{t("Male")}</Select.Option>
                  <Select.Option value={2}>{t("Female")}</Select.Option>
                  <Select.Option value={3}>{t("Other")}</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label={t("Phone")}
                name={"phone"}
                rules={[
                  {
                    required: true,
                    message: t("Please enter phone!"),
                  },
                  {
                    validator: validatePhoneNumber,
                  },
                ]}
              >
                <Input placeholder={t("Enter phone")} />
              </Form.Item>
              <Form.Item
                label={t("Email")}
                name={"email"}
                rules={[
                  {
                    type: "email",
                  },
                ]}
              >
                <Input placeholder={t("Enter email")} />
              </Form.Item>
              <Form.Item
                label={t("User mobile")}
                name={"userId"}
                rules={[
                  {
                    required: true,
                    message: t("Please choose user!"),
                  },
                ]}
              >
                <AppAccuntSelect
                  placeholder="Please choose user"
                  disabled={!!params.id}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={"Technician"}
                name={"technicianId"}
                rules={[
                  {
                    required: true,
                    message: t("Please choose technician"),
                  },
                ]}
              >
                <TechnicianSelect placeholder="Choose technician" />
              </Form.Item>
              <Form.Item
                label={t("Store")}
                name={"storeId"}
                rules={[
                  {
                    required: true,
                    message: t("Choose store!"),
                  },
                ]}
              >
                <StoreSelect placeholder={t("Choose store")} />
              </Form.Item>
              <Form.Item
                label={t("Number")}
                name="number"
                rules={[
                  {
                    required: true,
                    message: t("Please enter number"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("Enter number")}
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Form.Item label={t("Service")} name={"productId"}>
                <ProductSelect placeholder={t("Choose product")} />
              </Form.Item>
              <Form.Item
                label={t("Appointment date")}
                name={"bookingDate"}
                rules={[
                  {
                    required: true,
                    message: t("Please choose date"),
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder={t("Choose date")}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf("day");
                  }}
                />
              </Form.Item>
              <Form.Item
                label={t("Appointment time")}
                name={"bookingTime"}
                rules={[
                  {
                    required: true,
                    message: t("Please choose time"),
                  },
                ]}
              >
                <TimePicker
                  format="HH:mm"
                  placeholder={t("Choose  time")}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label={t("Note")} name={"note"}>
                <Input.TextArea rows={5} placeholder={t("Enter note")} />
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
        backUrl="/booking"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(accesses, "update", "booking")}
        disabled={
          (data as any)?.data.status == 2 || (data as any)?.data.status == 3
        }
      />
    </>
  );
};

export default BookingActions;

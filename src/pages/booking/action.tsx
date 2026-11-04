/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Col,
  Row,
  Form,
  Input,
  Select,
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

import AppAccuntSelect from "../../components/AppAccountSelect";
import { BookingApi } from "../../apis/order/booking";
import BookingCustomersEditor from "../../components/booking/BookingCustomersEditor";
import {
  bookingCustomersRule,
  toBookingPayload,
  toFormCustomers,
} from "../../components/booking/bookingCustomers";
import { validatePhoneNumber } from "../../utils/common/validate";

const SECTION_TITLE_STYLE = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.5,
  textTransform: "uppercase" as const,
  opacity: 0.65,
  marginBottom: 8,
};

const BookingActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const storeId = Form.useWatch("storeId", form);
  const { data } = useQuery({
    queryKey: ["bookingDetail", params.id],
    queryFn: async () => {
      const res: any = await BookingApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && data) {
      form.setFieldsValue({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        bookingDate: data.bookingDate
          ? dayjs(data.bookingDate, "YYYY-MM-DD")
          : null,
        bookingTime: data.bookingTime ? dayjs(data.bookingTime, "HH:mm") : null,
        gender: data.gender ?? null,
        note: data.note || "",
        address: data.address || "",
        userId: (data.userId ? Number(data.userId) : null) as number | null,
        productId: data.productId || null,

        storeId: data.storeId || null,
        technicians: toFormCustomers(data.technicians),
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      // POST nhận JSON ([FromBody]), PUT nhận form ([FromForm]) ở nas-order-api
      if (!params.id) return await BookingApi.create(values);
      const formD = new FormData();
      buildFormData(formD, values);
      return await BookingApi.update(params.id as any, formD);
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
    const payload = toBookingPayload(values);
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
            disabled={data?.status == 2 || data?.status == 3}
          />
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <div style={SECTION_TITLE_STYLE}>{t("Booking information")}</div>
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
              <Row gutter={12}>
                <Col xs={24} sm={12}>
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
                </Col>
                <Col xs={24} sm={12}>
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
              </Row>
              <div style={SECTION_TITLE_STYLE}>{t("Booker")}</div>
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
                  //disabled={!!params.id}
                />
              </Form.Item>
              <Row gutter={12}>
                <Col xs={24} sm={12}>
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
                </Col>
                <Col xs={24} sm={12}>
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
                </Col>
              </Row>
              <Row gutter={12}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label={t("Email")}
                    name={"email"}
                    rules={[
                      {
                        type: "email",
                        message: t("Invalid email"),
                      },
                    ]}
                  >
                    <Input placeholder={t("Enter email")} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
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
                </Col>
              </Row>
              <Form.Item label={t("Address")} name={"address"}>
                <Input placeholder={t("Enter address")} />
              </Form.Item>
              <Form.Item label={t("Note")} name={"note"}>
                <Input.TextArea rows={5} placeholder={t("Enter note")} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="technicians"
                rules={[bookingCustomersRule(t)]}
              >
                <BookingCustomersEditor
                  storeId={storeId}
                  disabled={data?.status == 2 || data?.status == 3}
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
        backUrl="/booking"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(accesses, "update", "booking")}
        disabled={data?.status == 2 || data?.status == 3}
      />
    </>
  );
};

export default BookingActions;

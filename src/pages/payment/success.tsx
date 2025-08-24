import { Result, Button, Spin } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaymentApi } from "../../apis/order/payment";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { buildFormData } from "../../utils/common/buildFormData";
export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const payerId = searchParams.get("PayerID");
  const bookingId = searchParams.get("bookingId");
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data: any) => {
      const formD = new FormData();
      buildFormData(formD, data);
      console.log("MutationFn nhận:", data);
      return PaymentApi.capturePaypal(formD);
    },
    onSuccess: (res) => {
      console.log("Confirmation successful:", res);
    },
    onError: (err) => {
      console.error("Confirmation failed:", err);
    },
  });
  useEffect(() => {
    if (token && bookingId) {
      mutation.mutate({ token, payerId, bookingId });
    }
  }, [token, payerId, bookingId]);
  if (mutation.isPending) {
    return <Spin tip="Confirmation successful..." fullscreen />;
  }
  return (
    <Result
      status={mutation.isError ? "error" : "success"}
      title={mutation.isError ? "Payment failed!" : "Payment successful!"}
      subTitle={
        mutation.isError
          ? "There was an error confirming payment. Please contact support."
          : "Thank you for your order. We will process your order shortly."
      }
      icon={
        <CheckCircleOutlined
          style={{ color: mutation.isError ? "red" : "#52c41a" }}
        />
      }
      extra={[
        <Button type="primary" key="home" onClick={() => navigate("/")}>
          Back to home page
        </Button>,
      ]}
    />
  );
}

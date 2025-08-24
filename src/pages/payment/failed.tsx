import React from "react";
import { Result, Button } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentFail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const bookingId = searchParams.get("bookingId");
  return (
    <Result
      status="error"
      title="Payment failed"
      subTitle="There was an error processing your payment. Please try again or choose a different method."
      icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
      extra={[
        <Button
          type="primary"
          key="retry"
          onClick={() =>
            navigate(`/payment/success?bookingId=${bookingId}&token=${token}`)
          }
        >
          Retry
        </Button>,
        <Button key="support" onClick={() => navigate("/")}>
          Back to home page
        </Button>,
      ]}
    />
  );
};

export default PaymentFail;

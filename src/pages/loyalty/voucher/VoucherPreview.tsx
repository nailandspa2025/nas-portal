import React, { useEffect, useState } from "react";
import { Card, Divider, Flex, Typography } from "antd";
import { DollarCircleOutlined, QrcodeOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

interface VoucherPreviewProps {
  code?: string;
  imageUrl?: string | File | any;
  discountType?: number;
  discountValue?: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
}

const formatCurrency = (value?: number) => {
  if (value == null) return "--";
  return value.toLocaleString("vi-VN");
};

const VoucherPreview: React.FC<VoucherPreviewProps> = ({
  code = "CAMPAIGN-2024-OFF10",
  imageUrl,
  discountType = 1,
  discountValue,
  minimumOrderAmount,
  maximumDiscountAmount,
}) => {
  const { t } = useTranslation();

  const [bgImage, setBgImage] = useState<string>();

  useEffect(() => {
    if (!imageUrl) {
      setBgImage(undefined);
      return;
    }

    if (typeof imageUrl === "string") {
      setBgImage(imageUrl);
      return;
    }

    const file = imageUrl?.originFileObj ?? imageUrl?.file ?? imageUrl;

    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setBgImage(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [imageUrl]);

  const title =
    discountType === 1
      ? `${discountValue ?? 0}% OFF`
      : `${(discountValue ?? 0).toLocaleString("en-US")} USD OFF`;

  return (
    <div
      style={{
        width: "100%",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 15px 35px rgba(0,0,0,.18)",
        background: "transparent",
        lineHeight: 1.2,
        display: "block",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: 300,
          overflow: "hidden",
          background: bgImage
            ? `url(${bgImage}) center/cover no-repeat`
            : "linear-gradient(135deg,#1976d2,#0d47a1)",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: bgImage
              ? "linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.65))"
              : "linear-gradient(rgba(255,255,255,.05),rgba(0,0,0,.18))",
          }}
        />

        {/* Left cut */}
        <div
          style={{
            position: "absolute",
            left: -12,
            top: "50%",
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#fff",
            transform: "translateY(-50%)",
            zIndex: 5,
          }}
        />

        {/* Right cut */}
        <div
          style={{
            position: "absolute",
            right: -12,
            top: "50%",
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#fff",
            transform: "translateY(-50%)",
            zIndex: 5,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "22px 24px",
            color: "#fff",
            boxSizing: "border-box",
          }}
        >
          <Flex justify="space-between" align="center">
            <DollarCircleOutlined
              style={{
                fontSize: 34,
                color: "#fff",
              }}
            />

            <div
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                background: "rgba(255,255,255,.2)",
                backdropFilter: "blur(6px)",
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              Voucher
            </div>
          </Flex>

          <Title
            level={3}
            style={{
              color: "#fff",
              margin: "18px 0",
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            {title}
          </Title>

          <Flex vertical gap={12}>
            <div>
              <Text
                style={{
                  color: "rgba(255,255,255,.75)",
                  lineHeight: 1.2,
                }}
              >
                {t("Converted points")}
              </Text>

              <div>
                <Text
                  strong
                  style={{
                    color: "#fff",
                    fontSize: 17,
                    lineHeight: 1.2,
                  }}
                >
                  {formatCurrency(minimumOrderAmount)}
                </Text>
              </div>
            </div>

            {discountType === 1 && (
              <div>
                <Text
                  style={{
                    color: "rgba(255,255,255,.75)",
                  }}
                >
                  {t("Maximum discount")}
                </Text>

                <div>
                  <Text
                    strong
                    style={{
                      color: "#fff",
                      fontSize: 17,
                    }}
                  >
                    {formatCurrency(maximumDiscountAmount)}
                  </Text>
                </div>
              </div>
            )}
          </Flex>

          <Divider
            style={{
              borderColor: "rgba(255,255,255,.25)",
              margin: "20px 0 16px",
            }}
          />

          <Flex justify="space-between" align="center">
            <div>
              <div
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: 1,
                  lineHeight: 1.2,
                }}
              >
                {code}
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,.7)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Reward Voucher
              </div>
            </div>

            <QrcodeOutlined
              style={{
                fontSize: 38,
                color: "#fff",
              }}
            />
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default VoucherPreview;

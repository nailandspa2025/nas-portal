import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  FormInstance,
  InputNumber,
  Row,
  Space,
  Typography,
} from "antd";

import SplitTipModal, {
  Technician,
  TipAllocation,
  TipAllocationType,
} from "./SplitTipModal";

const { Text } = Typography;

interface PaymentSummaryProps {
  form: FormInstance;
  serviceAmount: number;
  technicians?: Technician[];
  t?: (key: string) => string;

  onTipAllocationsChange?: (allocations: TipAllocation[]) => void;
}

type TipInputMode = "percent" | "amount";

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  form,
  serviceAmount,
  technicians = [],
  t = (key) => key,
  onTipAllocationsChange,
}) => {
  const [splitTipOpen, setSplitTipOpen] = useState(false);

  const [tipAllocations, setTipAllocations] = useState<TipAllocation[]>([]);

  // Mặc định %
  const [tipInputMode, setTipInputMode] = useState<TipInputMode>("percent");

  const [selectedTipPercent, setSelectedTipPercent] = useState<number | null>(
    20,
  );

  const [selectedTipAmount, setSelectedTipAmount] = useState<number | null>(
    null,
  );

  // =========================================================
  // FORM WATCH
  // =========================================================

  const discountAmount = Form.useWatch("discountAmount", form) ?? 0;

  const surchargeAmount = Form.useWatch("surchargeAmount", form) ?? 0;

  const tipAmount = Form.useWatch("tipAmount", form) ?? 0;

  const customerPaid = Form.useWatch("customerPaid", form) ?? 0;

  // =========================================================
  // FORMAT
  // =========================================================

  const formatMoney = (value?: number) => {
    return Math.round(value ?? 0).toLocaleString("vi-VN");
  };

  const formatter = (value: number | string | undefined) => {
    if (value === undefined || value === null || value === "") {
      return "";
    }

    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parser = (value: string | undefined) => {
    if (!value) {
      return 0;
    }

    return Number(value.replace(/,/g, "")) || 0;
  };

  // =========================================================
  // SUBTOTAL
  // =========================================================

  const subtotalBeforeTip = useMemo(() => {
    const service = Number(serviceAmount || 0);
    const discount = Number(discountAmount || 0);
    const surcharge = Number(surchargeAmount || 0);

    return Math.max(service - discount + surcharge, 0);
  }, [serviceAmount, discountAmount, surchargeAmount]);

  // =========================================================
  // TOTAL
  // =========================================================

  const totalAmount = useMemo(() => {
    return Math.max(subtotalBeforeTip + Number(tipAmount || 0), 0);
  }, [subtotalBeforeTip, tipAmount]);

  // =========================================================
  // CHANGE
  // =========================================================

  const changeAmount = useMemo(() => {
    return Math.max(Number(customerPaid || 0) - totalAmount, 0);
  }, [customerPaid, totalAmount]);

  // =========================================================
  // DEFAULT 20% TIP
  // =========================================================
  //
  // Đây là phần quan trọng.
  //
  // Nếu đang ở chế độ % và selectedTipPercent = 20
  // thì tự động set tipAmount = 20% subtotal.
  //
  // Không set nếu user đang nhập tip bằng tiền.
  // =========================================================

  useEffect(() => {
    if (tipInputMode !== "percent" || selectedTipPercent === null) {
      return;
    }

    const newTip = Math.round((subtotalBeforeTip * selectedTipPercent) / 100);

    const currentTip = Number(form.getFieldValue("tipAmount") || 0);

    if (currentTip !== newTip) {
      form.setFieldValue("tipAmount", newTip);
    }
  }, [subtotalBeforeTip, selectedTipPercent, tipInputMode, form]);

  // =========================================================
  // DEFAULT TIP ALLOCATION
  // =========================================================

  const calculateDefaultAllocations = (): TipAllocation[] => {
    if (!technicians.length || tipAmount <= 0) {
      return [];
    }

    const data = technicians.map((tech) => {
      const technicianRevenue =
        tech.services?.reduce(
          (sum, service) => sum + Number(service.priceFrom ?? 0),
          0,
        ) ?? 0;

      return {
        technicianId: tech.technician.id,
        technicianName:
          tech?.technician?.technicianName || `Technician #${tech.id}`,
        technicianRevenue,
        //allocationType: 1,
      };
    });

    const totalRevenue = data.reduce(
      (sum, item) => sum + Number(item.technicianRevenue || 0),
      0,
    );

    // =====================================================
    // KHÔNG CÓ DOANH THU
    // =====================================================

    if (totalRevenue <= 0) {
      const base = Math.floor(tipAmount / data.length);

      const remainder = tipAmount - base * data.length;

      return data.map((item, index) => {
        const allocated = base + (index < remainder ? 1 : 0);

        return {
          ...item,

          percentage:
            tipAmount > 0
              ? Number(((allocated / tipAmount) * 100).toFixed(2))
              : 0,

          tipAmount: allocated,
          allocationType: TipAllocationType.Equal,
        };
      });
    }

    // =====================================================
    // CHIA THEO DOANH THU
    // =====================================================

    let allocated = 0;

    return data.map((item, index) => {
      let tip = Math.floor((tipAmount * item.technicianRevenue) / totalRevenue);

      // Người cuối nhận phần dư
      if (index === data.length - 1) {
        tip = tipAmount - allocated;
      }

      allocated += tip;

      return {
        ...item,

        percentage:
          tipAmount > 0 ? Number(((tip / tipAmount) * 100).toFixed(2)) : 0,

        tipAmount: tip,
        allocationType: TipAllocationType.Equal,
      };
    });
  };

  // =========================================================
  // AUTO ALLOCATION
  // =========================================================

  useEffect(() => {
    if (splitTipOpen) {
      return;
    }

    const allocations = calculateDefaultAllocations();

    setTipAllocations(allocations);

    onTipAllocationsChange?.(allocations);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [technicians, tipAmount, splitTipOpen]);

  // =========================================================
  // TIP %
  // =========================================================

  const handleTipPercent = (percent: number) => {
    setTipInputMode("percent");

    setSelectedTipPercent(percent);

    setSelectedTipAmount(null);

    const newTip = Math.round((subtotalBeforeTip * percent) / 100);

    form.setFieldValue("tipAmount", newTip);
  };

  // =========================================================
  // TIP AMOUNT
  // =========================================================

  const handleTipAmount = (amount: number) => {
    setTipInputMode("amount");

    setSelectedTipAmount(amount);

    setSelectedTipPercent(null);

    form.setFieldValue("tipAmount", amount);
  };

  // =========================================================
  // CUSTOM TIP
  // =========================================================

  const handleTipInputChange = (value: number | null) => {
    const amount = Math.max(Number(value ?? 0), 0);

    setTipInputMode("amount");

    setSelectedTipPercent(null);

    setSelectedTipAmount(amount);

    form.setFieldValue("tipAmount", amount);
  };

  // =========================================================
  // OPEN SPLIT TIP
  // =========================================================

  const handleOpenSplitTip = () => {
    if (tipAmount <= 0 || technicians.length === 0) {
      return;
    }

    setSplitTipOpen(true);
  };

  // =========================================================
  // CONFIRM SPLIT TIP
  // =========================================================

  const handleConfirmSplitTip = (allocations: TipAllocation[]) => {
    setTipAllocations(allocations);

    onTipAllocationsChange?.(allocations);

    setSplitTipOpen(false);
  };

  // =========================================================
  // RENDER
  // =========================================================
  useEffect(() => {
    form.setFieldValue("tipType", 1);
  }, [form]);
  return (
    <>
      <Card
        title={
          <Text
            strong
            style={{
              fontSize: 22,
            }}
          >
            Payment summary
          </Text>
        }
        style={{
          borderRadius: 16,
        }}
        styles={{
          header: {
            borderBottom: "none",
            padding: "20px 28px 10px",
          },

          body: {
            padding: "0 28px 24px",
          },
        }}
      >
        {/* TOTAL SERVICES */}

        <Row justify="space-between" align="middle">
          <Text>{t("Total Services")}</Text>

          <Text strong>{formatMoney(serviceAmount)}</Text>
        </Row>

        {/* DISCOUNT */}
        <Form.Item name="tipType" hidden>
          <InputNumber />
        </Form.Item>
        <Row
          justify="space-between"
          align="middle"
          style={{
            marginTop: 8,
          }}
        >
          <Text>{t("Discount")}</Text>

          <Form.Item
            name="discountAmount"
            style={{
              margin: 0,
            }}
          >
            <InputNumber
              min={0}
              controls={false}
              formatter={formatter}
              parser={parser}
              style={{
                width: 180,
              }}
            />
          </Form.Item>
        </Row>

        {/* SURCHARGE */}

        <Row
          justify="space-between"
          align="middle"
          style={{
            marginTop: 8,
          }}
        >
          <Text>{t("Surcharge")}</Text>

          <Form.Item
            name="surchargeAmount"
            style={{
              margin: 0,
            }}
          >
            <InputNumber
              min={0}
              controls={false}
              formatter={formatter}
              parser={parser}
              style={{
                width: 180,
              }}
            />
          </Form.Item>
        </Row>

        {/* SUBTOTAL */}

        <Row
          justify="space-between"
          align="middle"
          style={{
            marginTop: 10,
          }}
        >
          <Text type="secondary">Preliminary total before tip</Text>

          <Text>{formatMoney(subtotalBeforeTip)}</Text>
        </Row>

        {/* =================================================
            QUICK TIP
        ================================================= */}

        <div
          style={{
            marginTop: 18,
            padding: "18px 20px",
            border: "1px dashed #91a7ff",
            borderRadius: 10,
            background: "#f5f7ff",
          }}
        >
          <Row
            justify="space-between"
            align="middle"
            style={{
              marginBottom: 14,
            }}
          >
            <Text
              strong
              style={{
                fontSize: 16,
              }}
            >
              Quick Tip
            </Text>

            <Space size={4}>
              {/* % */}

              <Button
                size="small"
                type={tipInputMode === "percent" ? "primary" : "default"}
                onClick={() => {
                  setTipInputMode("percent");

                  if (selectedTipPercent === null) {
                    handleTipPercent(20);
                  }
                  form.setFieldsValue({
                    tipType: 1,
                  });
                }}
              >
                %
              </Button>

              {/* AMOUNT */}

              <Button
                size="small"
                type={tipInputMode === "amount" ? "primary" : "default"}
                onClick={() => {
                  setTipInputMode("amount");

                  setSelectedTipAmount(tipAmount);

                  setSelectedTipPercent(null);
                  form.setFieldsValue({
                    tipType: 2,
                  });
                }}
              >
                $
              </Button>
            </Space>
          </Row>

          {/* =================================================
              PERCENT
          ================================================= */}

          {tipInputMode === "percent" && (
            <>
              <Row
                gutter={8}
                style={{
                  display: "flex",
                }}
              >
                {[15, 20, 25].map((percent) => (
                  <div
                    key={percent}
                    style={{
                      flex: 1,
                    }}
                  >
                    <Button
                      block
                      type={
                        selectedTipPercent === percent ? "primary" : "default"
                      }
                      onClick={() => handleTipPercent(percent)}
                      style={{
                        height: 42,
                      }}
                    >
                      {percent}%{selectedTipPercent === percent && " ✓"}
                    </Button>
                  </div>
                ))}

                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <Button
                    block
                    type={selectedTipPercent === null ? "primary" : "default"}
                    onClick={() => {
                      setTipInputMode("amount");

                      setSelectedTipPercent(null);

                      setSelectedTipAmount(tipAmount);
                    }}
                    style={{
                      height: 42,
                    }}
                  >
                    Other
                  </Button>
                </div>
              </Row>

              <div
                style={{
                  marginTop: 12,
                  color: "#777",
                  fontSize: 13,
                }}
              >
                {selectedTipPercent !== null ? (
                  <>
                    Suggestion: {selectedTipPercent}% of the bill{" "}
                    {formatMoney(subtotalBeforeTip)} →{" "}
                    <Text strong>
                      {formatMoney(
                        Math.round(
                          (subtotalBeforeTip * selectedTipPercent) / 100,
                        ),
                      )}
                      đ
                    </Text>
                  </>
                ) : (
                  <>Enter a custom tip amount below.</>
                )}
              </div>
            </>
          )}

          {/* =================================================
              AMOUNT
          ================================================= */}

          {tipInputMode === "amount" && (
            <>
              <Row
                gutter={8}
                style={{
                  display: "flex",
                }}
              >
                {[100000, 200000, 300000, 500000].map((amount) => (
                  <div
                    key={amount}
                    style={{
                      flex: 1,
                    }}
                  >
                    <Button
                      block
                      type={
                        selectedTipAmount === amount ? "primary" : "default"
                      }
                      onClick={() => handleTipAmount(amount)}
                      style={{
                        height: 42,
                        padding: "0 5px",
                      }}
                    >
                      {formatMoney(amount)}

                      {selectedTipAmount === amount && " ✓"}
                    </Button>
                  </div>
                ))}
              </Row>

              <div
                style={{
                  marginTop: 12,
                  color: "#777",
                  fontSize: 13,
                }}
              >
                Gợi ý: Chọn nhanh số tiền Tip hoặc nhập số tiền tùy chỉnh bên
                dưới.
              </div>
            </>
          )}

          <Divider
            style={{
              margin: "14px 0",
            }}
          />

          {/* =================================================
              TIPPING
          ================================================= */}

          <Row justify="space-between" align="middle">
            <Text strong>Tipping</Text>

            <Space>
              <Form.Item
                name="tipAmount"
                style={{
                  marginTop: 14,
                }}
              >
                <InputNumber
                  min={0}
                  controls={false}
                  formatter={formatter}
                  parser={parser}
                  onChange={handleTipInputChange}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Button
                onClick={handleOpenSplitTip}
                style={{
                  height: 30,
                }}
                disabled={tipAmount <= 0 || technicians.length === 0}
              >
                Chia Tips →
              </Button>
            </Space>
          </Row>
        </div>

        {/* =================================================
            TIP ALLOCATION
        ================================================= */}

        {tipAllocations.length > 0 && (
          <div
            style={{
              marginTop: 10,
              color: "#777",
              fontSize: 13,
              fontStyle: "italic",
            }}
          >
            {tipAllocations
              .map(
                (item) =>
                  `${item.technicianName} ${formatMoney(item.tipAmount)}`,
              )
              .join(" · ")}
          </div>
        )}

        <Divider />

        {/* CUSTOMER PAID */}

        <Row justify="space-between" align="middle">
          <Text>Customer Paid</Text>

          <Form.Item
            name="customerPaid"
            style={{
              margin: 0,
            }}
          >
            <InputNumber
              min={0}
              controls={false}
              formatter={formatter}
              parser={parser}
              style={{
                width: 180,
              }}
            />
          </Form.Item>
        </Row>

        {/* CHANGE */}

        <Row
          justify="space-between"
          align="middle"
          style={{
            marginTop: 8,
          }}
        >
          <Text>Change</Text>

          <Text strong type="success">
            {formatMoney(changeAmount)}
          </Text>
        </Row>

        <Divider />

        {/* TOTAL */}

        <Row justify="space-between" align="middle">
          <Text>Provisional calculation</Text>

          <Text strong>{formatMoney(totalAmount)}</Text>
        </Row>

        <Divider />

        {/* PAYMENT REQUIRED */}

        <Row justify="space-between" align="middle">
          <Text
            strong
            style={{
              fontSize: 20,
            }}
          >
            Payment required
          </Text>

          <Text
            strong
            style={{
              fontSize: 28,
              color: "#cf2e2e",
            }}
          >
            {formatMoney(totalAmount)}
          </Text>
        </Row>
      </Card>

      {/* =====================================================
          SPLIT TIP MODAL
      ===================================================== */}

      <SplitTipModal
        open={splitTipOpen}
        totalTip={tipAmount}
        technicians={technicians}
        initialAllocations={tipAllocations}
        onCancel={() => setSplitTipOpen(false)}
        onConfirm={handleConfirmSplitTip}
      />
    </>
  );
};

export default PaymentSummary;

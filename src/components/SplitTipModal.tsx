import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Divider,
  InputNumber,
  Modal,
  Radio,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

const { Text } = Typography;

/* =========================================================
 * ENUM
 * ========================================================= */

export enum TipAllocationType {
  RevenueRatio = 1,
  Equal = 2,
  Custom = 3,
}

/* =========================================================
 * TYPES
 * ========================================================= */

export interface TechnicianService {
  priceTo?: number;
  priceFrom?: number;
}

export interface Technician {
  id: number;
  fullName?: string;
  name?: string;
  revenue?: number;
  services?: TechnicianService[];
  technician: any;
}

export interface TipAllocation {
  technicianId: number;
  technicianName: string;
  technicianRevenue: number;
  percentage: number;
  tipAmount: number;
  allocationType: TipAllocationType;
}

interface SplitTipModalProps {
  open: boolean;

  totalTip: number;

  technicians: Technician[];

  initialAllocations?: TipAllocation[];

  onCancel: () => void;

  onConfirm: (allocations: TipAllocation[]) => void;
}

type SplitMode = "ratio" | "equal" | "designated";

/* =========================================================
 * COMPONENT
 * ========================================================= */

const SplitTipModal: React.FC<SplitTipModalProps> = ({
  open,
  totalTip,
  technicians,
  initialAllocations = [],
  onCancel,
  onConfirm,
}) => {
  const [mode, setMode] = useState<SplitMode>("ratio");

  const [allocations, setAllocations] = useState<TipAllocation[]>([]);

  /* =========================================================
   * FORMAT MONEY
   * ========================================================= */

  const formatMoney = (value?: number) => {
    return (value ?? 0).toLocaleString("vi-VN");
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

  /* =========================================================
   * GET TECHNICIAN ID
   * ========================================================= */

  const getTechnicianId = (technician: Technician): number => {
    /*
     * Ưu tiên technician.technicianId
     */
    if (technician.technician?.technicianId) {
      return Number(technician.technician.technicianId);
    }

    /*
     * Nếu object trả về technician.id
     */
    if (technician.technician?.id) {
      return Number(technician.technician.id);
    }

    /*
     * Cuối cùng dùng technician.id
     */
    return Number(technician.id);
  };

  /* =========================================================
   * GET NAME
   * ========================================================= */

  const getTechnicianName = (technician: Technician) => {
    return (
      technician.technician?.technicianName ||
      technician.technician?.fullName ||
      technician.technician?.name ||
      technician.fullName ||
      technician.name ||
      `Technician #${getTechnicianId(technician)}`
    );
  };

  /* =========================================================
   * GET REVENUE
   * ========================================================= */

  const getTechnicianRevenue = (technician: Technician) => {
    if (typeof technician.revenue === "number") {
      return technician.revenue;
    }

    return (
      technician.services?.reduce(
        (sum, service) => sum + (service.priceFrom ?? 0),
        0,
      ) ?? 0
    );
  };

  /* =========================================================
   * TECHNICIAN DATA
   * ========================================================= */

  const technicianData = useMemo(() => {
    return technicians.map((technician) => ({
      technicianId: getTechnicianId(technician),

      technicianName: getTechnicianName(technician),

      technicianRevenue: getTechnicianRevenue(technician),
    }));
  }, [technicians]);

  /* =========================================================
   * TOTAL REVENUE
   * ========================================================= */

  const totalRevenue = useMemo(() => {
    return technicianData.reduce(
      (sum, technician) => sum + technician.technicianRevenue,
      0,
    );
  }, [technicianData]);

  /* =========================================================
   * CHIA THEO TỈ LỆ
   * ========================================================= */

  const calculateRatio = (): TipAllocation[] => {
    if (technicianData.length === 0) {
      return [];
    }

    /*
     * Không có Tip
     */
    if (totalTip <= 0) {
      return technicianData.map((item) => ({
        technicianId: item.technicianId,
        technicianName: item.technicianName,
        technicianRevenue: item.technicianRevenue,
        percentage: 0,
        tipAmount: 0,
        allocationType: TipAllocationType.RevenueRatio,
      }));
    }

    /*
     * Không có doanh thu -> chia đều
     */
    if (totalRevenue <= 0) {
      return calculateEqual();
    }

    const result: TipAllocation[] = [];

    let allocated = 0;

    technicianData.forEach((item, index) => {
      const percentage = (item.technicianRevenue / totalRevenue) * 100;

      let tipAmount = Math.floor(
        (totalTip * item.technicianRevenue) / totalRevenue,
      );

      /*
       * Người cuối cùng nhận phần dư
       */
      if (index === technicianData.length - 1) {
        tipAmount = totalTip - allocated;
      }

      allocated += tipAmount;

      result.push({
        technicianId: item.technicianId,

        technicianName: item.technicianName,

        technicianRevenue: item.technicianRevenue,

        percentage: Number(percentage.toFixed(2)),

        tipAmount,

        allocationType: TipAllocationType.RevenueRatio,
      });
    });

    return result;
  };

  /* =========================================================
   * CHIA ĐỀU
   * ========================================================= */

  const calculateEqual = (): TipAllocation[] => {
    if (technicianData.length === 0) {
      return [];
    }

    const count = technicianData.length;

    const baseTip = Math.floor(totalTip / count);

    const remainder = totalTip - baseTip * count;

    return technicianData.map((item, index) => {
      const tipAmount = baseTip + (index < remainder ? 1 : 0);

      return {
        technicianId: item.technicianId,

        technicianName: item.technicianName,

        technicianRevenue: item.technicianRevenue,

        percentage:
          totalTip > 0 ? Number(((tipAmount / totalTip) * 100).toFixed(2)) : 0,

        tipAmount,

        allocationType: TipAllocationType.Equal,
      };
    });
  };

  /* =========================================================
   * CHỈ ĐỊNH
   * ========================================================= */

  const calculateCustom = (): TipAllocation[] => {
    return technicianData.map((item) => ({
      technicianId: item.technicianId,

      technicianName: item.technicianName,

      technicianRevenue: item.technicianRevenue,

      percentage: 0,

      tipAmount: 0,

      allocationType: TipAllocationType.Custom,
    }));
  };

  /* =========================================================
   * INITIAL DATA
   * ========================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    /*
     * Nếu có dữ liệu cũ
     */
    if (initialAllocations.length > 0) {
      const normalized: TipAllocation[] = initialAllocations.map((item) => ({
        technicianId: Number(item.technicianId),

        technicianName: item.technicianName,

        technicianRevenue: Number(item.technicianRevenue) || 0,

        percentage: Number(item.percentage) || 0,

        tipAmount: Number(item.tipAmount) || 0,

        allocationType: item.allocationType ?? TipAllocationType.RevenueRatio,
      }));

      setAllocations(normalized);

      /*
       * Xác định mode từ allocationType
       */
      const allocationType = normalized[0]?.allocationType;

      if (allocationType === TipAllocationType.Equal) {
        setMode("equal");
      } else if (allocationType === TipAllocationType.Custom) {
        setMode("designated");
      } else {
        setMode("ratio");
      }

      return;
    }

    /*
     * Mặc định: Theo tỷ lệ
     */
    setMode("ratio");

    setAllocations(calculateRatio());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, totalTip, technicians, initialAllocations]);

  /* =========================================================
   * CHANGE MODE
   * ========================================================= */

  const handleModeChange = (newMode: SplitMode) => {
    setMode(newMode);

    /*
     * THEO TỶ LỆ
     */
    if (newMode === "ratio") {
      setAllocations(calculateRatio());
      return;
    }

    /*
     * CHIA ĐỀU
     */
    if (newMode === "equal") {
      setAllocations(calculateEqual());
      return;
    }

    /*
     * CHỈ ĐỊNH
     *
     * Khi chuyển sang Custom,
     * tạo allocationType = 3.
     */
    setAllocations((current) => {
      /*
       * Nếu đã có dữ liệu thì giữ tiền Tip
       * nhưng đổi allocationType = Custom
       */
      if (current.length > 0) {
        return current.map((item) => ({
          ...item,

          allocationType: TipAllocationType.Custom,
        }));
      }

      return calculateCustom();
    });
  };

  /* =========================================================
   * CHANGE TIP
   * ========================================================= */

  const handleTipChange = (technicianId: number, value: number | null) => {
    const tipAmount = Math.max(value ?? 0, 0);

    setAllocations((current) =>
      current.map((item) => {
        if (item.technicianId !== technicianId) {
          return item;
        }

        return {
          ...item,

          tipAmount,

          /*
           * Đã chỉnh tay -> Custom
           */
          allocationType: TipAllocationType.Custom,
        };
      }),
    );
  };

  /* =========================================================
   * TOTAL ALLOCATED
   * ========================================================= */

  const allocatedTotal = useMemo(() => {
    return allocations.reduce((sum, item) => sum + (item.tipAmount ?? 0), 0);
  }, [allocations]);

  /* =========================================================
   * REMAINING
   * ========================================================= */

  const remaining = totalTip - allocatedTotal;

  /* =========================================================
   * GET CURRENT ALLOCATION TYPE
   * ========================================================= */

  const currentAllocationType = useMemo(() => {
    switch (mode) {
      case "ratio":
        return TipAllocationType.RevenueRatio;

      case "equal":
        return TipAllocationType.Equal;

      case "designated":
        return TipAllocationType.Custom;

      default:
        return TipAllocationType.RevenueRatio;
    }
  }, [mode]);

  /* =========================================================
   * FINAL ALLOCATIONS
   * ========================================================= */

  const finalAllocations = useMemo(() => {
    return allocations.map((item) => ({
      technicianId: Number(item.technicianId),

      technicianName: item.technicianName,

      technicianRevenue: Number(item.technicianRevenue) || 0,

      tipAmount: Number(item.tipAmount) || 0,

      percentage:
        totalTip > 0
          ? Number(
              (((Number(item.tipAmount) || 0) / totalTip) * 100).toFixed(2),
            )
          : 0,

      /*
       * QUAN TRỌNG
       *
       * Luôn lấy allocationType theo mode hiện tại.
       */
      allocationType: currentAllocationType,
    }));
  }, [allocations, totalTip, currentAllocationType]);

  /* =========================================================
   * CONFIRM
   * ========================================================= */

  const handleConfirm = () => {
    if (technicians.length === 0) {
      message.warning("Chưa có kỹ thuật viên.");
      return;
    }

    if (totalTip <= 0) {
      message.warning("Tiền Tip phải lớn hơn 0.");
      return;
    }

    if (allocatedTotal !== totalTip) {
      message.error(
        `Tổng Tip phải là ${formatMoney(
          totalTip,
        )}. Hiện tại: ${formatMoney(allocatedTotal)}.`,
      );

      return;
    }

    const hasNegative = finalAllocations.some((item) => item.tipAmount < 0);

    if (hasNegative) {
      message.error("Tiền Tip không được âm.");
      return;
    }

    /*
     * TẠO PAYLOAD MỚI
     *
     * Không dùng object cũ.
     * allocationType được ép lại ở đây.
     */
    const payload: TipAllocation[] = finalAllocations.map((item) => ({
      technicianId: Number(item.technicianId),

      technicianName: item.technicianName,

      technicianRevenue: Number(item.technicianRevenue),

      percentage: Number(item.percentage),

      tipAmount: Number(item.tipAmount),

      allocationType: currentAllocationType,
    }));

    /*
     * DEBUG
     */
    onConfirm(payload);
  };

  /* =========================================================
   * TABLE
   * ========================================================= */

  const columns = [
    {
      title: "Technician",

      dataIndex: "technicianName",

      key: "technicianName",

      render: (name: string) => <Text>{name}</Text>,
    },

    {
      title: "Tỉ lệ",

      dataIndex: "percentage",

      key: "percentage",

      width: 80,

      align: "center" as const,

      render: (percentage: number) => <Text>{percentage}%</Text>,
    },

    {
      title: "Tiền Tip",

      dataIndex: "tipAmount",

      key: "tipAmount",

      width: 150,

      align: "right" as const,

      render: (tipAmount: number, record: TipAllocation) => {
        if (mode === "designated") {
          return (
            <InputNumber
              min={0}
              controls={false}
              value={tipAmount}
              formatter={formatter}
              parser={parser}
              onChange={(value) => handleTipChange(record.technicianId, value)}
              style={{
                width: 125,
              }}
            />
          );
        }

        return <Text strong>{formatMoney(tipAmount)}</Text>;
      },
    },
  ];

  /* =========================================================
   * RENDER
   * ========================================================= */

  return (
    <Modal
      open={open}
      title={
        <Space direction="vertical" size={0}>
          <Text strong>Chia Tips</Text>

          <Text
            type="secondary"
            style={{
              fontSize: 12,
              fontWeight: 400,
            }}
          >
            Tổng: {formatMoney(totalTip)}
          </Text>
        </Space>
      }
      onCancel={onCancel}
      footer={null}
      width={650}
      centered
      destroyOnClose
    >
      {/* MODE */}

      <Divider
        style={{
          margin: "0 0 12px",
        }}
      />

      <Radio.Group
        value={mode}
        onChange={(event) => handleModeChange(event.target.value as SplitMode)}
        style={{
          display: "flex",
          width: "100%",
          marginBottom: 12,
        }}
      >
        <Radio.Button
          value="ratio"
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >
          Theo tỉ lệ
        </Radio.Button>

        <Radio.Button
          value="equal"
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >
          Chia đều
        </Radio.Button>

        <Radio.Button
          value="designated"
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >
          Chỉ định
        </Radio.Button>
      </Radio.Group>

      {/* TABLE */}

      <Table
        rowKey="technicianId"
        columns={columns}
        dataSource={finalAllocations}
        pagination={false}
        bordered
        size="small"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>
              <div
                style={{
                  textAlign: "right",
                  fontWeight: 600,
                }}
              >
                Tổng
              </div>
            </Table.Summary.Cell>

            <Table.Summary.Cell index={1} align="center">
              <Text strong>{totalTip > 0 ? "100%" : "0%"}</Text>
            </Table.Summary.Cell>

            <Table.Summary.Cell index={2} align="right">
              <Text strong>{formatMoney(allocatedTotal)}</Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      {/* REMAINING */}

      {mode === "designated" && (
        <div
          style={{
            marginTop: 8,
            textAlign: "right",
          }}
        >
          {remaining === 0 ? (
            <Tag color="success">Đã phân bổ đủ</Tag>
          ) : remaining > 0 ? (
            <Tag color="warning">Còn thiếu: {formatMoney(remaining)}</Tag>
          ) : (
            <Tag color="error">Vượt: {formatMoney(Math.abs(remaining))}</Tag>
          )}
        </div>
      )}

      {/* CURRENT TYPE */}

      <div
        style={{
          marginTop: 8,
          fontSize: 12,
          color: "#666",
        }}
      >
        AllocationType: <Text strong>{currentAllocationType}</Text>
      </div>

      {/* NOTE */}

      <div
        style={{
          marginTop: 12,
          color: "#777",
          fontSize: 12,
          fontStyle: "italic",
        }}
      >
        100% = tổng tiền Tip được phân bổ cho các thợ.
      </div>

      {/* PAYROLL */}

      <div
        style={{
          marginTop: 10,
          padding: "10px 12px",
          borderLeft: "4px solid #d4b106",
          background: "#fffbe6",
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        <Text strong>Payroll:</Text> Tip lưu riêng theo thợ, không tính vào
        doanh thu/hoa hồng, cộng vào <Text strong>"Thu nhập từ Tip"</Text> kỳ
        lương gần nhất.
      </div>

      {/* FOOTER */}

      <Divider
        style={{
          margin: "16px 0 12px",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <Button onClick={onCancel}>HỦY</Button>

        <Button type="primary" onClick={handleConfirm}>
          XÁC NHẬN
        </Button>
      </div>
    </Modal>
  );
};

export default SplitTipModal;

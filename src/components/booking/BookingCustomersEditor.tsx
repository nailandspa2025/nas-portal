/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeleteOutlined,
  MinusOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { DropdownApi } from "../../apis/dropdown/dropdown";
import RemoteSelect from "../RemoteSelect";
import type { BookingCustomerLine } from "./bookingCustomers";

/**
 * Khối "Khách & thợ" của form booking.
 * 1 khách = 1 thợ, N khách = N thợ; mỗi thợ làm được nhiều dịch vụ (có số lượt).
 * Dùng làm control của <Form.Item name="technicians"> (nhận value/onChange).
 */

const initials = (name?: string) =>
  (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const minutesOf = (workingTime?: string) => {
  if (!workingTime) return null;
  const [h, m] = workingTime.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const formatNumber = (value: number) => value.toLocaleString();

// Màu nhấn theo mockup (nút Add Service, nút +)
const ACCENT = "#ff4d8d";
const SERVICE_COLORS = ["#9b5cf6", "#ff4d8d", "#22b8cf", "#f59f00", "#40c057"];

const priceText = (service: any, quantity = 1) => {
  const from = Number(service?.priceFrom ?? 0) * quantity;
  const to = Number(service?.priceTo ?? 0) * quantity;
  return to > from
    ? `${formatNumber(from)} - ${formatNumber(to)}`
    : formatNumber(from);
};

type Props = {
  value?: BookingCustomerLine[];
  onChange?: (value: BookingCustomerLine[]) => void;
  storeId?: number | null;
  disabled?: boolean;
};

const BookingCustomersEditor: FC<Props> = ({
  value,
  onChange,
  storeId,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const customers = useMemo(() => value ?? [], [value]);
  const update = (next: BookingCustomerLine[]) => onChange?.(next);
  // Thẻ khách đang mở ô chọn dịch vụ (sau khi bấm "Add Service")
  const [addingIndex, setAddingIndex] = useState<number | null>(null);

  const technicianIds = customers.map((c) => c.technicianId);
  const serviceIds = Array.from(
    new Set(customers.flatMap((c) => c.services.map((s) => s.serviceId))),
  );

  const { data: technicianMap = {} } = useQuery({
    queryKey: ["bookingTechnicianDetails", technicianIds.join(",")],
    queryFn: async () => {
      const res: any = await DropdownApi.getTechnicianByIds(
        technicianIds.join(","),
      );
      return Object.fromEntries(
        (res?.data ?? []).map((x: any) => [Number(x.id), x]),
      ) as Record<number, any>;
    },
    enabled: technicianIds.length > 0,
  });

  const { data: serviceMap = {} } = useQuery({
    queryKey: ["bookingServiceDetails", serviceIds.join(",")],
    queryFn: async () => {
      const res: any = await DropdownApi.getServiceByIds(serviceIds.join(","));
      return Object.fromEntries(
        (res?.data ?? []).map((x: any) => [Number(x.id), x]),
      ) as Record<number, any>;
    },
    enabled: serviceIds.length > 0,
  });

  // Chọn nhiều thợ ở trên: thêm/bớt khách, giữ dịch vụ đã chọn của thợ còn lại.
  const handleTechniciansChange = (ids?: number[]) => {
    const byId = new Map(customers.map((c) => [c.technicianId, c]));
    update(
      (ids ?? []).map(
        (id) => byId.get(id) ?? { technicianId: id, services: [] },
      ),
    );
  };

  const updateCustomer = (index: number, patch: Partial<BookingCustomerLine>) =>
    update(customers.map((c, i) => (i === index ? { ...c, ...patch } : c)));

  const addService = (index: number, serviceId?: number) => {
    if (!serviceId) return;
    const services = customers[index].services;
    const existing = services.find((s) => s.serviceId === serviceId);
    updateCustomer(index, {
      services: existing
        ? services.map((s) =>
            s.serviceId === serviceId ? { ...s, quantity: s.quantity + 1 } : s,
          )
        : [...services, { serviceId, quantity: 1 }],
    });
  };

  const changeQuantity = (index: number, serviceId: number, delta: number) =>
    updateCustomer(index, {
      services: customers[index].services.map((s) =>
        s.serviceId === serviceId
          ? { ...s, quantity: Math.max(1, s.quantity + delta) }
          : s,
      ),
    });

  const removeService = (index: number, serviceId: number) =>
    updateCustomer(index, {
      services: customers[index].services.filter(
        (s) => s.serviceId !== serviceId,
      ),
    });

  const totalServices = customers.reduce(
    (sum, c) => sum + c.services.reduce((s, x) => s + x.quantity, 0),
    0,
  );
  const estimate = customers.reduce(
    (acc, c) => {
      c.services.forEach((s) => {
        const svc = serviceMap[s.serviceId];
        acc.from += Number(svc?.priceFrom ?? 0) * s.quantity;
        acc.to += Number(svc?.priceTo ?? svc?.priceFrom ?? 0) * s.quantity;
      });
      return acc;
    },
    { from: 0, to: 0 },
  );

  const technicianLabel = (item: any) =>
    `${item.technicianName} - ${item.phone}`;

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
        <Typography.Text strong>{t("Customers & technicians")}</Typography.Text>
        {customers.length > 0 && (
          <Tag color="blue">
            {customers.length}{" "}
            {t(customers.length === 1 ? "customer" : "customers")}
          </Tag>
        )}
      </Row>

      <div style={{ paddingBottom: 8 }}>
        <span style={{ color: "#ff4d4f", marginInlineEnd: 4 }}>*</span>
        {t("Technician")}
        <span style={{ fontSize: 12, opacity: 0.55 }}>
          {" "}
          · {t("each technician = 1 customer")}
        </span>
      </div>
      <div style={{ marginBottom: customers.length ? 12 : 0 }}>
        <RemoteSelect
          mode="multiple"
          value={technicianIds}
          onChange={handleTechniciansChange}
          fetchList={DropdownApi.getTechnicians}
          fetchById={DropdownApi.getTechnicianById}
          fetchByIds={DropdownApi.getTechnicianByIds}
          labelKey={technicianLabel}
          valueKey="id"
          params={storeId ? { storeId } : {}}
          placeholder={t("Choose technician")}
          disabled={disabled}
        />
      </div>

      <Space direction="vertical" style={{ width: "100%" }} size={12}>
        {customers.map((customer, index) => {
          const tech = technicianMap[customer.technicianId];
          const lines = customer.services.reduce((s, x) => s + x.quantity, 0);
          return (
            <Card
              key={`${customer.technicianId}-${index}`}
              size="small"
              styles={{ body: { padding: 12 } }}
            >
              <Row align="middle" gutter={8} wrap={false}>
                <Col flex="none">
                  <Avatar src={tech?.avatar || undefined}>
                    {initials(tech?.technicianName)}
                  </Avatar>
                </Col>
                <Col flex="auto" style={{ minWidth: 0 }}>
                  <Typography.Text strong ellipsis>
                    {tech?.technicianName ?? `#${customer.technicianId}`}
                  </Typography.Text>
                  <div style={{ fontSize: 12, opacity: 0.65 }}>
                    {t("Customer")} {index + 1}
                    {index === 0 && ` · ${t("booker")}`}
                    {" · "}
                    {lines > 0
                      ? `${lines} ${t(lines === 1 ? "service" : "services")}`
                      : t("no services yet")}
                  </div>
                </Col>
                <Col flex="160px">
                  <RemoteSelect
                    value={customer.technicianId}
                    onChange={(id) =>
                      id && updateCustomer(index, { technicianId: Number(id) })
                    }
                    fetchList={DropdownApi.getTechnicians}
                    fetchById={DropdownApi.getTechnicianById}
                    fetchByIds={DropdownApi.getTechnicianByIds}
                    labelKey="technicianName"
                    valueKey="id"
                    params={storeId ? { storeId } : {}}
                    disabled={disabled}
                  />
                </Col>
                <Col flex="none">
                  <Tag color="blue" style={{ marginInlineEnd: 0 }}>
                    {index + 1}/{customers.length}
                  </Tag>
                </Col>
              </Row>

              <Space
                direction="vertical"
                style={{ width: "100%", marginTop: 12 }}
                size={8}
              >
                {customer.services.map((line) => {
                  const svc = serviceMap[line.serviceId];
                  const minutes = minutesOf(svc?.workingTime);
                  return (
                    <Card
                      key={line.serviceId}
                      size="small"
                      styles={{ body: { padding: "8px 12px" } }}
                    >
                      <Row align="middle" gutter={8} wrap={false}>
                        <Col flex="none">
                          <Avatar
                            shape="square"
                            size={44}
                            src={svc?.urlImage || undefined}
                            style={{
                              background:
                                SERVICE_COLORS[
                                  line.serviceId % SERVICE_COLORS.length
                                ],
                              borderRadius: 10,
                              fontWeight: 600,
                            }}
                          >
                            {initials(svc?.name)}
                          </Avatar>
                        </Col>
                        <Col flex="auto" style={{ minWidth: 0 }}>
                          <Typography.Text strong ellipsis>
                            {svc?.name ?? `#${line.serviceId}`}
                          </Typography.Text>
                          <div style={{ fontSize: 12, opacity: 0.65 }}>
                            {minutes != null && `${minutes} ${t("min")} · `}
                            {priceText(svc)}
                          </div>
                        </Col>
                        <Col flex="none">
                          <Space size={4}>
                            <Button
                              size="small"
                              shape="circle"
                              icon={<MinusOutlined />}
                              style={{ borderRadius: "50%" }}
                              disabled={disabled || line.quantity <= 1}
                              onClick={() =>
                                changeQuantity(index, line.serviceId, -1)
                              }
                            />
                            <span
                              style={{
                                minWidth: 20,
                                textAlign: "center",
                                display: "inline-block",
                              }}
                            >
                              {line.quantity}
                            </span>
                            <Button
                              size="small"
                              shape="circle"
                              icon={<PlusOutlined />}
                              disabled={disabled}
                              style={{
                                borderRadius: "50%",
                                background: ACCENT,
                                borderColor: ACCENT,
                                color: "#fff",
                              }}
                              onClick={() =>
                                changeQuantity(index, line.serviceId, 1)
                              }
                            />
                            <Button
                              size="small"
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              disabled={disabled}
                              onClick={() =>
                                removeService(index, line.serviceId)
                              }
                            />
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  );
                })}
                {addingIndex === index ? (
                  <RemoteSelect
                    value={undefined}
                    onChange={(id) => {
                      addService(index, id ? Number(id) : undefined);
                      setAddingIndex(null);
                    }}
                    onBlur={() => setAddingIndex(null)}
                    autoFocus
                    defaultOpen
                    fetchList={DropdownApi.getServices}
                    fetchById={DropdownApi.getServiceById}
                    fetchByIds={DropdownApi.getServiceByIds}
                    labelKey="name"
                    valueKey="id"
                    params={storeId ? { storeId } : {}}
                    placeholder={t("Search service")}
                  />
                ) : (
                  <Button
                    block
                    shape="round"
                    size="large"
                    icon={<PlusCircleOutlined />}
                    disabled={disabled || !storeId}
                    title={
                      !storeId ? t("Please choose store first") : undefined
                    }
                    onClick={() => setAddingIndex(index)}
                    style={{
                      borderRadius: 999,
                      borderColor: ACCENT,
                      color: ACCENT,
                      fontWeight: 600,
                      background: "transparent",
                    }}
                  >
                    {t("Add Service")}
                  </Button>
                )}
              </Space>
            </Card>
          );
        })}
      </Space>

      <Card size="small" style={{ marginTop: 12 }}>
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ fontSize: 12, opacity: 0.65 }}>
              {t("Customers (auto)")}
            </div>
            <Typography.Text strong>{customers.length}</Typography.Text>
          </Col>
          <Col span={8}>
            <div style={{ fontSize: 12, opacity: 0.65 }}>
              {t("Total services")}
            </div>
            <Typography.Text strong>{totalServices}</Typography.Text>
          </Col>
          <Col span={8}>
            <div style={{ fontSize: 12, opacity: 0.65 }}>{t("Estimated")}</div>
            <Typography.Text strong>
              {estimate.to > estimate.from
                ? `${formatNumber(estimate.from)} - ${formatNumber(estimate.to)}`
                : formatNumber(estimate.from)}
            </Typography.Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BookingCustomersEditor;

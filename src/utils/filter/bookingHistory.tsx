/* eslint-disable @typescript-eslint/no-explicit-any */
import { EyeOutlined } from "@ant-design/icons";
import { Button, Tag, Tooltip } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

export const DATE_FORMAT = "DD/MM/YYYY";
const TIME_FORMAT = "HH:mm";

export const BOOKING_STATUS: Record<number, { color: string; text: string }> = {
  1: { color: "orange", text: "Pending" },
  2: { color: "green", text: "Completed" },
  3: { color: "red", text: "Cancelled" },
  4: { color: "blue", text: "In progress" },
  5: { color: "purple", text: "Check-in" },
  6: { color: "default", text: "Close" },
};

/** Options cho filter Status (thứ tự theo luồng booking). */
export const BOOKING_STATUS_OPTIONS = [1, 5, 4, 2, 3, 6].map((value) => ({
  value,
  label: BOOKING_STATUS[value].text,
}));

export const filters = [
  {
    name: "Enter name, email, phone ...",
    field: "searchText",
    type: "text",
    popup: false,
    isActive: true,
  },
  {
    // Từ ngày – đến ngày (theo ngày booking), hiển thị RangePicker cạnh ô tìm kiếm
    key: "dateRange",
    name: "Date Range",
    field: "dateRange",
    type: "dateRange",
    popup: true,
    isActive: false,
  },
  {
    key: "status",
    name: "Status",
    field: "status",
    type: "select",
    popup: true,
    isActive: false,
    actionName: "bookingStatus",
  },
  {
    // Chỉ portal: admin xem nhiều cửa hàng
    key: "store",
    name: "Store",
    field: "storeId",
    type: "select",
    popup: true,
    isActive: false,
    actionName: "store",
  },
];

const technicianNames = (record: any) =>
  (record?.technicians || [])
    .map((x: any) => x?.technician?.technicianName)
    .filter(Boolean)
    .join(", ");

const serviceNames = (record: any) => {
  const names = (record?.technicians || []).flatMap((x: any) =>
    (x?.services || []).map((s: any) => s?.name),
  );
  return Array.from(new Set(names.filter(Boolean))).join(", ");
};

export const columns = ({
  t,
  handleView,
}: {
  t: any;
  handleView: (record: any) => void;
}) => [
  {
    title: t("Booking date"),
    dataIndex: "bookingDate",
    key: "bookingDate",
    width: 110,
    render: (date: string) => (date ? dayjs(date).format(DATE_FORMAT) : "-"),
  },
  {
    title: t("Booking time"),
    dataIndex: "bookingTime",
    key: "bookingTime",
    width: 90,
    render: (time: string) =>
      time ? dayjs(time, "HH:mm:ss").format(TIME_FORMAT) : "-",
  },
  {
    title: t("Full name"),
    dataIndex: "fullName",
    key: "fullName",
    width: 180,
    render: (text: string, record: any) => (
      <Link to={`/booking/${record.id}`}>{text || "-"}</Link>
    ),
  },
  {
    title: t("Phone"),
    dataIndex: "phone",
    key: "phone",
    width: 130,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 180,
    hidden: true,
  },
  {
    title: t("Store name"),
    dataIndex: "store",
    key: "store",
    width: 180,
    render: (_: any, record: any) => record?.store?.storeName || "-",
  },
  {
    title: t("Technician"),
    dataIndex: "technicians",
    key: "technicians",
    width: 180,
    render: (_: any, record: any) => technicianNames(record) || "-",
  },
  {
    title: t("Service"),
    dataIndex: "services",
    key: "services",
    width: 220,
    render: (_: any, record: any) => serviceNames(record) || "-",
  },
  {
    title: t("Number"),
    dataIndex: "number",
    key: "number",
    width: 80,
    hidden: true,
  },
  {
    title: t("Status"),
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status: number) => {
      const s = BOOKING_STATUS[status];
      return s ? <Tag color={s.color}>{t(s.text)}</Tag> : t("Unknown");
    },
  },
  {
    title: t("Note"),
    dataIndex: "note",
    key: "note",
    width: 190,
    hidden: true,
  },
  {
    title: t("Created at"),
    dataIndex: "created",
    key: "created",
    width: 150,
    render: (date: string) =>
      date ? dayjs(date).format(`${DATE_FORMAT} ${TIME_FORMAT}`) : "-",
  },
  {
    fixed: "right",
    align: "center",
    title: t("Action"),
    dataIndex: "action",
    key: "action",
    width: 60,
    render: (_: any, record: any) => (
      <Tooltip title={t("View")}>
        <Button
          className="button-none-style "
          onClick={() => handleView(record)}
          style={{ color: "#1890ff" }}
        >
          <EyeOutlined style={{ fontSize: 16 }} />
        </Button>
      </Tooltip>
    ),
  },
];

export const buttons = [];

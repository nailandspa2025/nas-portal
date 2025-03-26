/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
export const filters = [
  {
    name: "Enter name, email, phone ...",
    field: "searchText",
    type: "text",
    popup: false,
    isActive: true,
  },
];
export const columns = (items: any) => {
  const { t } = useTranslation();
  return [
    {
      title: t("Full name"),
      dataIndex: "fullName",
      key: "fullName",
      width: 180,
      render: (text: string, record: { id: string }) => (
        <Link to={`/user/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
    },
    {
      title: t("Phone"),
      dataIndex: "phone",
      key: "phone",
      width: 140,
    },
    {
      title: t("Address"),
      dataIndex: "street",
      key: "street",
      width: 180,
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: 100,
      hidden: false,
      render: (status: number) => {
        const statusMap: Record<number, { color: string; text: string }> = {
          1: { color: "orange", text: t("Pending") },
          2: { color: "green", text: t("Completed") },
          3: { color: "red", text: t("Cancelled") },
        };

        const { color, text } = statusMap[status as keyof typeof statusMap] || {
          color: "gray",
          text: t("Unknown"),
        };

        return <span style={{ color, fontWeight: "bold" }}>{text}</span>;
      },
    },
    {
      title: t("Booking date"),
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: 100,
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: t("Booking time"),
      dataIndex: "bookingTime",
      key: "bookingTime",
      width: 100,
      render: (time: string) =>
        time ? dayjs(time, "HH:mm:ss").format("HH:mm A") : "-",
    },
    {
      title: t("Number"),
      dataIndex: "number",
      key: "number",
      width: 80,
    },
    {
      title: t("Note"),
      dataIndex: "note",
      key: "note",
      width: 190,
    },
    {
      fixed: "right",
      align: "center",
      title: t("Action"),
      dataIndex: "action",
      key: "action",
      width: 60,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title={t("Edit")}>
            <a
              onClick={() => items.handleEdit(record)}
              style={{ color: "#1890ff" }}
            >
              <FormOutlined style={{ fontSize: 16 }} />
            </a>
          </Tooltip>
          <Tooltip title={t("Delete")}>
            <a
              onClick={() => items.handleDelete(record)}
              style={{ color: "#ff4d4f" }}
            >
              <DeleteOutlined style={{ fontSize: 16 }} />
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];
};

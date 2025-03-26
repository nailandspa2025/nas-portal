/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Rate, Space, Tooltip } from "antd";
import { t } from "i18next";
import { Link } from "react-router-dom";

export const columns = (items: any) => [
  {
    title: t("Avatar"),
    key: "avatar",
    width: 80,
    render: (row: { avatar?: string }) => (
      <Avatar
        size={50}
        icon={!row?.avatar ? <UserOutlined /> : undefined}
        src={row?.avatar || undefined}
      />
    ),
  },

  {
    title: t("Full name"),
    dataIndex: "technicianName",
    key: "technicianName",
    width: 280,
    render: (text: string, record: { id: string }) => (
      <Link to={`/technician/${record.id}`}>{text}</Link>
    ),
  },
  {
    title: t("Phone"),
    dataIndex: "phone",
    key: "phone",
    width: 140,
  },

  {
    title: t("Address"),
    dataIndex: "technicianAddress",
    key: "technicianAddress",
    //width: 250,
  },
  {
    title: t("Rating"),
    dataIndex: "ratingStar",
    key: "ratingStar",
    width: 180,
    render: (rating: number) => (
      <Rate allowHalf disabled defaultValue={rating} />
    ),
  },
  {
    align: "center",
    fixed: "right",
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

export const filters = [
  {
    name: "Enter name, phone, email...",
    field: "searchText",
    type: "text",
    popup: false,
    isActive: true,
  },
];

export const buttons = [
  {
    position: "right",
    label: "Create",
    funcName: "createNew",
    color: "primary",
  },
];

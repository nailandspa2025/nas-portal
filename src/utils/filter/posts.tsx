/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Space, Tooltip } from "antd";
import { t } from "i18next";
import dayjs from "dayjs";

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
    title: t("Title"),
    dataIndex: "title",
    key: "title",
    width: 150,
  },
  {
    title: t("Description"),
    dataIndex: "description",
    key: "description",
    width: 220,
  },
  {
    title: t("Created by"),
    dataIndex: "createdBy",
    key: "createdBy",
    width: 140,
  },
  {
    title: t("created at"),
    dataIndex: "created",
    key: "created",
    width: 140,
    render: (created: string) => dayjs(created).format("DD/MM/YYYY HH:mm:ss"),
  },
  {
    title: t("Contet"),
    dataIndex: "content",
    key: "content",
    width: 250,
    render: (text: string) => (
      <span
        dangerouslySetInnerHTML={{
          __html: text.replace(
            /<img /g,
            '<img style="max-width: 40px; height: 40px;; display: block; margin: -10px 0;" '
          ),
        }}
      />
    ),
    hidden: true,
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
    name: "Enter title, description...",
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

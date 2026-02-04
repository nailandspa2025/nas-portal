/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";
import { Space, Tooltip, Avatar } from "antd";
import { Link } from "react-router-dom";

export const columns = ({
  hasEditPermission,
  hasDeletePermission,
  t,
  handleEdit,
  handleDelete,
}: {
  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  t: any;
  handleEdit: (record: any) => void;
  handleDelete: (record: any) => void;
}) => {
  return [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text: string, record: { id: string }) => (
        <Link to={`/config-reminder/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: t("Store"),
      dataIndex: "storeName",
      key: "storeName",
      width: 220,
      render: (storeName: string) => storeName || "-",
    },
    {
      title: t("Before"),
      dataIndex: "beforeMinute",
      key: "beforeMinute",
      width: 120,
      render: (beforeMinute: number) => beforeMinute || "-",
    },
    {
      title: t("Channel"),
      dataIndex: "channel",
      key: "channel",
      width: 120,
      render: (channel: string) => channel || "-",
    },
    {
      title: t("Status"),
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <span style={{ color: isActive ? "green" : "red" }}>
          {isActive ? t("Active") : t("Inactive")}
        </span>
      ),
      width: 100,
      hidden: false,
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
          {hasEditPermission && (
            <Tooltip title={t("Edit")}>
              <a
                onClick={() => handleEdit(record)}
                style={{ color: "#1890ff" }}
              >
                <FormOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
          )}
          {hasDeletePermission && (
            <Tooltip title={t("Delete")}>
              <a
                onClick={() => handleDelete(record)}
                style={{ color: "#ff4d4f" }}
              >
                <DeleteOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];
};
export const filters = [
  {
    name: "Enter title ...",
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
    accessRight: ["config-reminder.create", "config-reminder.admin", "admin"],
  },
];

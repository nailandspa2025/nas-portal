/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Tooltip, Space } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const columns = (items: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();
  return [
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
      title: t("Store"),
      dataIndex: "storeName",
      key: "storeName",
      width: 210,
      render: (text: string, record: { id: string }) => (
        <Link to={`/store/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: t("Hotline"),
      dataIndex: "hotline",
      key: "hotline",
      width: 120,
    },
    {
      title: t("Open Time"),
      dataIndex: "openTime",
      key: "openTime",
      width: 120,
    },
    {
      title: t("Close Time"),
      dataIndex: "closeTime",
      key: "closeTime",
      width: 120,
    },
    {
      title: t("Address"),
      dataIndex: "addressStore",
      key: "addressStore",
      width: 250,
    },
    {
      title: t("Latitude"),
      dataIndex: "lat",
      key: "lat",
      width: 120,
    },
    {
      title: t("Longitude"),
      dataIndex: "lng",
      key: "lng",
      width: 120,
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
};

export const filters = [
  {
    name: "searchText",
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

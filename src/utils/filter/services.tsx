/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Tooltip, Space } from "antd";
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
      title: t("Avatar"),
      key: "urlImage",
      width: 80,
      render: (row: { urlImage?: string }) => (
        <Avatar
          size={50}
          icon={!row?.urlImage ? <UserOutlined /> : undefined}
          src={row?.urlImage || undefined}
        />
      ),
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      width: 210,
      render: (text: string, record: { id: string }) => (
        <Link to={`/service/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: t("Code"),
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: t("Description"),
      dataIndex: "description",
      key: "description",
      width: 250,
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
    accessRight: ["store.import", "store.admin", "admin"],
  },
];

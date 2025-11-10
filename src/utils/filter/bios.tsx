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
      title: t("Store"),
      dataIndex: "storeName",
      key: "storeName",
      width: 200,
      render: (text: string, record: { id: string }) => (
        <Link to={`/bio/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: t("Text"),
      dataIndex: "text",
      key: "text",
      width: 220,
      render: (text: string) => text || "-",
    },
    {
      title: t("Image"),
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (image: string) =>
        image ? (
          <Avatar
            shape="square"
            size={50}
            icon={!image ? <UserOutlined /> : undefined}
            src={image || undefined}
          />
        ) : (
          "-"
        ),
    },
    {
      title: t("File"),
      dataIndex: "file",
      key: "file",
      width: 180,
      render: (file: string) =>
        file ? (
          <a href={file} target="_blank" rel="noopener noreferrer">
            {file}
          </a>
        ) : (
          "-"
        ),
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
      title: t("Description"),
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (text: string) => text || "-",
      hidden: true,
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
    accessRight: ["category.create", "category.admin", "admin"],
  },
];

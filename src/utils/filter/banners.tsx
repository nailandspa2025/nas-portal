/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Space, Tooltip } from "antd";
import dayjs from "dayjs";
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
      title: t("Banner"),
      key: "banner",
      width: 80,
      render: (row: { imageUrls?: string[] }, record: { id: number }) => (
        <Link to={`/banner/${record.id}`}>
          <Avatar
            size={50}
            icon={!row?.imageUrls?.[0] ? <UserOutlined /> : undefined}
            src={row?.imageUrls?.[0] || undefined}
          />
        </Link>
      ),
    },
    {
      title: t("Title"),
      dataIndex: "title",
      key: "title",
      width: 140,
    },
    {
      title: t("Link"),
      dataIndex: "link",
      key: "link",
      width: 140,
    },
    {
      title: t("Images"),
      dataIndex: "imageUrls",
      key: "imageUrls",
      width: 180,
      render: (imageUrls: string[]) => (
        <span>
          {t("Have")} {imageUrls?.length || 0} {t("images")}
        </span>
      ),
    },
    {
      title: t("From date "),
      dataIndex: "showFrom",
      key: "showFrom",
      width: 100,
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: t("To date "),
      dataIndex: "showTo",
      key: "showTo",
      width: 100,
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
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
    accessRight: ["banner.create", "banner.admin", "admin"],
  },
];

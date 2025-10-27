/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Space, Tooltip } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
export const filters = [
  {
    name: "Enter name, email, phone ...",
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
    accessRight: ["merchant.create", "merchant.admin", "admin"],
  },
];

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
      title: t("Logo merchant"),
      key: "logo",
      width: 80,
      render: (row: { logo?: string }) => (
        <Avatar
          size={50}
          icon={!row?.logo ? <UserOutlined /> : undefined}
          src={row?.logo || undefined}
        />
      ),
    },
    {
      title: t("Merchant"),
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text: string, record: { id: number }) => (
        <Link to={`/groupmerchant/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: t("Country"),
      dataIndex: "country",
      key: "country",
      width: 120,
      render: (country: string) => country || "Unknown",
    },
    {
      title: t("Tax code"),
      dataIndex: "taxCode",
      key: "taxCode",
      width: 120,
    },
    {
      title: t("Contact information"),
      dataIndex: "information",
      key: "information",
      width: 140,
      render: (_: any, record: any) => (
        <>
          <div>{record.represent}</div>
          <div>{record.phoneNumber}</div>
          <div>{record.email}</div>
        </>
      ),
    },
    {
      title: t("Contact date"),
      dataIndex: "contactDate",
      key: "contactDate",
      width: 140,
      render: (contactDate: string | null | undefined) =>
        contactDate ? dayjs(contactDate).format("DD/MM/YYYY") : "Unknown",
    },

    {
      title: t("Contract number"),
      dataIndex: "contractNumber",
      key: "contractNumber",
      width: 140,
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

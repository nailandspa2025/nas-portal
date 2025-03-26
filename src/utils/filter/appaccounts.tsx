/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserOutlined, FormOutlined } from "@ant-design/icons";
import { Avatar, Space, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
export const columns = (items: any) => {
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
      width: 220,
    },
    {
      title: t("Phone"),
      dataIndex: "phone",
      key: "phone",
      width: 140,
    },
    {
      title: t("Gender"),
      dataIndex: "gender",
      key: "gender",
      width: 80,
      render: (gender: number) =>
        ({ 1: "Male", 2: "Female", 3: "Other" }[gender] || "Unknown"),
    },
    {
      title: t("Birthday"),
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 120,
      render: (created: string) => dayjs(created).format("DD/MM/YYYY"),
    },
    {
      title: t("Address"),
      dataIndex: "street",
      key: "street",
      width: 250,
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
          <Tooltip title={t("Edit")}>
            <a
              onClick={() => items.handleEdit(record)}
              style={{ color: "#1890ff" }}
            >
              <FormOutlined style={{ fontSize: 16 }} />
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];
};

export const filters = [
  {
    name: "Enter name, email, phone ...",
    field: "searchText",
    type: "text",
    popup: false,
    isActive: true,
  },
  {
    key: "status",
    name: "Status",
    field: "isActive",
    type: "radioActive",
    popup: true,
    isActive: false,
    value: "false",
  },
];
export const buttons = [
  {
    position: "right",
    label: "Create",
    funcName: "createNew",
    color: "primary",
    accessRight: ["customer.insert", "customer.admin", "admin"],
  },
];

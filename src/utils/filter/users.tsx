/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UploadOutlined,
  DownloadOutlined,
  UserOutlined,
  FormOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Avatar, Space, Tooltip } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
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
      title: t("Phone number"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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
      title: t("Address"),
      dataIndex: "street",
      key: "street",
      width: 250,
    },
    {
      title: t("City"),
      dataIndex: "cityName",
      key: "cityName",
      width: 150,
      hidden: true,
    },
    {
      title: t("District"),
      dataIndex: "districtName",
      key: "districtName",
      width: 150,
      hidden: true,
    },
    {
      title: t("Ward"),
      dataIndex: "wardName",
      key: "wardName",
      width: 150,
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
  {
    key: "userType",
    name: "User type",
    field: "userType",
    type: "select",
    popup: true,
    isActive: false,
    actionName: "userType",
  },
  // {
  //   key: "createdBy",
  //   name: "Tạo bởi",
  //   field: "createdBy",
  //   type: "select",
  //   popup: true,
  //   isActive: false,
  //   actionName: "username",
  //   remoteServer: true,
  // },
  // {
  //   key: "updatedBy",
  //   name: "Cập nhật bởi",
  //   field: "updatedBy",
  //   type: "select",
  //   popup: true,
  //   isActive: false,
  //   actionName: "username",
  //   remoteServer: true,
  // },
  // {
  //   key: "category",
  //   name: "Loại tin tức",
  //   field: "category",
  //   type: "multiSelect",
  //   popup: true,
  //   isActive: false,
  //   actionName: "articleType",
  //   remoteServer: true,
  // },// {
  //   key: "delete",
  //   name: "Đã xoá",
  //   field: "isDelete",
  //   type: "radioYesNo",
  //   popup: true,
  //   isActive: false,
  //   value: "false",
  // },
  // {
  //   key: "assigned",
  //   name: "Phân bổ",
  //   field: "isAssigned",
  //   type: "select",
  //   popup: true,
  //   isActive: true,
  //   value: "false",
  //   selected: { label: "Chưa phân bổ" },
  //   actionName: "assignmentStatuses",
  // },
];
export const buttons = [
  {
    position: "right",
    label: "Create",
    funcName: "createNew",
    color: "primary",
    accessRight: ["user.create", "user.admin", "admin"],
  },
  // {
  //   position: "left",
  //   label: "Detail",
  //   funcName: "detail",
  //   color: "pink",
  //   accessRight: ["user.create", "user.admin", "admin"],
  // },
];
export const actions = [
  {
    icon: <UploadOutlined />,
    label: "Import data",
    funcName: "importExcel",
    accessRight: ["user.import", "user.admin", "admin"],
  },
  {
    icon: <DownloadOutlined />,
    label: "Export data",
    funcName: "exportExcel",
    accessRight: ["user.import", "user.admin", "admin"],
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import { Link } from "react-router-dom";

const processMap: Record<number, string> = {
  1: "Payment",
  2: "Event",
};
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
      width: 220,
      render: (text: string, record: { id: number }) => (
        <Link to={`/loyalty-program/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: t("Process"),
      dataIndex: "process",
      key: "process",
      width: 100,
      render: (process: number) => processMap[process] || "N/A",
    },
    {
      title: t("Standard"),
      dataIndex: "standard",
      key: "standard",
      width: 100,
      render: (standard: any) => standard || "N/A",
    },
    {
      title: t("Upgrade"),
      dataIndex: "tierName",
      key: "tierName",
      width: 150,
      render: (upgrade: any) => upgrade || "N/A",
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
    name: "Enter name ...",
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
    accessRight: ["loyalty-program.create", "loyalty-program.admin", "admin"],
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
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
      width: 220,
      render: (text: string, record: { id: number }) => (
        <Link to={`/loyalty-program/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: t("Tier"),
      dataIndex: "tierName",
      key: "tierName",
      width: 130,
      render: (tier: any) => tier || "N/A",
    },
    {
      title: t("Group"),
      dataIndex: "groupName",
      key: "groupName",
      width: 120,
      render: (group: any) => group || "N/A",
    },
    {
      title: t("Award"),
      dataIndex: "award",
      key: "award",
      width: 130,
      render: (_: any, record: any) => {
        if (record.amountPerPoint && record.pointValue) {
          return `$${record.amountPerPoint} - ${record.pointValue} ${t(
            "Point"
          )}`;
        }
        return "N/A";
      },
    },
    {
      title: t("Reward Calculation"),
      dataIndex: "roundingRule",
      key: "roundingRule",
      width: 130,
      render: (roundingRule: number) => {
        if (roundingRule == 1) return t("Round up");
        if (roundingRule == 2) return t("Round down");
        return "N/A";
      },
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

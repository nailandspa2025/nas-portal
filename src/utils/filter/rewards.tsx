/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import { Link } from "react-router-dom";
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
    field: "status",
    type: "select",
    popup: true,
    isActive: false,
    actionName: "rewardStauts",
  },
  {
    key: "merchant",
    name: "Merchant",
    field: "merchantId",
    type: "select",
    popup: true,
    isActive: false,
    actionName: "merchant",
  },
];
export const buttons = [
  {
    position: "right",
    label: "Create",
    funcName: "createNew",
    color: "primary",
    accessRight: ["reward.create", "reward.admin", "admin"],
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
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text: string, record: { id: number }) => (
        <Link to={`/reward/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: t("Reward type"),
      dataIndex: "rewardType",
      key: "rewardType",
      width: 120,
      render: (rewardType: number) => {
        const rewardTypeMap: Record<number, string> = {
          1: "Cashback",
          2: "Point",
          3: "Booking",
        };
        return rewardTypeMap[rewardType] || "-";
      },
    },

    {
      title: t("Merchant name"),
      dataIndex: "merchantName",
      key: "merchantName",
      width: 140,
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        const statusMap: Record<number, { color: string; text: string }> = {
          1: { color: "orange", text: t("Pending") },
          2: { color: "green", text: t("Approved") },
          3: { color: "red", text: t("Rejected") },
        };

        const { color, text } = statusMap[status as keyof typeof statusMap] || {
          color: "gray",
          text: t("Unknown"),
        };

        return <span style={{ color, fontWeight: "bold" }}>{text}</span>;
      },
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

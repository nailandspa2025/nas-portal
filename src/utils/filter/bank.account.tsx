/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Tooltip, Space } from "antd";
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
      title: t("Account Name"),
      dataIndex: "accountName",
      key: "accountName",
      width: 210,
      render: (text: string, record: { id: string }) => (
        <Link to={`/bank/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: t("Account Number"),
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 120,
    },
    {
      title: t("Bank Name"),
      dataIndex: "bankName",
      key: "bankName",
      width: 180,
      render: (name: string) => <span>{name}</span>,
    },
    {
      title: t("Branch Name"),
      dataIndex: "branchName",
      key: "branchName",
      width: 180,
      render: (name: string) => <span>{name}</span>,
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
    accessRight: ["bank.import", "bank.admin", "admin"],
  },
];

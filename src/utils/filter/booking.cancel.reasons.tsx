/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
import dayjs from "dayjs";
export const filters = [
  {
    name: "Enter name, email, phone ...",
    field: "searchText",
    type: "text",
    popup: false,
    isActive: true,
  },
  {
    key: "isActive",
    name: "Status",
    field: "isActive",
    type: "radioActive",
    popup: true,
    isActive: false,
    value: "false",
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
      key: "fullName",
      width: 180,
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
      title: t("System information"),
      dataIndex: "system",
      key: "system",
      width: 200,
      ellipsis: true,
      render: (_: any, record: any) => (
        <>
          <div>
            <span>
              {record.createdBy} -{" "}
              {dayjs(record.created).format("HH:mm - DD/MM/YYYY")}
            </span>
          </div>
          {record.lastModifiedBy && (
            <div>
              <span>
                {record.lastModifiedBy} -{" "}
                {dayjs(record.lastModified).format("HH:mm - DD/MM/YYYY")}
              </span>
            </div>
          )}
        </>
      ),
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
              <Button
                className="button-none-style "
                onClick={() => handleEdit(record)}
                style={{ color: "#1890ff" }}
              >
                <FormOutlined style={{ fontSize: 16 }} />
              </Button>
            </Tooltip>
          )}
          {hasDeletePermission && (
            <Tooltip title={t("Delete")}>
              <Button
                className="button-none-style "
                onClick={() => handleDelete(record)}
                style={{ color: "#ff4d4f" }}
              >
                <DeleteOutlined style={{ fontSize: 16 }} />
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];
};
export const buttons = [
  {
    position: "right",
    label: "Create",
    funcName: "createNew",
    color: "primary",
    accessRight: ["booking.create", "booking.admin", "admin"],
  },
];

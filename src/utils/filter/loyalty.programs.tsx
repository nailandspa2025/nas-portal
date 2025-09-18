/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
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
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      width: 280,
      render: (text: string, record: { id: number }) => (
        <Link to={`/loyalty-program/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: t("Point name"),
      dataIndex: "pointNames",
      key: "pointNames",
      width: 180,
      render: (pointNames: any) => {
        if (Array.isArray(pointNames)) {
          return pointNames.join(", ");
        }
        return pointNames;
      },
    },
    {
      title: t("Start date"),
      dataIndex: "startDate",
      key: "startDate",
      width: 100,
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: t("End date"),
      dataIndex: "endDate",
      key: "endDate",
      width: 100,
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: t("Status"),
      dataIndex: "isDraft",
      key: "isDraft",
      render: (isDraft: boolean) => (
        <span>
          {isDraft ? (
            <Button
              type="link"
              style={{ color: "#3d9acc", background: "#dbf2ff" }}
            >
              {t("Draft")}
            </Button>
          ) : (
            <Button
              type="link"
              style={{ color: "#107c10", background: "#dff6dd" }}
            >
              {t("Published")}
            </Button>
          )}
        </span>
      ),
      width: 100,
      hidden: false,
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
    accessRight: ["loyalty-point.create", "loyalty-point.admin", "admin"],
  },
];

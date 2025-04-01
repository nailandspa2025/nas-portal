/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { Space, Tooltip } from "antd";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
export const columns = (items: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();
  return [
    {
      title: t("Group name"),
      dataIndex: "name",
      key: "name",
      width: 280,
      render: (text: string, record: { id: number }) => (
        <Link to={`/group/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: t("Number of members"),
      dataIndex: "count",
      key: "count",
      width: 180,
      render: (count: number) => (
        <span>
          {t("Have")} {count?.toString()} {t("members")}
        </span>
      ),
    },
    {
      title: t("Note"),
      dataIndex: "note",
      key: "note",
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
      title: t("System information"),
      dataIndex: "system",
      key: "system",
      render: (_: any, record: any) => (
        <>
          <div>
            <span>
              {record.createdBy} {" - "}
              {dayjs(record.created).format("HH:mm - DD/MM/YYYY")}
            </span>
          </div>
          {record.lastModifiedBy && (
            <div>
              <span>
                {record.lastModifiedBy}
                {" - "}
                {dayjs(record.lastModified).format("HH:mm - DD/MM/YYYY")}
              </span>
            </div>
          )}
        </>
      ),
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
          <Tooltip title={t("Edit")}>
            <a
              onClick={() => items.handleEdit(record)}
              style={{ color: "#1890ff" }}
            >
              <FormOutlined style={{ fontSize: 16 }} />
            </a>
          </Tooltip>
          <Tooltip title={t("Delete")}>
            <a
              onClick={() => items.handleDelete(record)}
              style={{ color: "#ff4d4f" }}
            >
              <DeleteOutlined style={{ fontSize: 16 }} />
            </a>
          </Tooltip>
        </Space>
      ),
    },
  ];
};

export const filters = [
  {
    name: "Enter group name",
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
  },
];

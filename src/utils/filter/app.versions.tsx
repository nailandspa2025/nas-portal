/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormOutlined } from "@ant-design/icons";
import { Button, Space, Switch, Tooltip } from "antd";

export const filters = [
  {
    name: "Enter name, platform ...",
    field: "searchText",
    type: "text",
    popup: false,
    isActive: true,
  },
];

export const columns = ({
  hasEditPermission,
  t,
  handleEdit,
  handleToggleRequired,
  togglingId,
}: {
  hasEditPermission: boolean;
  t: any;
  handleEdit: (record: any) => void;
  handleToggleRequired: (record: any, checked: boolean) => void;
  togglingId?: number | null;
}) => {
  return [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      width: 180,
    },
    {
      title: t("Platform"),
      dataIndex: "platform",
      key: "platform",
      width: 120,
    },
    {
      title: t("Version"),
      dataIndex: "version",
      key: "version",
      width: 120,
    },
    {
      title: t("Required update"),
      dataIndex: "isRequired",
      key: "isRequired",
      align: "center",
      width: 140,
      render: (isRequired: boolean, record: any) => (
        <Switch
          checked={!!isRequired}
          disabled={!hasEditPermission}
          loading={togglingId === record.id}
          onChange={(checked) => handleToggleRequired(record, checked)}
        />
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
    accessRight: ["app-version.create", "app-version.admin", "admin"],
  },
];

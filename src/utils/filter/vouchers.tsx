/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";
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
      title: t("Image"),
      key: "urlVoucher",
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
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      width: 180,
      render: (text: string, record: { id: string }) => (
        <Link to={`/voucher/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      width: 120,
      render: (totalQuantity: number) => {
        return totalQuantity != null ? totalQuantity.toLocaleString() : "_";
      },
    },
    {
      title: "Validity Days",
      dataIndex: "validityDays",
      key: "validityDays",
      width: 120,
      render: (validityDays: number) => {
        return validityDays != null ? validityDays.toLocaleString() : "_";
      },
    },
    {
      title: "Converted points",
      dataIndex: "requiredPoint",
      key: "requiredPoint",
      width: 120,
      render: (point: number) => {
        return point != null ? point.toLocaleString() : "_";
      },
    },

    {
      title: t("Discount Type"),
      dataIndex: "discountType",
      key: "discountType",
      width: 170,
      render: (discountType: number) =>
        ({ 1: "Percent", 2: "FixedAmount", 3: "Other" })[discountType] ||
        "Unknown",
    },
    {
      title: t("Discount Value"),
      dataIndex: "discountValue",
      key: "discountValue",
      width: 140,
      render: (_: any, record: any) => {
        if (record.discountType === 1) {
          return `${record.discountValue}%`;
        }
        return record.discountValue?.toLocaleString() ?? "-";
      },
    },
    {
      title: t("IssuedAt"),
      dataIndex: "issuedAt",
      key: "issuedAt",
      width: 120,
      render: (issuedAt: string | null | undefined) =>
        issuedAt ? dayjs(issuedAt).format("DD/MM/YYYY") : "Unknown",
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
    name: "Enter name, ...",
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
    accessRight: ["voucher.create", "voucher.admin", "admin"],
  },
];
// export const actions = [
//   {
//     icon: <UploadOutlined />,
//     label: "Import data",
//     funcName: "importExcel",
//     accessRight: ["user.import", "user.admin", "admin"],
//   },
//   {
//     icon: <DownloadOutlined />,
//     label: "Export data",
//     funcName: "exportExcel",
//     accessRight: ["user.import", "user.admin", "admin"],
//   },
// ];

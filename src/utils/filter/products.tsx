/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { Space, Tooltip } from "antd";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";

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
      title: t("Product name"),
      dataIndex: "productName",
      key: "productName",
      width: 280,
      render: (text: string, record: { id: number }) => (
        <Link to={`/product/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: t("Store"),
      dataIndex: "storeName",
      key: "storeName",
      width: 180,
    },
    {
      title: t("Price"),
      dataIndex: "price",
      key: "price",
      width: 180,
      render: (price: number) => <span>{price?.toLocaleString()}</span>,
    },

    {
      title: t("Description"),
      dataIndex: "description",
      key: "description",
      width: 250,
      render: (text: string) => (
        <span
          dangerouslySetInnerHTML={{
            __html: text.replace(
              /<img /g,
              '<img style="max-width: 40px; height: 40px;; display: block; margin: -10px 0;" '
            ),
          }}
        />
      ),
      hidden: true,
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
    name: "Nhập tên sản phẩm",
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
    accessRight: ["product.import", "product.admin", "admin"],
  },
];

import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";

export const columns = [
  {
    title: "Họ và Tên",
    dataIndex: "name",
    key: "name",
    hidden: false,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    hidden: false,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    hidden: false,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (text: string) => (
      <span style={{ color: text === "Active" ? "green" : "red" }}>{text}</span>
    ),
    hidden: true,
  },
];

export const filters = [
  {
    name: "Nhập số điện thoại, email...",
    field: "searhText",
    type: "text",
    popup: false,
    isActive: true,
  },

  {
    key: "status",
    name: "Trạng thái",
    field: "isActive",
    type: "radioActive",
    popup: true,
    isActive: false,
    //selected: { label: "Không hoạt động" },
    value: "false",
  },

  {
    key: "createdBy",
    name: "Tạo bởi",
    field: "createdBy",
    type: "select",
    popup: true,
    isActive: false,
    actionName: "username",
    remoteServer: true,
  },
  {
    key: "updatedBy",
    name: "Cập nhật bởi",
    field: "updatedBy",
    type: "select",
    popup: true,
    isActive: false,
    actionName: "username",
    remoteServer: true,
  },
  // {
  //   key: "category",
  //   name: "Loại tin tức",
  //   field: "category",
  //   type: "multiSelect",
  //   popup: true,
  //   isActive: false,
  //   actionName: "articleType",
  //   remoteServer: true,
  // },// {
  //   key: "delete",
  //   name: "Đã xoá",
  //   field: "isDelete",
  //   type: "radioYesNo",
  //   popup: true,
  //   isActive: false,
  //   value: "false",
  // },
  // {
  //   key: "assigned",
  //   name: "Phân bổ",
  //   field: "isAssigned",
  //   type: "select",
  //   popup: true,
  //   isActive: true,
  //   value: "false",
  //   selected: { label: "Chưa phân bổ" },
  //   actionName: "assignmentStatuses",
  // },
];
export const buttons = [
  {
    position: "right",
    label: "Thêm mới",
    funcName: "createNew",
    color: "primary",
    accessRight: ["customer.insert", "customer.admin", "admin"],
  },
  // {
  //   position: "left",
  //   label: "Chi tiêt",
  //   funcName: "detail",
  //   color: "pink",
  //   accessRight: ["customer.insert", "customer.admin", "admin"],
  // },
];
export const actions = [
  {
    icon: <UploadOutlined />,
    label: "Nhập liệu",
    funcName: "importExcel",
    accessRight: ["users.import", "users.admin", "admin"],
  },
  {
    icon: <DownloadOutlined />,
    label: "Xuất dũ liệu",
    funcName: "exportExcel",
    accessRight: ["users.import", "users.admin", "admin"],
  },
];

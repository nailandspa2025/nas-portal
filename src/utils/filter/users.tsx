import {
  UploadOutlined,
  DownloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar } from "antd";

export const columns = [
  {
    title: "Hình ảnh",
    key: "avatar",
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
    title: "Họ và Tên",
    dataIndex: "fullName",
    key: "fullName",
    width: 180,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 220,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    width: 140,
  },
  {
    title: "Loại",
    dataIndex: "userType",
    key: "userType",
    width: 80,
    render: (userType: number) => (
      <span>{userType === 1 ? "Admin" : "User"}</span>
    ),
  },

  {
    title: "Địa chỉ",
    dataIndex: "street",
    key: "street",
    width: 250,
  },
  {
    title: "Tỉnh/thành",
    dataIndex: "cityName",
    key: "cityName",
    width: 150,
  },
  {
    title: "Quận/huyện",
    dataIndex: "districtName",
    key: "districtName",
    width: 150,
  },
  {
    title: "Phường/xã",
    dataIndex: "wardName",
    key: "wardName",
    width: 150,
  },
  {
    title: "Trạng thái",
    dataIndex: "isActive",
    key: "isActive",
    render: (isActive: boolean) => (
      <span style={{ color: isActive ? "green" : "red" }}>
        {isActive ? "Active" : "Inactive"}
      </span>
    ),
    width: 100,
    hidden: true,
  },
];

export const filters = [
  {
    name: "Nhập số điện thoại, email...",
    field: "searchText",
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
  // {
  //   key: "createdBy",
  //   name: "Tạo bởi",
  //   field: "createdBy",
  //   type: "select",
  //   popup: true,
  //   isActive: false,
  //   actionName: "username",
  //   remoteServer: true,
  // },
  // {
  //   key: "updatedBy",
  //   name: "Cập nhật bởi",
  //   field: "updatedBy",
  //   type: "select",
  //   popup: true,
  //   isActive: false,
  //   actionName: "username",
  //   remoteServer: true,
  // },
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

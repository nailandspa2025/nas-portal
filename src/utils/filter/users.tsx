import { TypeFilter } from "../common/typeFilter";
export const columns = [
  {
    title: "Họ và Tên",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (text: string) => (
      <span style={{ color: text === "Active" ? "green" : "red" }}>{text}</span>
    ),
  },
];

export const filters: TypeFilter[] = [
  {
    name: "Tiêu đề, mô tả",
    field: ["title", "description"],
    type: "text",
    popup: false,
    isActive: true,
  },
  {
    key: "category",
    name: "Loại tin tức",
    field: "category",
    type: "multiSelect",
    popup: true,
    isActive: false,
    actionName: "articleType",
    remoteServer: true,
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
    key: "delete",
    name: "Đã xoá",
    field: "isDelete",
    type: "radioYesNo",
    popup: true,
    isActive: false,
    value: "false",
  },
  {
    key: "assigned",
    name: "Phân bổ",
    field: "isAssigned",
    type: "select",
    popup: true,
    isActive: false,
    value: "false",
    selected: { label: "Chưa phân bổ" },
    actionName: "assignmentStatuses",
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
];

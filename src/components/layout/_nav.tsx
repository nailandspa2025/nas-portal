/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UserOutlined,
  DashboardOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
  // DatabaseOutlined,
  // ShareAltOutlined,
  FormOutlined,
  PictureOutlined,
  BankOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const _nav = [
  {
    id: "dashboard",
    icon: <DashboardOutlined />,
    name: "Dashboard",
    route: "/",
  },
  {
    id: "store",
    icon: <AppstoreOutlined />,
    name: "Store",
    route: "/store",
  },
  {
    id: "product",
    icon: <TagsOutlined />,
    name: "Product",
    route: "/product",
  },
  {
    id: "technician",
    icon: <UserOutlined />,
    name: "Technician",
    route: "/technician",
  },
  {
    id: "appaccount",
    icon: <UserOutlined />,
    name: "App Accoount",
    route: "/appaccount",
  },
  {
    id: "booking",
    icon: <FormOutlined />,
    name: "Booking",
    route: "/booking",
  },
  {
    id: "post",
    icon: <FormOutlined />,
    name: "Post",
    route: "/post",
  },
  {
    id: "banner",
    icon: <PictureOutlined />,
    name: "Banner",
    route: "/banner",
  },
  //nhóm & người dùng
  {
    id: "groupuser",
    name: "Group & user",
    icon: <UsergroupAddOutlined />,
    children: [
      {
        id: "user",
        children: "groupuser",
        name: "User",
        icon: "",
        route: "/user",
      },
      {
        id: "group",
        children: "groupuser",
        name: "Access rights",
        icon: "",
        route: "/group",
      },
      {
        id: "usermerchant",
        children: "groupuser",
        name: "User merchant",
        icon: "",
        route: "/usermerchant",
      },
      {
        id: "groupmerchant",
        children: "groupuser",
        name: "Merchant access",
        icon: "",
        route: "/groupmerchant",
      },
    ],
  },
  {
    id: "payment",
    icon: <BankOutlined />,
    name: "History payment",
    route: "/payment",
  },
  {
    id: "config",
    name: "Config",
    icon: <SettingOutlined />,
    children: [
      {
        id: "config-reason",
        children: "config",
        name: "Config reason",
        icon: "",
        route: "/config-reason",
      },
    ],
  },
];

export default _nav;

export const defaultRights = [
  {
    name: "Admin",
    value: "admin",
  },
  {
    name: "View",
    value: "view",
  },
  {
    name: "Create",
    value: "create",
  },
  {
    name: "Update",
    value: "update",
  },
  {
    name: "Delete",
    value: "delete",
  },
  {
    name: "Export",
    value: "export",
  },
];
export const customRightsMap: {
  [key: string]: { name: string; value: string }[];
} = {
  booking: [{ name: "Payment", value: "payment" }],
};

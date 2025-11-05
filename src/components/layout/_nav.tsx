/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UserOutlined,
  DashboardOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
  // DatabaseOutlined,
  ShareAltOutlined,
  FormOutlined,
  PictureOutlined,
  BankOutlined,
  SettingOutlined,
  ShopOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
const _nav = [
  {
    id: "dashboard",
    icon: <DashboardOutlined />,
    name: "Dashboard",
    route: "/",
  },
  {
    id: "group-loyalty",
    name: "Loyalty",
    icon: <ShareAltOutlined />,
    children: [
      {
        id: "loyalty-point",
        children: "group-loyalty",
        name: "Set point",
        icon: "",
        route: "/loyalty-point",
      },
      {
        id: "loyalty-group",
        children: "group-loyalty",
        name: "Group declaration",
        icon: "",
        route: "/loyalty-group",
      },
      {
        id: "loyalty-program",
        children: "group-loyalty",
        name: "Program loyalty",
        icon: "",
        route: "/loyalty-program",
      },
    ],
  },
  {
    id: "merchant",
    icon: <ShopOutlined />,
    name: "Merchant",
    route: "/merchant",
  },
  {
    id: "store",
    icon: <AppstoreOutlined />,
    name: "Store",
    route: "/store",
  },
  {
    id: "reward",
    icon: <AppstoreAddOutlined />,
    name: "Reward",
    route: "/reward",
  },
  {
    id: "category",
    icon: <TagsOutlined />,
    name: "Category ",
    route: "/category",
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
  {
    id: "bank",
    icon: <BankOutlined />,
    name: "Bank",
    route: "/bank",
  },
  {
    id: "groupservice",
    name: "Service & Package",
    icon: <UsergroupAddOutlined />,
    children: [
      {
        id: "service",
        children: "groupservice",
        name: "Service",
        icon: "",
        route: "/service",
      },
      {
        id: "package",
        children: "groupservice",
        name: "Package",
        icon: "",
        route: "/package",
      },
    ],
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

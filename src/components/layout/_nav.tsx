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
        id: "accessgroup",
        children: "groupuser",
        name: "Group rights",
        icon: "",
        route: "/accessgroup",
      },
    ],
  },
];

export default _nav;

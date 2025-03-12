import { ReactElement } from "react";

import Dashboard from "../pages/dashboard/dashboard";
import Users from "../pages/user/user";
import UserAction from "../pages/user/action";

interface RouteType {
  path: string;
  element: ReactElement;
  name: string;
}

const routes: RouteType[] = [
  { path: "/", name: "Trang chủ", element: <Dashboard /> },
  { path: "/users", name: "Danh sách người dùng", element: <Users /> },
  { path: "/users/none", name: "Thêm mới người dùng", element: <UserAction /> },
  {
    path: "/users/:id",
    name: "Chỉnh sửa người dùng",
    element: <UserAction />,
  },
];

export default routes;

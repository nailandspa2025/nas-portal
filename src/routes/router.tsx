import Dashboard from "../pages/dashboard/dashboard";
import Users from "../pages/auth/users";

import { ReactElement } from "react";

interface RouteType {
  path: string;
  element: ReactElement;
  name: string;
}

const routes: RouteType[] = [
  //   { path: "/dashboard", name: "Trang chủ", element: <Users /> },
  { path: "/", name: "Trang chủ", element: <Dashboard /> },
  { path: "/users", name: "Trang chủ", element: <Users /> },
];

export default routes;

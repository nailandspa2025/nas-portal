import Dashboard from "../pages/dashboard/dashboard";

import { ReactElement } from "react";

interface RouteType {
  path: string;
  element: ReactElement;
  name: string;
}

const routes: RouteType[] = [
  //   { path: "/dashboard", name: "Trang chủ", element: <Dashboard /> },
  { path: "/", name: "Trang chủ", element: <Dashboard /> },
];

export default routes;

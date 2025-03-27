import { ReactElement } from "react";

import Dashboard from "../pages/dashboard/dashboard";
import Users from "../pages/user/user";
import UserAction from "../pages/user/action";
import Stores from "../pages/store/store";
import StoreAction from "../pages/store/action";
import Products from "../pages/product/product";
import ProdutActions from "../pages/product/action";
import Technicians from "../pages/technician/technician";
import TechnicianAction from "../pages/technician/action";
import Appaccounts from "../pages/appaccount/appaccount";
import AppaccountAction from "../pages/appaccount/action";
import Bookings from "../pages/booking/booking";
import BookingActions from "../pages/booking/action";
import Posts from "../pages/post/post";
import PostActions from "../pages/post/action";
interface RouteType {
  path: string;
  element: ReactElement;
  name: string;
}

const routes: RouteType[] = [
  { path: "/dashboard", name: "Trang chủ", element: <Dashboard /> },
  { path: "/user", name: "Danh sách người dùng", element: <Users /> },
  { path: "/user/none", name: "Thêm mới người dùng", element: <UserAction /> },
  {
    path: "/user/:id",
    name: "Chỉnh sửa người dùng",
    element: <UserAction />,
  },
  { path: "/store", name: "Danh sách cửa hàng", element: <Stores /> },
  {
    path: "/store/none",
    name: "Thêm mới cửa hàng",
    element: <StoreAction />,
  },
  {
    path: "/store/:id",
    name: "Chỉnh sửa cửa hàng",
    element: <StoreAction />,
  },
  { path: "/product", name: "Danh sách cửa hàng", element: <Products /> },
  {
    path: "/product/none",
    name: "Thêm mới sản phẩm",
    element: <ProdutActions />,
  },
  {
    path: "/product/:id",
    name: "Chỉnh sửa sản phẩm",
    element: <ProdutActions />,
  },
  { path: "/technician", name: "Danh kỷ thuật viên", element: <Technicians /> },
  {
    path: "/technician/none",
    name: "Thêm mới kỷ thuật viên",
    element: <TechnicianAction />,
  },
  {
    path: "/technician/:id",
    name: "Chỉnh sửa kỷ thuật viên",
    element: <TechnicianAction />,
  },
  { path: "/appaccount", name: "List app account", element: <Appaccounts /> },
  {
    path: "/appaccount/none",
    name: "List app account",
    element: <AppaccountAction />,
  },
  {
    path: "/appaccount/:id",
    name: "List app account",
    element: <AppaccountAction />,
  },
  {
    path: "/booking",
    name: "List app account",
    element: <Bookings />,
  },
  {
    path: "/booking/:id",
    name: "List app account",
    element: <BookingActions />,
  },
  {
    path: "/post",
    name: "List app account",
    element: <Posts />,
  },
  {
    path: "/post/none",
    name: "List app account",
    element: <PostActions />,
  },
  {
    path: "/post/:id",
    name: "List app account",
    element: <PostActions />,
  },
];

export default routes;

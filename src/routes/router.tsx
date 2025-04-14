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
import Profile from "../pages/auth/profile";
import UpdateProfile from "../pages/auth/update-profile";
import Groups from "../pages/group/group";
import GroupActions from "../pages/group/action";
import Banners from "../pages/banner/banner";
import BannerActions from "../pages/banner/acion";
import ChatBox from "../pages/chat/chat";
import GroupChat from "../pages/chat/GroupChat";
interface RouteType {
  path: string;
  element: ReactElement;
  name: string;
}

const routes: RouteType[] = [
  { path: "/profile", name: "Profile", element: <Profile /> },
  {
    path: "/update-profile",
    name: "Update Profile",
    element: <UpdateProfile />,
  },
  { path: "/", name: "Trang chủ", element: <Dashboard /> },
  { path: "/user", name: "User", element: <Users /> },
  { path: "/user/none", name: "Create user", element: <UserAction /> },
  {
    path: "/user/:id",
    name: "Update user",
    element: <UserAction />,
  },
  { path: "/store", name: "Store", element: <Stores /> },
  {
    path: "/store/none",
    name: "Create store",
    element: <StoreAction />,
  },
  {
    path: "/store/:id",
    name: "Update store",
    element: <StoreAction />,
  },
  { path: "/product", name: "Product", element: <Products /> },
  {
    path: "/product/none",
    name: "Create product",
    element: <ProdutActions />,
  },
  {
    path: "/product/:id",
    name: "Update product",
    element: <ProdutActions />,
  },
  { path: "/technician", name: "Technician", element: <Technicians /> },
  {
    path: "/technician/none",
    name: "Create technician",
    element: <TechnicianAction />,
  },
  {
    path: "/technician/:id",
    name: "Update technician",
    element: <TechnicianAction />,
  },
  { path: "/appaccount", name: "App Account", element: <Appaccounts /> },
  {
    path: "/appaccount/none",
    name: "Create app account",
    element: <AppaccountAction />,
  },
  {
    path: "/appaccount/:id",
    name: "Update app account",
    element: <AppaccountAction />,
  },
  {
    path: "/booking",
    name: "Booking",
    element: <Bookings />,
  },
  {
    path: "/booking/none",
    name: "Create booking",
    element: <BookingActions />,
  },
  {
    path: "/booking/:id",
    name: "Update booking",
    element: <BookingActions />,
  },
  {
    path: "/post",
    name: "List post",
    element: <Posts />,
  },
  {
    path: "/post/none",
    name: "Create post",
    element: <PostActions />,
  },
  {
    path: "/post/:id",
    name: "Update post",
    element: <PostActions />,
  },

  {
    path: "/group",
    name: "Group",
    element: <Groups />,
  },
  {
    path: "/group/none",
    name: "Create group",
    element: <GroupActions />,
  },
  {
    path: "/group/:id",
    name: "Update group",
    element: <GroupActions />,
  },
  {
    path: "/banner",
    name: "Banner",
    element: <Banners />,
  },
  {
    path: "/banner/none",
    name: "Create banner",
    element: <BannerActions />,
  },
  {
    path: "/banner/:id",
    name: "Update banner",
    element: <BannerActions />,
  },

  {
    path: "/chatbox",
    name: "Chat",
    element: <ChatBox />,
  },
  {
    path: "/chatgroup",
    name: "Chat",
    element: <GroupChat />,
  },
];

export default routes;

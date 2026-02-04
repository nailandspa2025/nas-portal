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
import MerchantUsers from "../pages/user.merchant/user.merchant";
import MerchantUserActions from "../pages/user.merchant/action";
import MerchantGroups from "../pages/group.merchant/group.merchant";
import MerchantGroupActions from "../pages/group.merchant/action";
import Payments from "../pages/payment/payment";
import BookingCancelReasons from "../pages/booking.cancel.reason/booking.cancel.reason";
import Merchants from "../pages/merchant/merchant";
import MerchantActions from "../pages/merchant/action";

import Rewards from "../pages/reward/reward";
import RewardActions from "../pages/reward/action";
import Services from "../pages/service/service";
import ServiceActions from "../pages/service/action";
import Package from "../pages/package/package";
import PackageActions from "../pages/package/action";
import BankAccounts from "../pages/bank/bank";
import BankActions from "../pages/bank/action";
import LoyaltyPoints from "../pages/loyalty/point/loyalty.point";
import LoyaltyPointAction from "../pages/loyalty/point/loyalty.point.action";
import LoyaltyGroups from "../pages/loyalty/group/loyalty.group";
import LoyaltyGroupActions from "../pages/loyalty/group/loyalty.group.action";
import LoyaltyPrograms from "../pages/loyalty/program/loyalty.program";
import LoyaltyProgramActions from "../pages/loyalty/program/loyalty.program.action";
import Category from "../pages/category/category";
import CategoryAction from "../pages/category/action";
import Bio from "../pages/bio/bio";
import BioActions from "../pages/bio/action";
import ConfigReminder from "../pages/config.reminder/config.reminder";
import ConfigReminderAction from "../pages/config.reminder/action";
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
    path: "/usermerchant",
    name: "User merchant",
    element: <MerchantUsers />,
  },
  {
    path: "/usermerchant/none",
    name: "Create user merchant",
    element: <MerchantUserActions />,
  },
  {
    path: "/usermerchant/:id",
    name: "Update user merchant",
    element: <MerchantUserActions />,
  },
  {
    path: "/groupmerchant",
    name: "User merchant",
    element: <MerchantGroups />,
  },
  {
    path: "/groupmerchant/none",
    name: "Create group merchant",
    element: <MerchantGroupActions />,
  },
  {
    path: "/groupmerchant/:id",
    name: "Update group merchant",
    element: <MerchantGroupActions />,
  },
  {
    path: "/payment",
    name: "History payment",
    element: <Payments />,
  },
  {
    path: "/config-reason",
    name: "Config Reason",
    element: <BookingCancelReasons />,
  },
  {
    path: "/merchant",
    name: "Merchants",
    element: <Merchants />,
  },
  {
    path: "/merchant/none",
    name: "Create merchant",
    element: <MerchantActions />,
  },
  {
    path: "/merchant/:id",
    name: "Update merchant",
    element: <MerchantActions />,
  },
  {
    path: "/reward",
    name: "Rewards",
    element: <Rewards />,
  },
  {
    path: "/reward/none",
    name: "Create reward",
    element: <RewardActions />,
  },
  {
    path: "/reward/:id",
    name: "Update reward",
    element: <RewardActions />,
  },
  {
    path: "/service",
    name: "Services",
    element: <Services />,
  },
  {
    path: "/service/none",
    name: "Create service",
    element: <ServiceActions />,
  },
  {
    path: "/service/:id",
    name: "Update service",
    element: <ServiceActions />,
  },
  {
    path: "/package",
    name: "Package",
    element: <Package />,
  },
  {
    path: "/package/none",
    name: "Create package",
    element: <PackageActions />,
  },
  {
    path: "/package/:id",
    name: "Update package",
    element: <PackageActions />,
  },
  {
    path: "/bank",
    name: "Bank Accounts",
    element: <BankAccounts />,
  },
  {
    path: "/bank/none",
    name: "Create Bank Account",
    element: <BankActions />,
  },
  {
    path: "/bank/:id",
    name: "Update Bank Account",
    element: <BankActions />,
  },
  {
    path: "/loyalty-point",
    name: "Set points",
    element: <LoyaltyPoints />,
  },
  {
    path: "/loyalty-point/none",
    name: "Create set point",
    element: <LoyaltyPointAction />,
  },
  {
    path: "/loyalty-point/:id",
    name: "Update set point",
    element: <LoyaltyPointAction />,
  },

  {
    path: "/loyalty-group",
    name: "List groups",
    element: <LoyaltyGroups />,
  },
  {
    path: "/loyalty-group/none",
    name: "Create  group",
    element: <LoyaltyGroupActions />,
  },
  {
    path: "/loyalty-group/:id",
    name: "Update group",
    element: <LoyaltyGroupActions />,
  },

  {
    path: "/loyalty-program",
    name: "List programs",
    element: <LoyaltyPrograms />,
  },
  {
    path: "/loyalty-program/none",
    name: "Create  program",
    element: <LoyaltyProgramActions />,
  },
  {
    path: "/loyalty-program/:id",
    name: "Update program",
    element: <LoyaltyProgramActions />,
  },
  {
    path: "/category",
    name: "List Category",
    element: <Category />,
  },
  {
    path: "/category/none",
    name: "Create  category",
    element: <CategoryAction />,
  },
  {
    path: "/category/:id",
    name: "Update category",
    element: <CategoryAction />,
  },
  {
    path: "/bio",
    name: "List Bio",
    element: <Bio />,
  },
  {
    path: "/bio/none",
    name: "Create  bio",
    element: <BioActions />,
  },
  {
    path: "/bio/:id",
    name: "Update bio",
    element: <BioActions />,
  },
  {
    path: "/config-reminder",
    name: "Config Reminder",
    element: <ConfigReminder />,
  },
  {
    path: "/config-reminder/none",
    name: "Create config reminder",
    element: <ConfigReminderAction />,
  },
  {
    path: "/config-reminder/:id",
    name: "Update config reminder",
    element: <ConfigReminderAction />,
  },
];

export default routes;

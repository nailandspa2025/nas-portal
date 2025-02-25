import {
  UserOutlined,
  DashboardOutlined,
  TagsOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

const _nav = [
  {
    id: "dashboard",
    icon: <DashboardOutlined />,
    name: "Trang chủ",
    route: "/",
  },
  //công ty
  {
    id: "company",
    icon: <DashboardOutlined />,
    name: "Quản lý doanh nghiệp",
    route: "/company",
  },
  // //sản phẩm
  {
    id: "groupproduct",
    name: "Quản lý sản phẩm",
    icon: <TagsOutlined />,
    children: [
      {
        id: "category",
        children: "groupproduct",
        name: "Danh mục sản phẩm",
        icon: "",
        route: "/category",
      },
      {
        id: "productgroup",
        children: "groupproduct",
        name: "Nhóm sản phẩm",
        icon: "",
        route: "/productgroup",
      },
      {
        id: "product",
        children: "groupproduct",
        name: "Danh sách sản phẩm",
        icon: "",
        route: "/product",
      },
      {
        id: "variant",
        children: "groupproduct",
        name: "Thuộc tính sản phẩm",
        icon: "",
        route: "/variant",
      },
      {
        id: "unit",
        children: "groupproduct",
        name: "Đơn vị tính",
        icon: "",
        route: "/unit",
      },
    ],
  },
  //Nhà phân phối
  {
    id: "distributor",
    icon: <DashboardOutlined />,
    name: "Nhà phân phối",
    route: "/distributor",
  },
  //Kênh bán
  {
    id: "channel",
    icon: <DashboardOutlined />,
    name: "Quản lý kênh bán",
    route: "/channel",
  },
  //Giá bán
  {
    id: "sellingprice",
    icon: <DashboardOutlined />,
    name: "Quản lý giá bán",
    route: "/sellingprice",
  },
  {
    id: "salesman",
    icon: <UserOutlined />,
    name: "Nhân viên",
    route: "/salesman",
  },
  {
    id: "groupstore",
    name: "Quản lý cửa hàng",
    icon: <AppstoreOutlined />,
    children: [
      {
        id: "typeofstore",
        name: "Danh sách loại cửa hàng",
        children: "groupstore",
        icon: "",
        route: "/typeofstore",
      },
      {
        id: "store",
        name: "Danh sách cửa hàng",
        children: "groupstore",
        icon: "",
        route: "/store",
      },
    ],
  },
  //khách hàng
  {
    id: "groupcustomer",
    name: "Khách hàng",
    icon: <UserOutlined />,
    children: [
      {
        id: "customer",
        children: "groupcustomer",
        name: "Khách hàng",
        icon: "",
        route: "/customer",
      },
    ],
  },
  //nhóm & người dùng
  {
    id: "groupuser",
    name: "Nhóm & người dung",
    icon: <UsergroupAddOutlined />,
    children: [
      {
        id: "users",
        children: "groupuser",
        name: "Người dùng",
        icon: "",
        route: "/users",
      },
      {
        id: "accessgroup",
        children: "groupuser",
        name: "Nhóm quyền",
        icon: "",
        route: "/accessgroup",
      },
      {
        id: "retailer",
        children: "groupuser",
        name: "Quản lý retailer",
        icon: "",
        route: "/retailer",
      },
    ],
  },
  {
    id: "groupwarehouse",
    name: "Quản lý kho",
    icon: <DatabaseOutlined />,
    children: [
      {
        id: "warehouse",
        children: "groupwarehouse",
        name: "Quản lý kho",
        icon: "",
        route: "/warehouse",
      },
      {
        id: "stockin",
        children: "groupwarehouse",
        name: "Quản lý nhập kho",
        icon: "",
        route: "/stockin",
      },
      {
        id: "warehousetransfer",
        children: "groupwarehouse",
        name: "Quản lý điều chỉnh kho ",
        icon: "",
        route: "/warehousetransfer ",
      },
      {
        id: "stockout",
        children: "groupwarehouse",
        name: "Quản lý xuất kho ",
        icon: "",
        route: "/stockout ",
      },
      {
        id: "inventory",
        children: "groupwarehouse",
        name: "Quản lý tồn kho ",
        icon: "",
        route: "/inventory ",
      },
    ],
  },
  //khách hàng
  {
    id: "grouporder",
    name: "Kinh doanh",
    icon: <UserOutlined />,
    children: [
      {
        id: "order",
        children: "grouporder",
        name: "Danh sách đơn hàng",
        icon: "",
        route: "/order",
      },
    ],
  },
  {
    id: "promotion",
    name: "Quản lý khuyến mãi",
    icon: <ShareAltOutlined />,
    children: [
      {
        id: "coupon",
        children: "promotion",
        name: "Coupon",
        icon: "",
        route: "/coupon",
      },
    ],
  },
];

export default _nav;

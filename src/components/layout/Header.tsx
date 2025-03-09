/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout, Avatar, Dropdown, Typography } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";
import { STORAGE_KEY } from "../../constants/application.constant";
import useIsMobile from "../../utils/useIsMobile";
const { Text } = Typography;
const Header = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const collapsed = useSelector((state: RootState) => state.global.collapsed);
  const auth: any = useSelector((state: RootState) => state.auth.user);
  console.log("canhlv", auth);
  const onCollapseChange = () => {
    if (!isMobile) {
      dispatch({ type: "setCollapsed", collapsed: !collapsed });
    } else {
      dispatch({ type: "setCollapsed", collapsed: false });
      dispatch({ type: "setDrawerVisible", drawerVisible: true });
    }
  };
  const onSignOut = async () => {
    localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
    window.location.replace("/sign-in");
  };
  const handleClickMenu = (e: { key: string }) => {
    if (e.key === "SignOut") {
      onSignOut();
    }
  };
  return (
    <Layout.Header
      className={`header fixed ${isMobile ? "mobile-full" : ""} ${
        collapsed ? "collapsed" : ""
      }`}
      id="layoutHeader"
    >
      <div className="button" onClick={onCollapseChange}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
      <div className="header-right" style={{ paddingRight: 10 }}>
        <Dropdown
          menu={{
            items: [
              {
                key: "Profile",
                icon: <UserOutlined />,
                label: "Thông tin tài khoản",
              },
              { type: "divider" },
              {
                key: "ChangePassword",
                icon: <LockOutlined />,
                label: "Đỏi mật khẩu",
              },
              { type: "divider" },
              {
                key: "SignOut",
                icon: <LogoutOutlined />,
                label: <span style={{ color: "red" }}> Đăng xuất </span>,
              },
            ],
            onClick: handleClickMenu,
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="profile-dropdown">
            <Text type="secondary" className="username">
              {auth?.email ?? auth.userName}
            </Text>
            <Avatar
              icon={<UserOutlined />}
              style={{ marginLeft: 8, cursor: "pointer" }}
              src={auth?.avatar}
            />
          </div>
        </Dropdown>
      </div>
    </Layout.Header>
  );
};
export default Header;

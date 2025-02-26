import { Layout, Menu, Avatar, Dropdown, Typography } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
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
  const profileList = (
    <Menu onClick={handleClickMenu} className="profile-menu">
      <Menu.Item key="Profile">Hồ sơ</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="ChangePassword">Đổi mật khẩu</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="SignOut" style={{ color: "red" }}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

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
          overlay={profileList}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="profile-dropdown">
            <Text type="secondary" className="username">
              canhlv
            </Text>
            <Avatar
              icon={<UserOutlined />}
              style={{ marginLeft: 8, cursor: "pointer" }}
            />
          </div>
        </Dropdown>
      </div>
    </Layout.Header>
  );
};
export default Header;

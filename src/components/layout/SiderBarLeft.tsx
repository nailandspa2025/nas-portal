import { Layout, Image, Menu } from "antd";
import Logo from "../../assets/images/icons/logo.svg";
import _nav from "./_nav";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";

const SiderBarLeft = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector(
    (state: RootState) => state.globalLoading.collapsed
  );
  const handleMenuClick = () => {
    dispatch({ type: "setDrawerVisible", drawerVisible: false });
  };
  const menuItems = _nav.map((item) => {
    if (item.children) {
      return {
        key: item.id,
        icon: item.icon,
        label: item.name,
        children: item.children.map((child) => ({
          key: child.id,
          icon: child.icon,
          label: (
            <Link to={child.route} onClick={handleMenuClick}>
              {child.name}
            </Link>
          ),
        })),
      };
    }
    return {
      key: item.id,
      icon: item.icon,
      label: (
        <Link to={item.route} onClick={handleMenuClick}>
          {item.name}
        </Link>
      ),
    };
  });
  return (
    <Layout.Sider
      width={256}
      theme="dark"
      breakpoint="lg"
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="sider"
      style={{
        position: "fixed",
      }}
    >
      <div
        className="brand"
        style={{
          background: "rgb(0, 51, 102)",
        }}
      >
        <div className="logo">
          <Image alt="logo" src={Logo} preview={false} />
          {!collapsed && <h1>Nas prortal</h1>}
        </div>
      </div>
      <div className="menuContainer">
        <Menu mode="vertical" theme="dark" items={menuItems} />
      </div>
    </Layout.Sider>
  );
};

export default SiderBarLeft;

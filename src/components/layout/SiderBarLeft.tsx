/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout, Image, Menu } from "antd";
import Logo from "../../assets/images/icons/logo.svg";
import _nav from "./_nav";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";
import { useTranslation } from "react-i18next";
import { useState } from "react";
const SiderBarLeft = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const collapsed = useSelector((state: RootState) => state.global.collapsed);
  const [openKeys, setOpenKeys] = useState<string[]>(
    JSON.parse(localStorage.getItem("openKeys") || "[]")
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
              {t(child.name)}
            </Link>
          ),
        })),
      };
    }
    return {
      key: item.id,
      icon: item.icon,
      label: (
        <Link
          to={item.route}
          onClick={() => {
            handleMenuClick();
            setOpenKeys([]);
            localStorage.setItem("openKeys", JSON.stringify([]));
          }}
        >
          {t(item.name)}
        </Link>
      ),
    };
  });
  const rootSubmenuKeys = _nav.map((_) => _.id);
  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    let newOpenKeys = keys;
    if (latestOpenKey && rootSubmenuKeys.includes(latestOpenKey)) {
      newOpenKeys = [latestOpenKey];
    }
    setOpenKeys(newOpenKeys);
    localStorage.setItem("openKeys", JSON.stringify(newOpenKeys));
  };
  const selectedKeys = useLocation()
    .pathname.split("/")
    .filter((i) => i);
  return (
    <Layout.Sider
      width={256}
      theme="light"
      breakpoint="lg"
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="sider"
      style={{
        position: "fixed",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div
        className="brand"
        style={{
          height: 62,
        }}
      >
        <div className="logo">
          <Image alt="logo" src={Logo} preview={false} />
          {!collapsed && <h1>Nas prortal</h1>}
        </div>
      </div>
      <div className="menuContainer">
        <Menu
          onOpenChange={onOpenChange}
          openKeys={openKeys}
          selectedKeys={selectedKeys.length ? selectedKeys : ["dashboard"]}
          mode="inline"
          theme="light"
          items={menuItems}
        />
      </div>
    </Layout.Sider>
  );
};

export default SiderBarLeft;

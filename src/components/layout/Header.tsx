/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout, Avatar, Dropdown, Typography, Row, Col, Space } from "antd";
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
import { AuthApi } from "../../apis/auth/auth";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { userLoadded } from "../../redux/actions/user.actions";
import { useEffect, useState } from "react";
import ChangePasswordModal from "../../components/ChangePasswordModal";

const { Text } = Typography;
const Header = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const collapsed = useSelector((state: RootState) => state.global.collapsed);
  const [openModal, setOpenModal] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const response: any = await AuthApi.userInfo();
      return response.data;
    },
  });
  useEffect(() => {
    if (!isLoading) {
      if (data) {
        dispatch(userLoadded(data));
      } else {
        onSignOut();
      }
    }
  }, [data, dispatch, isLoading]);
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
    if (e.key === "Profile") {
      navigate("/profile");
    }
    if (e.key === "ChangePassword") {
      setOpenModal(true);
    }
  };
  const allLanguages = [
    { key: "vi", label: "Tiếng Việt", flag: "/images/vi.jpg" },
    { key: "en", label: "English", flag: "/images/en.jpg" },
  ];
  const filteredLanguages = allLanguages.filter(
    (lang) => lang.key !== i18n.language
  );

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };
  return (
    <Layout.Header
      className={`header fixed ${isMobile ? "mobile-full" : ""} ${
        collapsed ? "collapsed" : ""
      }`}
      id="layoutHeader"
    >
      <Row style={{ width: "100%" }} justify="space-between" align="middle">
        <Col>
          <div className="button-collapse" onClick={onCollapseChange}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </Col>
        <Col style={{ textAlign: "right", paddingRight: 10 }}>
          <Space size={10}>
            <Dropdown
              menu={{
                items: filteredLanguages.map((lang) => ({
                  key: lang.key,
                  label: lang.label,
                  icon: (
                    <img
                      src={lang.flag}
                      alt={lang.label}
                      style={{ width: 20, height: 14 }}
                    />
                  ),
                  onClick: () => changeLanguage(lang.key),
                })),
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="profile-dropdown">
                <Avatar
                  size={22}
                  style={{ cursor: "pointer" }}
                  src={`/images/${i18n.language}.jpg`}
                />
              </div>
            </Dropdown>

            <Dropdown
              menu={{
                items: [
                  {
                    key: "Profile",
                    icon: <UserOutlined />,
                    label: "Profile",
                  },
                  { type: "divider" },
                  {
                    key: "ChangePassword",
                    icon: <LockOutlined />,
                    label: "Change password",
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
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {data?.email ?? data?.userName}
                </Text>
                <Avatar
                  icon={<UserOutlined />}
                  style={{ marginLeft: 8, cursor: "pointer" }}
                  src={data?.avatar}
                />
              </div>
            </Dropdown>
          </Space>
        </Col>
      </Row>
      <ChangePasswordModal
        visible={openModal}
        onClose={() => setOpenModal(false)}
      />
    </Layout.Header>
  );
};
export default Header;

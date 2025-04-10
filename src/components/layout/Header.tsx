/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Layout,
  Avatar,
  Dropdown,
  Typography,
  Row,
  Col,
  Space,
  Image,
} from "antd";
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
  const { t } = useTranslation();
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
          <Space>
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
              <Space
                className="profile-dropdown"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  height: "100%", // đảm bảo căn giữa theo chiều dọc nếu trong header
                }}
              >
                <Image
                  height={16}
                  width={22}
                  preview={false}
                  src={`/images/${i18n.language}.jpg`}
                />
              </Space>
            </Dropdown>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "Profile",
                    icon: <UserOutlined />,
                    label: t("Profile"),
                  },
                  { type: "divider" },
                  {
                    key: "ChangePassword",
                    icon: <LockOutlined />,
                    label: t("Change password"),
                  },
                  { type: "divider" },
                  {
                    key: "SignOut",
                    icon: <LogoutOutlined />,
                    label: (
                      <span style={{ color: "red" }}> {t("Logout")} </span>
                    ),
                  },
                ],
                onClick: handleClickMenu,
              }}
              dropdownRender={(menu) => (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                    overflow: "hidden",
                    minWidth: 240,
                  }}
                >
                  <div
                    style={{
                      padding: "20px 16px",
                      textAlign: "center",
                      background: "linear-gradient(to bottom, #fafafa, #fff)",
                    }}
                  >
                    <Avatar
                      size={72}
                      src={data?.avatar}
                      icon={!data?.avatar && <UserOutlined />}
                      style={{ border: "2px solid #f0f0f0" }}
                    />
                    <div style={{ marginTop: 10 }}>
                      <Text style={{ fontWeight: 600, fontSize: 16 }}>
                        {data?.fullName ?? data?.userName}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        {data?.email}
                      </Text>
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid #f0f0f0" }}>{menu}</div>
                </div>
              )}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Space className="profile-dropdown">
                <Avatar
                  size={35}
                  icon={<UserOutlined />}
                  style={{ cursor: "pointer" }}
                  src={data?.avatar}
                />
                {!isMobile && (
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {data?.email ?? data?.userName}
                  </Text>
                )}
              </Space>
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

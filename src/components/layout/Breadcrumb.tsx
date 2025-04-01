/* eslint-disable @typescript-eslint/no-explicit-any */
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useLocation, Link } from "react-router-dom";
import routes from "../../routes/router";
import { match } from "path-to-regexp";
import { useTranslation } from "react-i18next";
import useIsMobile from "../../utils/useIsMobile";
import { useSelector } from "react-redux";
const CustomBreadcrumb = () => {
  const isMobile = useIsMobile();
  const collapsed = useSelector((state: any) => state.global.collapsed);
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname;
  const getRouteName = (pathname: string, routes: any[]) => {
    const currentRoute = routes.find((route) => {
      if (!route.path) return false;
      const matcher = match(route.path, { decode: decodeURIComponent });
      return matcher(pathname);
    });
    return currentRoute ? currentRoute.name : null;
  };
  const getBreadcrumbs = (location: string) => {
    const breadcrumbs: { path: string; name: string; active: boolean }[] = [];
    location.split("/").reduce((prev, curr, index, array) => {
      if (!curr) return prev;
      const currentPath = `${prev}/${curr}`;
      const routeName = getRouteName(currentPath, routes);
      if (routeName) {
        breadcrumbs.push({
          path: currentPath,
          name: routeName,
          active: index + 1 === array.length,
        });
      }
      return currentPath;
    }, "");
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentPath);

  return (
    <div
      className={`breadcrumb-container ${
        isMobile
          ? "breadcrumb-mobile"
          : collapsed
          ? "breadcrumb-collapsed"
          : "breadcrumb"
      }`}
      style={{
        height: 41,
        position: "fixed",
        top: "48px",
        left: "0",
        width: "100%",
        alignItems: "center",
        display: "flex",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        zIndex: 9,
        backgroundColor: "#fcfcfc",
        paddingLeft: 20,
      }}
    >
      <Breadcrumb
        items={[
          {
            title: (
              <Link to="/">
                <HomeOutlined />
                <span style={{ marginLeft: 8 }}>{t("Home")}</span>
              </Link>
            ),
          },
          ...breadcrumbs.map((breadcrumb) => ({
            title: breadcrumb.active ? (
              breadcrumb.name
            ) : (
              <Link to={breadcrumb.path}>{t(breadcrumb.name)}</Link>
            ),
          })),
        ]}
      />
    </div>
  );
};

export default CustomBreadcrumb;

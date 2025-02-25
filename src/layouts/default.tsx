import { Layout, Drawer } from "antd";
// import Loading from "../components/common/Loading";
// import { ToastContainer } from "react-toastify";
import SiderBarLeft from "../components/layout/SiderBarLeft";
import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/reducers";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";
//import { pathToRegexp } from "path-to-regexp";
// interface Breadcrumb {
//   path: string;
//   name: string;
//   active: boolean;
// }
const LayoutDefault = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const drawerVisible = useSelector(
    (state: RootState) => state.globalLoading.drawerVisible
  );
  const collapsed = useSelector(
    (state: RootState) => state.globalLoading.collapsed
  );
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const onClicDrawerVisible = () => {
    dispatch({ type: "setDrawerVisible", drawerVisible: false });
  };
  // const currentLocation = useLocation().pathname;
  // const getRouteName = (pathname: string, routes: Route[]): string | false => {
  //   const currentRoute = routes.find((route) => {
  //     if (!route.path) return false;
  //     const regexp = pathToRegexp(route.path).regexp;
  //     return regexp.test(pathname);
  //   });
  //   return currentRoute ? currentRoute.name : false;
  // };
  // const getBreadcrumbs = (location: string): Breadcrumb[] => {
  //   const breadcrumbs: Breadcrumb[] = [];
  //   location
  //     .split("/")
  //     .reduce((prev: string, curr: string, index: number, array: string[]) => {
  //       const currentPathname = `${prev}/${curr}`;
  //       const routeName = getRouteName(currentPathname, routes);
  //       if (routeName) {
  //         breadcrumbs.push({
  //           path: currentPathname,
  //           name: routeName,
  //           active: index + 1 === array.length,
  //         });
  //       }
  //       return currentPathname;
  //     });
  //   return breadcrumbs;
  // };
  // const breadcrumbs = getBreadcrumbs(currentLocation);
  return (
    <Layout>
      {isMobile ? (
        <Drawer
          onClose={() => onClicDrawerVisible()}
          open={drawerVisible}
          maskClosable
          closable={false}
          placement="left"
          width={256}
          rootStyle={{
            padding: 0,
            height: "100vh",
          }}
          styles={{ body: { padding: "0px" } }}
        >
          <SiderBarLeft />
        </Drawer>
      ) : (
        <>
          <SiderBarLeft />
        </>
      )}

      <Layout>
        <Header />
        <Layout className="container-content">
          <Layout.Content
            className={`${
              isMobile
                ? "content-mobile"
                : collapsed
                ? "content-collapsed"
                : "content"
            }`}
          >
            <div className="contentInner">
              <Outlet />
            </div>
          </Layout.Content>
        </Layout>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default LayoutDefault;

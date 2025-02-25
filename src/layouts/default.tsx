import { Layout, Drawer } from "antd";
import SiderBarLeft from "../components/layout/SiderBarLeft";
import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/reducers";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";
const LayoutDefault = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const drawerVisible = useSelector(
    (state: RootState) => state.global.drawerVisible
  );
  const collapsed = useSelector((state: RootState) => state.global.collapsed);
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

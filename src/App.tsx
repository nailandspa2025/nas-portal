/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/default";
import SignUp from "./pages/auth/sign-in";
import "./assets/css/custom.scss";
import "./assets/css/app.scss";
import "./assets/css/layout.scss";
import routes from "./routes/router";
import NotFound from "./pages/NotFound";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./components/common/Loading";
import { useSelector } from "react-redux";
import { RootState } from "./redux/reducers";
import ForgotPassword from "./pages/auth/forgotpassword";
import ResetPassword from "./pages/auth/resetpassword";
import { useEffect } from "react";

//import { listenForMessages } from "./firebase/firebaseConfig";
import {
  startConnection,
  onReceiveMessage,
  offReceiveMessage,
} from "./utils/signalr";
function App() {
  const collapsed = useSelector((state: RootState) => state.global.status);
  const { isAuthorized } = useSelector((state: RootState) => ({
    isAuthorized: state.auth.authToken != null,
  }));
  useEffect(() => {
    if (!isAuthorized) return;
    const setupConnection = async () => {
      await startConnection();
      const handler = (data: any) => {
        // const isInChatPage = location.pathname.startsWith("/chat");
        toast.info(
          `Tin nhắn từ ${data?.senderInfo?.fullName}: ${
            data?.content || "gửi tin nhắn cho bạn"
          }`
        );
      };
      onReceiveMessage(handler);
      // Clean up khi unmount hoặc user logout
      return () => {
        offReceiveMessage(handler);
      };
    };
    setupConnection();
  }, [isAuthorized]);

  //listenForMessages();
  return (
    <BrowserRouter>
      <Loading isLoading={collapsed} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {isAuthorized ? (
          <Route element={<Layout />}>
            {routes.map((route, idx) => (
              <Route key={idx} path={route.path} element={route.element} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        ) : (
          <>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/sign-up" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

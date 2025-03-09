import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/default";
import SignUp from "./pages/auth/sign-in";
import "./assets/css/custom.scss";
import "./assets/css/app.scss";
import "./assets/css/layout.scss";
import routes from "./routes/router";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./components/common/Loading";
import { useSelector } from "react-redux";
import { RootState } from "./redux/reducers";
function App() {
  const collapsed = useSelector((state: RootState) => state.global.status);
  const { isAuthorized } = useSelector((state: RootState) => ({
    isAuthorized: state.auth.authToken != null,
  }));
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
          <Route path="*" element={<SignUp />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

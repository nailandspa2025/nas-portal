import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/default";
import SignUp from "./pages/auth/sign-in";
import "./assets/css/custom.scss";
import "./assets/css/app.scss";
import "./assets/css/layout.scss";
import routes from "./routes/router";
import NotFound from "./pages/NotFound";
function App() {
  const isAuthorized = "xs";
  return (
    <BrowserRouter>
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

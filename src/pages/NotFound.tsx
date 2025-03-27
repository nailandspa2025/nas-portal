import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Result
      status="404"
      title="404"
      subTitle={t("Sorry, the page you are looking for does not exist.")}
      extra={
        <Button type="primary" onClick={() => navigate("/dashboard")}>
          {t("Return to home page")}
        </Button>
      }
    />
  );
};

export default NotFound;

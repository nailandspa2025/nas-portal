import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
interface ActionButtonsProps {
  onSubmit?: () => void;
  backUrl: string;
  backText?: string;
  submitText?: string;
  style?: React.CSSProperties;
}

const BottomActionButtons: React.FC<ActionButtonsProps> = ({
  onSubmit,
  backUrl,
  backText = "Come back",
  submitText = "Save",
  style = {},
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Space
      wrap
      style={{
        width: "100%",
        justifyContent: "right",
        marginTop: "1.2rem",
        paddingBottom: "1.2rem",
        ...style,
      }}
    >
      <Button type="default" onClick={() => navigate(backUrl)}>
        {t(backText)}
      </Button>
      <Button type="primary" htmlType="submit" onClick={onSubmit}>
        {t(submitText)}
      </Button>
    </Space>
  );
};

export default BottomActionButtons;

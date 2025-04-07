import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
interface ActionButtonsProps {
  onSubmit?: () => void;
  backUrl: string;
  backText?: string;
  submitText?: string;
  style?: React.CSSProperties;
  hasSubmitPermission?: boolean;
  disabled?: boolean;
}

const TopActionButtons: React.FC<ActionButtonsProps> = ({
  onSubmit,
  backUrl,
  backText = "Come back",
  submitText = "Save",
  style = {},
  hasSubmitPermission = true,
  disabled = false,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Space
      wrap
      style={{
        width: "100%",
        justifyContent: "flex-end",
        ...style,
      }}
    >
      <Button type="default" onClick={() => navigate(backUrl)}>
        {t(backText)}
      </Button>
      {hasSubmitPermission && (
        <Button
          type="primary"
          htmlType="submit"
          onClick={onSubmit}
          disabled={disabled}
        >
          {t(submitText)}
        </Button>
      )}
    </Space>
  );
};

export default TopActionButtons;

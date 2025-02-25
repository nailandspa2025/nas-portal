import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "../../assets/css/loading.scss";
import { FC } from "react";

interface LoadingProps {
  isLoading: boolean;
}
const Loading: FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div className="loading-overlay">
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 50, color: "#1890ff" }} spin />
        }
      />
    </div>
  );
};

export default Loading;

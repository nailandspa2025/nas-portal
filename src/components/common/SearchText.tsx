import React from "react";
import { Col, Space, Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
type SearchTextProps = {
  placeholder?: string;
  onChange?: () => void;
  value?: string;
  submit?: () => void;
};

const SearchText: React.FC<SearchTextProps> = ({
  placeholder = "",
  onChange = () => {},
  value = "",
  submit = () => {},
}) => {
  return (
    <Col xs={24} sm={24} md={8} style={{ paddingBottom: 8 }}>
      <Space.Compact block>
        <Input
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          onKeyPress={(event: { key: string }) => {
            if (event.key === "Enter") {
              submit();
            }
          }}
        />
        <Button type="primary" onClick={submit} icon={<SearchOutlined />}>
          Tìm
        </Button>
      </Space.Compact>
    </Col>
  );
};
export default SearchText;

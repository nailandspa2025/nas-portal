import React, { useState } from "react";
import { Row, Col, Input, Button } from "antd";

interface FilterDataProps {
  submit?: () => void;
  searchName?: string;
}

const FilterData: React.FC<FilterDataProps> = ({
  submit = () => {},
  searchName = "",
}) => {
  const [searchValue, setSearchValue] = useState<string>(searchName);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const handleSearch = () => {
    submit();
    console.log("Searching for:", searchValue);
  };

  return (
    <>
      <Row gutter={16} style={{ paddingBottom: 12 }}>
        <Col span={7}>
          <Input
            placeholder="Nhập tên, số điện thoại, email"
            value={searchValue}
            onChange={handleOnChange}
            onKeyPress={(event) => event.key === "Enter" && handleSearch()}
          />
        </Col>
        <Col span={1}>
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default FilterData;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Select } from "antd";

interface CustomSelectProps {
  value?: any;
  onChange?: (value: string) => void;
  options: { label: string; value: string | number }[];
  placeholder?: string;
  allowClear?: boolean;
  showSearch?: boolean;
  disabled?: boolean;
  mode?: any;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Chọn một mục",
  allowClear = true,
  showSearch = true,
  disabled = false,
  mode = "",
}) => {
  return (
    <Select
      mode={mode}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowClear={allowClear}
      showSearch={showSearch}
      optionFilterProp="children"
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      options={options}
      style={{ width: "100%" }}
      maxTagCount="responsive"
      disabled={disabled}
    />
  );
};

export default CustomSelect;

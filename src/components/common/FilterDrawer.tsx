import React, { useState } from "react";
import {
  Col,
  Space,
  Button,
  Input,
  Menu,
  Dropdown,
  Drawer,
  Select,
  Tag,
  Radio,
} from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { TypeFilter } from "../../utils/common/typeFilter";
import { getDataForFilter } from "../../utils/common/getDataForFilter";
type FilterDataProps = {
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  submit?: () => void;
  filters?: TypeFilter[];
  onFilterChange?: (values: Record<string, unknown>) => void;
};

const FilterData: React.FC<FilterDataProps> = ({
  placeholder = "Nhập...",
  onChange = () => {},
  value = "",
  submit = () => {},
  filters = [],
  onFilterChange = () => {},
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<TypeFilter | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>(
    {}
  );
  const [activeFilters, setActiveFilters] = useState<TypeFilter[]>(filters);
  const [filterOptions, setFilterOptions] = useState<Record<string, unknown>>(
    {}
  );

  const openDrawer = async (filter: TypeFilter) => {
    setSelectedFilter(filter);
    setVisible(true);

    if (filter.actionName) {
      const data = await getDataForFilter(filter.actionName);
      setFilterOptions((prev) => ({ ...prev, [filter.key as string]: data }));
      console.log("canhlv", filterOptions["updatedBy"]);
    }
  };

  const closeDrawer = () => setVisible(false);

  const handleApply = () => {
    if (!selectedFilter) return;

    const updatedFilters = activeFilters.map((filter) =>
      filter.key === selectedFilter.key ? { ...filter, isActive: true } : filter
    );

    setAppliedFilters({ ...appliedFilters, ...filterValues });
    setActiveFilters(updatedFilters);
    setVisible(false);
    onFilterChange(filterValues);
  };

  const removeFilter = (key: string) => {
    const updatedValues = { ...appliedFilters };
    delete updatedValues[key];

    const updatedFilters = activeFilters.map((filter) =>
      filter.key === key ? { ...filter, isActive: false } : filter
    );

    setAppliedFilters(updatedValues);
    setFilterValues(updatedValues);
    setActiveFilters(updatedFilters);
    onFilterChange(updatedValues);
  };

  const resetFilters = () => {
    const resetFilterState = activeFilters.map((filter) => ({
      ...filter,
      isActive: false,
    }));

    setFilterValues({});
    setAppliedFilters({});
    setActiveFilters(resetFilterState);
    onFilterChange({});
  };

  const handleChange = (key: string, value: unknown) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const availableFilters = activeFilters.filter(
    (filter) => filter.popup && !filter.isActive
  );

  const menu = (
    <Menu>
      {availableFilters.map((filter) => (
        <Menu.Item key={filter.key} onClick={() => openDrawer(filter)}>
          {filter.name}
          <Menu.Divider />
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <>
      {filters.length > 0 && (
        <Col
          xs={24}
          sm={24}
          lg={12}
          md={12}
          style={{ display: "flex", alignItems: "center" }}
        >
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

          {availableFilters.length > 0 && (
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button
                type="default"
                icon={<FilterOutlined />}
                style={{ marginLeft: 8 }}
              >
                Bộ lọc
              </Button>
            </Dropdown>
          )}
        </Col>
      )}

      {Object.keys(appliedFilters).length > 0 && (
        <Col md={24}>
          <Space size={[0, 8]} wrap>
            {Object.keys(appliedFilters).map((key) => (
              <Tag
                key={key}
                closable
                onClick={() => openDrawer(filters.find((f) => f.key === key)!)}
                onClose={() => removeFilter(key)}
                color="blue"
              >
                {filters.find((f) => f.key === key)?.name}:{" "}
                {appliedFilters[key] === false
                  ? "Không hoạt động"
                  : appliedFilters[key] === true
                  ? "Hoạt động"
                  : String(appliedFilters[key])}
              </Tag>
            ))}
            <Tag
              color="red"
              style={{ cursor: "pointer" }}
              onClick={resetFilters}
            >
              Xóa tất cả
            </Tag>
          </Space>
        </Col>
      )}

      <Drawer
        title="Bộ lọc"
        placement="right"
        onClose={closeDrawer}
        open={visible}
        width={450}
      >
        {selectedFilter && (
          <div style={{ marginBottom: 15 }}>
            <label
              style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
            >
              {selectedFilter.name}
            </label>

            {selectedFilter.type === "select" && (
              <Select
                style={{ width: "100%" }}
                placeholder={`Chọn ${selectedFilter.name}`}
                value={filterValues[selectedFilter.key as string]}
                onChange={(value) =>
                  handleChange(selectedFilter.key as string, value)
                }
              >
                {(
                  filterOptions[selectedFilter.key as string] as Array<{
                    value: string;
                    label: string;
                  }>
                )?.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            )}

            {selectedFilter.type === "multiSelect" && (
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder={`Chọn ${selectedFilter.name}`}
                value={filterValues[selectedFilter.key as string]}
                onChange={(value) =>
                  handleChange(selectedFilter.key as string, value)
                }
              >
                {(
                  filterOptions[selectedFilter.key as string] as Array<{
                    value: string;
                    label: string;
                  }>
                )?.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            )}

            {selectedFilter.type === "radioActive" && (
              <Radio.Group
                value={filterValues[selectedFilter.key as string]}
                onChange={(e) =>
                  handleChange(selectedFilter.key as string, e.target.value)
                }
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 5,
                  justifyContent: "center",
                }}
              >
                <Radio value={true}>Hoạt động</Radio>
                <Radio value={false}>Không hoạt động</Radio>
              </Radio.Group>
            )}
            {selectedFilter.type === "radioYesNo" && (
              <Radio.Group
                value={filterValues[selectedFilter.key as string]}
                onChange={(e) =>
                  handleChange(selectedFilter.key as string, e.target.value)
                }
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 5,
                  justifyContent: "center",
                }}
              >
                <Radio value={true}>Đúng</Radio>
                <Radio value={false}>Sai</Radio>
              </Radio.Group>
            )}
          </div>
        )}

        <Button
          type="primary"
          style={{
            width: "100%",
            borderRadius: 5,
            height: 40,
            marginBottom: 10,
          }}
          onClick={handleApply}
        >
          Áp dụng
        </Button>
        <Button
          danger
          onClick={closeDrawer}
          style={{ width: "100%", borderRadius: 5, height: 40 }}
        >
          Huỷ
        </Button>
      </Drawer>
    </>
  );
};

export default FilterData;

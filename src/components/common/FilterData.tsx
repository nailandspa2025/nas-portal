import React, { useState } from "react";
import {
  Col,
  Space,
  Button,
  Input,
  Dropdown,
  Drawer,
  Select,
  Tag,
  Radio,
  MenuProps,
  RadioChangeEvent,
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
  onFilterChange?: (filters: TypeFilter[]) => void;
};

const FilterData: React.FC<FilterDataProps> = ({
  filters = [],
  onFilterChange = () => {},
}) => {
  const [visible, setVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TypeFilter | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<TypeFilter[]>(
    filters.filter((f) => f.isActive && f.popup)
  );
  const [filterOptions, setFilterOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [filterValues, setFilterValues] = useState<TypeFilter | null>(null);
  const [dataFilter, setDataFilter] = useState<TypeFilter[]>([]);
  const openDrawer = async (filter: TypeFilter) => {
    setVisible(true);
    if (filter.actionName) {
      const data = await getDataForFilter(filter.actionName);
      setFilterOptions(data);
    }
    setActiveFilter(filter);
  };
  const removeFilter = (filterToRemove: TypeFilter) => {
    const updatedFilters = selectedFilters.filter(
      (f) => f.key !== filterToRemove.key
    );
    setSelectedFilters(updatedFilters);
    const data = [...dataFilter, ...updatedFilters];
    onFilterChange(data);
  };

  const resetFilters = () => {
    setSelectedFilters([]);
    onFilterChange(dataFilter);
  };
  const handleApply = () => {
    if (!activeFilter || !filterValues) return;
    const updatedFilters = [
      ...selectedFilters.filter((f) => f.key !== activeFilter.key),
      filterValues,
    ];
    setSelectedFilters(updatedFilters);
    setActiveFilter(null);
    setFilterValues(null);
    setVisible(false);
    const data = [...dataFilter, ...updatedFilters];
    onFilterChange(data);
  };
  const closeDrawer = () => {
    setVisible(false);
    setSelectedFilters([...selectedFilters]);
  };
  const handleSelect = (values: string | string[], options: any) => {
    if (!values) return;
    const isMultiple = Array.isArray(values);
    const selectedLabels = isMultiple
      ? options?.map((opt: { label: string }) => opt.label).join(", ")
      : options.label;
    setFilterValues((prev) => ({
      ...prev,
      actionName: activeFilter.actionName,
      key: activeFilter?.key,
      name: activeFilter?.name,
      type: activeFilter?.type,
      value: values,
      selected: { label: selectedLabels },
      field: Array.isArray(activeFilter?.field)
        ? activeFilter.field
        : [activeFilter?.field ?? ""],
      popup: activeFilter?.popup !== undefined ? activeFilter.popup : false,
    }));
  };
  const handleRadioChange = (e: RadioChangeEvent) => {
    if (!activeFilter) return;
    const value = e.target.value;
    const label =
      activeFilter.type === "radioActive"
        ? value
          ? "Hoạt động"
          : "Không hoạt động"
        : value
        ? "Yes"
        : "No";

    setFilterValues((prev) => ({
      ...prev,
      key: activeFilter?.key,
      name: activeFilter.name,
      type: activeFilter.type,
      value: value,
      selected: { label },
      field: Array.isArray(activeFilter?.field)
        ? activeFilter.field
        : [activeFilter?.field ?? ""],
      popup: activeFilter.popup !== undefined ? activeFilter.popup : false,
    }));
  };
  const menuFilters: MenuProps["items"] = filters
    .filter((f) => !f.isActive && f.popup)
    .flatMap((f, index, array) => {
      const menuItem = {
        key: f.key!,
        label: f.name,
        onClick: () => openDrawer(f),
      };
      return index < array.length - 1
        ? [menuItem, { type: "divider" } as const]
        : [menuItem];
    });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setDataFilter(newValue ? [{ ...filters[0], value: newValue }] : []);
  };

  const searchText = () => {
    const data = [...dataFilter, ...selectedFilters];
    onFilterChange(data);
  };

  return (
    <>
      {filters && filters.length > 0 && (
        <Col
          xs={24}
          sm={24}
          lg={12}
          md={12}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Space.Compact block>
            <Input
              placeholder={filters[0].name}
              onChange={handleInputChange}
              value={dataFilter[0]?.value}
              onKeyPress={(event: { key: string }) => {
                if (event.key === "Enter") {
                  searchText();
                }
              }}
            />
            <Button
              type="primary"
              onClick={searchText}
              icon={<SearchOutlined />}
            >
              Tìm
            </Button>
          </Space.Compact>
          <Dropdown
            menu={{
              items: menuFilters,
            }}
          >
            <Button
              type="default"
              icon={<FilterOutlined />}
              style={{ marginLeft: 8 }}
            >
              Bộ lọc
            </Button>
          </Dropdown>
        </Col>
      )}
      {selectedFilters && selectedFilters.length > 0 && (
        <Col md={24}>
          <Space size={[0, 8]} wrap>
            {selectedFilters.map((filter) => (
              <Tag
                closable
                onClose={() => removeFilter(filter)}
                key={filter.key}
                color="blue"
                style={{ cursor: "pointer" }}
                onClick={() => openDrawer(filter)}
              >
                {filters.find((f) => f.key === filter.key)?.name}:{" "}
                {(filter.selected as { label?: string })?.label || filter.name}
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
        {activeFilter && (
          <div style={{ marginBottom: 15 }}>
            <label
              style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
            >
              {activeFilter.name}
            </label>

            {activeFilter.type === "select" && (
              <Select
                style={{ width: "100%" }}
                placeholder={`Chọn ${activeFilter.name}`}
                value={filterValues?.value ?? activeFilter?.value}
                onChange={(value, option) => handleSelect(value, option)}
              >
                {filterOptions?.map((item) => (
                  <Select.Option
                    key={item?.value}
                    value={item.value}
                    label={item.label}
                  >
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            )}

            {activeFilter.type === "multiSelect" && (
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder={`Chọn ${activeFilter.name}`}
                value={filterValues?.value ?? activeFilter?.value}
                onChange={(value, option) => handleSelect(value, option)}
              >
                {filterOptions?.map((item) => (
                  <Select.Option
                    key={item?.value}
                    value={item.value}
                    label={item.label}
                  >
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            )}

            {activeFilter.type === "radioActive" && (
              <Radio.Group
                onChange={handleRadioChange}
                value={filterValues?.value ?? activeFilter?.value}
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
            {activeFilter.type === "radioYesNo" && (
              <Radio.Group
                onChange={handleRadioChange}
                value={filterValues?.value ?? activeFilter?.value}
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 5,
                  justifyContent: "center",
                }}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
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
          onClick={() => {
            handleApply();
          }}
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  RadioChangeEvent,
  Row,
  Checkbox,
} from "antd";
import {
  DownOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getDataForFilter } from "../../utils/common/getDataForFilter";
import { useLocation } from "react-router-dom";

type FilterDataProps = {
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  submit?: () => void;
  filters?: any;
  onFilterChange?: (filters: any) => void;
  columns?: any;
  onColumnChange?: (columns: any) => void;
  buttons?: any;
  handlers?: Record<string, () => void>;
  actions?: any;
};

const FilterData: React.FC<FilterDataProps> = ({
  filters = [],
  onFilterChange = () => {},
  columns = [],
  onColumnChange,
  buttons = [],
  handlers,
  actions = [],
}) => {
  const location = useLocation();
  const dropdownRef = useRef<any>(null);
  const storageKey = `${location.pathname}_columns`;
  const [dialogFilterVisible, setDialogFilterVisible] =
    useState<boolean>(false);
  const [filterTextData, setFilterTextData] = useState<any>({});
  const [keywordSearch, setKeywordSearch] = useState({});
  const [dialogFilterValue, setDialogFilterValue] = useState<any>({});
  const [dialogFilterSelected, setDialogFilterSelected] = useState<any>(null);
  const [dialogFilterOptions, setDialogFilterOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [dialogFilterLabel, setDialogFilterLabel] = useState(
    filters.filter((f: any) => f.isActive && f.popup)
  );
  const [columnVisible, setColumnVisible] = useState<boolean>(false);
  const [currentColumns, setCurrentColumns] = useState<any>(columns);
  const [initialLoad, setInitialLoad] = useState(false);
  const addFilter = useCallback((filters: any) => {
    const params = filters.reduce((acc: any, f: any) => {
      if (f.field !== undefined) {
        acc[f.field] = f.value;
      }
      return acc;
    }, {} as Record<string, string>);
    onFilterChange(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const getData = () => {
      const filterData: any = [];
      if (keywordSearch) {
        filterData.push(keywordSearch);
      }
      filterData.push(...dialogFilterLabel);
      addFilter(filterData);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogFilterLabel, keywordSearch]);

  useEffect(() => {
    const savedHiddenColumns = JSON.parse(
      localStorage.getItem(storageKey) || "{}"
    );
    setCurrentColumns((prevColumns: any) =>
      prevColumns.map((col: any) => ({
        ...col,
        hidden: savedHiddenColumns[col.key] ?? col.hidden,
      }))
    );
  }, [storageKey]);
  useEffect(() => {
    if (!onColumnChange) return;
    const hiddenColumns = Object.fromEntries(
      currentColumns.map((col: any) => [col.key, col.hidden])
    );
    if (initialLoad) {
      localStorage.setItem(storageKey, JSON.stringify(hiddenColumns));
    }
    onColumnChange(currentColumns);
  }, [currentColumns, storageKey, onColumnChange, initialLoad]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTextData((prev: any) => ({
      ...prev,
      field: filters[0].field,
      value: e.target.value,
    }));
  };
  const searchText = () => {
    setKeywordSearch(filterTextData);
  };
  const openDrawer = async (f: any) => {
    setDialogFilterVisible(true);
    setDialogFilterSelected(f);
    if (f.actionName) {
      const data = await getDataForFilter(f.actionName);
      setDialogFilterOptions(data);
    }
    setDialogFilterValue({
      actionName: f.actionName,
      field: f.field,
      value: f.value ?? null,
      name: f.name,
      type: f.type,
      selected: f.selected ?? { label: "" },
    });
  };
  const removeFilter = (filter: any) => {
    const updatedFilters = dialogFilterLabel.filter(
      (f: any) => f.field !== filter.field
    );
    setDialogFilterLabel(updatedFilters);
  };
  const resetFilters = () => {
    setDialogFilterLabel([]);
  };
  const handleSelectChange = (
    values: string | string[],
    options?: { label: string } | { label: string }[]
  ) => {
    const isMultiple = Array.isArray(values);
    const label = isMultiple
      ? Array.isArray(options)
        ? options.map((opt) => opt.label).join(", ")
        : ""
      : (options as { label: string })?.label || "";

    setDialogFilterValue((prev: any) => ({
      ...prev,
      actionName: dialogFilterSelected?.actionName,
      field: dialogFilterSelected?.field,
      value: values,
      name: dialogFilterSelected?.name,
      type: dialogFilterSelected?.type,
      selected: { label },
    }));
  };
  const handleRadioChange = (e: RadioChangeEvent) => {
    const label =
      dialogFilterSelected?.type === "radioActive"
        ? e.target.value
          ? "Hoạt động"
          : "Không hoạt động"
        : e.target.value
        ? "Yes"
        : "No";
    setDialogFilterValue((prev: any) => ({
      ...prev,
      actionName: dialogFilterSelected?.actionName,
      field: dialogFilterSelected?.field,
      value: e.target.value,
      name: dialogFilterSelected?.name,
      type: dialogFilterSelected?.type,
      selected: { label },
    }));
  };
  const applyFilter = () => {
    if (!dialogFilterSelected || !dialogFilterValue) return;
    setDialogFilterVisible(false);
    const updatedFilters: any = [
      ...dialogFilterLabel.filter(
        (f: any) => f.field !== dialogFilterSelected?.field
      ),
      dialogFilterValue,
    ];
    setDialogFilterLabel(updatedFilters);
  };

  const filerMenus = filters.filter(
    (f: any) =>
      f.popup && !dialogFilterLabel.some((df: any) => df.field === f.field)
  );
  const handleColumn = (key: string) => {
    setCurrentColumns((prev: any) =>
      prev.map((col: any) =>
        col.key === key ? { ...col, hidden: !col.hidden } : col
      )
    );
    setInitialLoad(true);
  };
  const handleAction = (funcName: string) => {
    if (handlers && handlers[funcName]) {
      handlers[funcName]();
    } else {
      console.warn(`Hàm xử lý cho "${funcName}" chưa được định nghĩa.`);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setColumnVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <Row gutter={[8, 8]} style={{ width: "100%" }}>
        {filters && filters.length > 0 && (
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Space.Compact block>
              <Input
                placeholder={filters[0].name}
                onChange={handleInputChange}
                value={filterTextData?.value}
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
            {filerMenus && filerMenus.length > 0 && (
              <Dropdown
                trigger={["click"]}
                menu={{
                  items: filerMenus.flatMap((item: any, index: number) => [
                    {
                      key: item.key,
                      label: item.name,
                      onClick: () => openDrawer(item),
                    },
                    ...(index < actions.length - 1
                      ? [{ type: "divider" }]
                      : []),
                  ]),
                  selectable: true,
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
            )}
          </Col>
        )}
        {columns && columns.length > 0 && (
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Space size={[5, 8]} wrap>
              <div>
                {buttons
                  ?.filter((f: any) => f.position === "left")
                  .map((item: any) => (
                    <Button
                      color={item.color}
                      variant="solid"
                      key={item.funcName}
                      onClick={() => handleAction(item.funcName)}
                    >
                      {item.label}
                    </Button>
                  ))}
              </div>
              <div>
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: actions.flatMap((item: any, index: number) => [
                      {
                        key: item.key,
                        label: (
                          <span onClick={() => handleAction(item.funcName)}>
                            {item.icon}
                            <span style={{ marginLeft: 8 }}>{item.label}</span>
                          </span>
                        ),
                      },
                      ...(index < actions.length - 1
                        ? [{ type: "divider" }]
                        : []),
                    ]),
                    selectable: true,
                  }}
                >
                  <Button color="cyan" variant="outlined">
                    Thao tác <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
              <div ref={dropdownRef}>
                <Dropdown
                  menu={{
                    items: currentColumns.flatMap(
                      (item: any, index: number) => [
                        {
                          key: item.key,
                          label: (
                            <div onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={!item.hidden}
                                onChange={() => handleColumn(item.key)}
                              >
                                {item.title}
                              </Checkbox>
                            </div>
                          ),
                        },
                        ...(index < currentColumns.length - 1
                          ? [{ type: "divider" }]
                          : []),
                      ]
                    ),
                  }}
                  trigger={["click"]}
                  open={columnVisible}
                  //onOpenChange={(visible) => setColumnVisible(visible)}
                >
                  <Button
                    color="cyan"
                    variant="outlined"
                    onClick={() => setColumnVisible(!columnVisible)}
                  >
                    Ẩn hiện cột <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
              <div>
                {buttons
                  ?.filter((f: any) => f.position === "right")
                  .map((item: any) => (
                    <Button
                      key={item.funcName}
                      color={item.color}
                      variant="solid"
                      onClick={() => handleAction(item.funcName)}
                    >
                      {item.label}
                    </Button>
                  ))}
              </div>
            </Space>
          </Col>
        )}
        {dialogFilterLabel && dialogFilterLabel.length > 0 && (
          <Col md={24}>
            <Space size={[0, 8]} wrap>
              {dialogFilterLabel.map((filter: any) => (
                <Tag
                  closable
                  onClose={() => removeFilter(filter)}
                  key={filter.field}
                  color="blue"
                  style={{ cursor: "pointer" }}
                  onClick={() => openDrawer(filter)}
                >
                  {filters.find((f: any) => f.field === filter.field)?.name}:{" "}
                  {(filter.selected as { label?: string })?.label || ""}
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
      </Row>
      <Drawer
        title="Bộ lọc"
        placement="right"
        onClose={() => setDialogFilterVisible(false)}
        open={dialogFilterVisible}
        width={450}
      >
        {dialogFilterSelected && (
          <div style={{ marginBottom: 15 }}>
            <label
              style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
            >
              {dialogFilterSelected.name}
            </label>

            {dialogFilterSelected.type === "select" && (
              <Select
                style={{ width: "100%" }}
                placeholder={`Chọn ${dialogFilterSelected.name}`}
                value={dialogFilterValue.value ?? dialogFilterSelected.value}
                onChange={handleSelectChange}
              >
                {dialogFilterOptions?.map((item) => (
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
            {dialogFilterSelected.type === "multiSelect" && (
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder={`Chọn ${dialogFilterSelected.name}`}
                value={dialogFilterValue.value ?? dialogFilterSelected.value}
                onChange={handleSelectChange}
              >
                {dialogFilterOptions?.map((item) => (
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

            {dialogFilterSelected.type === "radioActive" && (
              <Radio.Group
                onChange={handleRadioChange}
                value={dialogFilterValue.value ?? dialogFilterSelected.value}
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
            {dialogFilterSelected.type === "radioYesNo" && (
              <Radio.Group
                onChange={handleRadioChange}
                value={dialogFilterValue.value ?? dialogFilterSelected.value}
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
            applyFilter();
          }}
        >
          Áp dụng
        </Button>
        <Button
          danger
          onClick={() => setDialogFilterVisible(false)}
          style={{ width: "100%", borderRadius: 5, height: 40 }}
        >
          Huỷ
        </Button>
      </Drawer>
    </>
  );
};
export default FilterData;

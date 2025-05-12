/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Col,
  Space,
  Button,
  Input,
  Dropdown,
  Select,
  Tag,
  Radio,
  RadioChangeEvent,
  Row,
  Checkbox,
  Modal,
} from "antd";
import {
  DownOutlined,
  FilterOutlined,
  SearchOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { getDataForFilter } from "../../utils/common/getDataForFilter";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { debounce, intersection } from "lodash-es";
type FilterDataProps = {
  onFilterChange?: (filters: any) => void;
  onColumnChange?: (columns: any) => void;
  handlers?: Record<string, () => void>;
  utils?: any;
  filteredColumns?: any;
};

const FilterData: React.FC<FilterDataProps> = ({
  onFilterChange = () => {},
  onColumnChange,
  handlers,
  utils = [],
  filteredColumns,
}) => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
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
    utils?.filters?.filter((f: any) => f.isActive && f.popup)
  );
  const [columnVisible, setColumnVisible] = useState<boolean>(false);
  const [currentColumns, setCurrentColumns] = useState<any>([]);
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    const parsed: Record<string, boolean> | null = stored
      ? JSON.parse(stored)
      : null;

    const columnsToUse = filteredColumns?.map((col: any) => ({
      ...col,
      hidden: parsed?.[col.key] ?? col.hidden ?? false,
    }));

    setCurrentColumns(columnsToUse);

    if (onColumnChange) {
      onColumnChange(columnsToUse);
    }
  }, [filteredColumns, storageKey, onColumnChange]);

  useEffect(() => {
    const hiddenMap = Object.fromEntries(
      currentColumns?.map((col: any) => [col.key, col.hidden ?? false])
    );
    localStorage.setItem(storageKey, JSON.stringify(hiddenMap));
  }, [currentColumns, storageKey]);

  const addFilter = useCallback((f: any) => {
    const params = f.reduce((acc: any, f: any) => {
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
      filterData.push(...(dialogFilterLabel ?? []));
      addFilter(filterData);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogFilterLabel, keywordSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTextData((prev: any) => ({
      ...prev,
      field: utils?.filters[0].field,
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
      setDialogFilterOptions(
        data.map((item: any) => ({ ...item, value: item.value.toString() }))
      );
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
          ? t("Active")
          : t("InActive")
        : e.target.value
        ? t("Yes")
        : t("No");
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

  const filerMenus = utils?.filters?.filter(
    (f: any) =>
      f.popup && !dialogFilterLabel.some((df: any) => df.field === f.field)
  );
  const handleColumn = (key: string) => {
    const updatedColumns = currentColumns.map((col: any) =>
      col.key === key ? { ...col, hidden: !col.hidden } : col
    );
    setCurrentColumns(updatedColumns);
    if (onColumnChange) {
      onColumnChange(updatedColumns);
    }
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

  const handleSearchFilterOption = debounce(
    async (actionName: string, value: string) => {
      if (actionName) {
        const data = await getDataForFilter(actionName, value);
        setDialogFilterOptions(
          data.map((item: any) => ({ ...item, value: item.value.toString() }))
        );
      }
    },
    500
  );

  return (
    <>
      <Row gutter={[0, 10]} style={{ width: "100%" }}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          style={{ display: "flex", alignItems: "center" }}
        >
          {utils?.filters && utils.filters.length > 0 && (
            <Space.Compact block>
              <Input
                placeholder={utils?.filters[0].name}
                onChange={handleInputChange}
                value={filterTextData?.value}
                onKeyPress={(event: { key: string }) => {
                  if (event.key === "Enter") {
                    searchText();
                  }
                }}
                suffix={
                  <CloseCircleOutlined
                    onClick={() => setFilterTextData({})}
                    style={{
                      cursor: "pointer",
                      color: "rgba(0,0,0,0.45)",
                      visibility: filterTextData?.value ? "visible" : "hidden",
                    }}
                  />
                }
              />
              <Button
                type="primary"
                onClick={searchText}
                icon={<SearchOutlined />}
              >
                {t("Search")}
              </Button>
            </Space.Compact>
          )}
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
                  ...(index < filerMenus.length - 1
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
                {t("Filter")}
              </Button>
            </Dropdown>
          )}
        </Col>
        {utils?.columns && utils?.columns.length > 0 && (
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
            <Space
              size={[0, 10]}
              wrap
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <Space>
                {utils?.buttons
                  ?.filter((f: any) => f.position === "left")
                  .map((item: any) => (
                    <>
                      {intersection(accesses || [], item.accessRight).length >
                        0 && (
                        <Button
                          color={item.color}
                          variant="solid"
                          key={item.funcName}
                          onClick={() => handleAction(item.funcName)}
                        >
                          {t(item.label)}
                        </Button>
                      )}
                    </>
                  ))}
              </Space>
              <div>
                {utils?.actions && utils?.actions.length > 0 && (
                  <Dropdown
                    trigger={["click"]}
                    menu={{
                      items: utils?.actions?.flatMap(
                        (item: any, index: number) => [
                          {
                            disabled:
                              intersection(accesses || [], item.accessRight)
                                .length <= 0,
                            key: item.key,
                            label: (
                              <span
                                onClick={() => {
                                  if (
                                    intersection(
                                      accesses || [],
                                      item.accessRight
                                    ).length > 0
                                  )
                                    handleAction(item.funcName);
                                }}
                              >
                                {item.icon}
                                <span style={{ marginLeft: 8 }}>
                                  {t(item.label)}
                                </span>
                              </span>
                            ),
                          },
                          ...(index < utils?.actions.length - 1
                            ? [{ type: "divider" }]
                            : []),
                        ]
                      ),
                      selectable: true,
                    }}
                  >
                    <Button variant="outlined">
                      {t("Action")} <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
              </div>
              <div ref={dropdownRef}>
                <Dropdown
                  menu={{
                    items: currentColumns?.flatMap(
                      (item: any, index: number) => [
                        {
                          key: item.key,
                          label: (
                            <div onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={!item.hidden}
                                onChange={() => handleColumn(item.key)}
                              >
                                {t(item.title)}
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
                    // color="cyan"
                    variant="outlined"
                    onClick={() => setColumnVisible(!columnVisible)}
                  >
                    {t("Show hide columns")} <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
              <Space>
                {utils?.buttons
                  ?.filter((f: any) => f.position === "right")
                  .map((item: any) => (
                    <>
                      {intersection(accesses || [], item.accessRight).length >
                        0 && (
                        <Button
                          key={item.funcName}
                          color={item.color}
                          variant="solid"
                          onClick={() => handleAction(item.funcName)}
                        >
                          {t(item.label)}
                        </Button>
                      )}
                    </>
                  ))}
              </Space>
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
                  {
                    utils?.filters.find((f: any) => f.field === filter.field)
                      ?.name
                  }
                  : {(filter.selected as { label?: string })?.label || ""}
                </Tag>
              ))}
              {dialogFilterLabel.length > 1 && (
                <Tag
                  color="red"
                  style={{ cursor: "pointer" }}
                  onClick={resetFilters}
                >
                  {t("Delete all")}
                </Tag>
              )}
            </Space>
          </Col>
        )}
      </Row>
      <Modal
        title={t("Filter")}
        open={dialogFilterVisible}
        onCancel={() => setDialogFilterVisible(false)}
        footer={[
          <Button
            key="cancel"
            type="primary"
            danger
            onClick={() => setDialogFilterVisible(false)}
          >
            {t("Cancel")}
          </Button>,
          <Button key="submit" type="primary" onClick={applyFilter}>
            {t("Apply")}
          </Button>,
        ]}
      >
        {dialogFilterSelected && (
          <div
            style={{
              paddingTop: 24,
              paddingBottom: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {(dialogFilterSelected.type === "select" ||
              dialogFilterSelected.type === "multiSelect") && (
              <Select
                mode={
                  dialogFilterSelected.type === "multiSelect"
                    ? "multiple"
                    : undefined
                }
                showSearch
                allowClear
                style={{ width: "100%" }}
                placeholder={t(`Choose ${dialogFilterSelected.name}`)}
                value={dialogFilterValue.value ?? dialogFilterSelected.value}
                onChange={handleSelectChange}
                onSearch={(inputValue) =>
                  handleSearchFilterOption(
                    dialogFilterSelected.actionName,
                    inputValue
                  )
                }
                filterOption={false} // Tắt lọc client
                options={dialogFilterOptions.map((item: any) => ({
                  label: `${item.label}`,
                  value: item.value,
                }))}
              />
            )}

            {dialogFilterSelected.type === "radioActive" && (
              <Radio.Group
                onChange={handleRadioChange}
                value={dialogFilterValue.value ?? dialogFilterSelected.value}
                style={{
                  display: "flex",
                  gap: 16,
                  justifyContent: "center",
                  paddingTop: 4,
                }}
              >
                <Radio value={true}>{t("Active")}</Radio>
                <Radio value={false}>{t("InActive")}</Radio>
              </Radio.Group>
            )}

            {dialogFilterSelected.type === "radioYesNo" && (
              <Radio.Group
                onChange={handleRadioChange}
                value={dialogFilterValue.value ?? dialogFilterSelected.value}
                style={{
                  display: "flex",
                  gap: 16,
                  justifyContent: "center",
                  paddingTop: 4,
                }}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            )}
          </div>
        )}
      </Modal>

      {/* <Drawer
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
                    {t(item.label)}
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
                    {t(item.label)}
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
                <Radio value={true}>{t("Active")}</Radio>
                <Radio value={false}>{t("InActive")}</Radio>
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
          {t("Apply")}
        </Button>
        <Button
          danger
          onClick={() => setDialogFilterVisible(false)}
          style={{ width: "100%", borderRadius: 5, height: 40 }}
        >
          {t("Cancel")}
        </Button>
      </Drawer> */}
    </>
  );
};
export default FilterData;

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Select, Space, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type {
  ConditionGroup,
  ConditionItem,
  SchemaField,
} from "../utils/conditionBuilderTypes";
import {
  CONDITION_BUILDER_SCHEMA_FIELDS,
  DEFAULT_ROOT_GROUP,
  type FieldDataType,
  isConditionGroup,
  isConditionItem,
  MAX_GROUP_DEPTH,
  OPERATOR_LABELS,
  OPERATORS_BY_TYPE,
} from "../utils/conditionBuilderTypes";
import {
  deserializeConditionGroup,
  hasAtLeastOneValidCondition,
  serializeConditionGroup,
  validateConditionGroup,
  type ValidationError,
} from "../utils/conditionBuilderUtils";

export type ConditionBuilderProps = {
  /** Backward compat: value can be old expression string or new schema object */
  value?: any;
  onChange?: (value: any) => void;
  schemaFields?: SchemaField[];
  disabled?: boolean;
  maxDepth?: number;
  onValidationChange?: (valid: boolean, errors: ValidationError[]) => void;
};

const fieldOptions = (schemaFields: SchemaField[]) =>
  schemaFields.map((f) => ({ label: f.label, value: f.key }));

function getOperatorsForType(type: FieldDataType) {
  return OPERATORS_BY_TYPE[type] ?? OPERATORS_BY_TYPE.string;
}

function getOperatorsForField(key: string, schemaFields: SchemaField[]) {
  const fieldDef = schemaFields.find((s) => s.key === key);
  const operatorsFromSchema = fieldDef?.operators;
  if (Array.isArray(operatorsFromSchema) && operatorsFromSchema.length > 0) {
    return operatorsFromSchema.map((op) => ({
      value: op,
      label: OPERATOR_LABELS[op] ?? op,
    }));
  }

  const fieldType = key
    ? getFieldType(key, schemaFields)
    : ("string" as FieldDataType);
  return getOperatorsForType(fieldType);
}

function getFieldType(key: string, schemaFields: SchemaField[]): FieldDataType {
  const f = schemaFields.find((s) => s.key === key);
  return (f?.type as FieldDataType) ?? "string";
}

const emptyCondition: ConditionItem = { field: "", operator: "", value: null };

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  value,
  onChange,
  schemaFields = CONDITION_BUILDER_SCHEMA_FIELDS,
  disabled = false,
  maxDepth = MAX_GROUP_DEPTH,
  onValidationChange,
}) => {
  const { t } = useTranslation();
  const [rootGroup, setRootGroup] = useState<ConditionGroup>(() => ({
    ...DEFAULT_ROOT_GROUP,
    elements: [],
  }));
  const isUserChange = useRef(false);
  const lastValueKeyRef = useRef<string | null>(null);
  const emitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (emitTimeoutRef.current != null) {
        clearTimeout(emitTimeoutRef.current);
        emitTimeoutRef.current = null;
      }
    },
    [],
  );

  // Sync value from prop (initial load or external change)
  useEffect(() => {
    const nextKey =
      value == null
        ? ""
        : typeof value === "string"
          ? value
          : (() => {
              try {
                return JSON.stringify(value);
              } catch {
                return String(value);
              }
            })();
    if (nextKey === lastValueKeyRef.current) return;

    // Form `value` can lag behind local `rootGroup`, or stringify differently (key order).
    // Applying inbound now would clobber in-progress typing → cursor fighting / IME glitches.
    if (isUserChange.current) {
      return;
    }

    // Prop-driven sync (Form echo or external): do not treat next rootGroup update as user edit
    isUserChange.current = false;

    if (typeof value === "string") {
      const deserialized = deserializeConditionGroup(value);
      setRootGroup(deserialized);
      lastValueKeyRef.current = nextKey;
      return;
    }
    // if (value && typeof value === "object") {
    //   const group = transformSchemaToConditionGroup(value);
    //   setRootGroup(group);
    //   lastValueKeyRef.current = nextKey;
    //   return;
    // }
    if (value && typeof value === "object") {
      const group: ConditionGroup = {
        operator: value.operator ?? "AND",
        elements: (value.elements ?? []).map((item: any) => {
          if (item.elements) {
            return {
              operator: item.operator ?? "AND",
              elements: item.elements,
            };
          }

          return {
            field: item.field ?? "",
            operator: item.operator ?? "",
            value: item.value ?? null,
          };
        }),
      };
      setRootGroup(group);
      lastValueKeyRef.current = nextKey;
      return;
    }
    // Empty/reset
    setRootGroup({ ...DEFAULT_ROOT_GROUP, elements: [] });
    lastValueKeyRef.current = nextKey;
  }, [value, schemaFields]);

  const serialize = useCallback(
    (group: ConditionGroup) =>
      serializeConditionGroup(group, schemaFields, true),
    [schemaFields],
  );

  const serializedForPreview =
    rootGroup.elements.length > 0 ? serialize(rootGroup) : "";
  const previewString =
    rootGroup.elements.length > 0
      ? serializedForPreview
      : typeof value === "string"
        ? value
        : "";

  const runValidation = useCallback(
    (group: ConditionGroup): ValidationError[] => {
      const errors: ValidationError[] = [];
      validateConditionGroup(group, schemaFields, 0, maxDepth, errors);
      if (errors.length === 0 && !hasAtLeastOneValidCondition(group)) {
        errors.push({
          type: "empty_group",
          message: "At least one valid condition is required",
        });
      }
      return errors;
    },
    [schemaFields, maxDepth],
  );

  useEffect(() => {
    if (
      rootGroup.elements.length === 0 &&
      typeof value === "string" &&
      value.trim()
    ) {
      onValidationChange?.(true, []);
      return;
    }
    const errors = runValidation(rootGroup);
    const valid = errors.length === 0;
    onValidationChange?.(valid, errors);
  }, [rootGroup, runValidation, onValidationChange, value]);

  const updateRoot = useCallback(
    (updater: (g: ConditionGroup) => ConditionGroup) => {
      isUserChange.current = true;
      setRootGroup((prev) => updater(prev));
    },
    [],
  );

  const updateGroupAtPath = useCallback(
    (
      group: ConditionGroup,
      path: number[],
      fn: (g: ConditionGroup) => ConditionGroup,
    ): ConditionGroup => {
      if (!path.length) return fn(group);
      const [index, ...rest] = path;
      const elements = [...group.elements];
      const el = elements[index];
      if (isConditionGroup(el)) {
        elements[index] = updateGroupAtPath(el, rest, fn);
      }
      return {
        ...group,
        elements,
      };
    },
    [],
  );

  // Sync local tree state to Form field (string expression) asynchronously
  useEffect(() => {
    if (!isUserChange.current) return;
    const nextValue = serializeConditionGroup(rootGroup, schemaFields);
    const nextKey = String(nextValue);

    if (lastValueKeyRef.current === nextKey) return;
    lastValueKeyRef.current = nextKey;

    // Defer to next tick to avoid interfering with Select dropdown interactions
    if (onChange) {
      if (emitTimeoutRef.current != null) {
        clearTimeout(emitTimeoutRef.current);
      }
      emitTimeoutRef.current = setTimeout(() => {
        emitTimeoutRef.current = null;
        onChange(rootGroup);
        // Form will echo `value` back; without this, isUserChange stays true and outbound re-runs on every rootGroup change → input flicker / IME fights
        isUserChange.current = false;
      }, 0);
    } else {
      isUserChange.current = false;
    }
  }, [rootGroup, schemaFields, onChange]);

  const setGroupOperator = useCallback(
    (path: number[], op: "AND" | "OR") => {
      updateRoot((root) =>
        updateGroupAtPath(root, path, (g) => ({
          ...g,
          operator: op,
        })),
      );
    },
    [updateRoot, updateGroupAtPath],
  );

  const addElement = useCallback(
    (path: number[], kind: "condition" | "group") => {
      if (kind === "group" && path.length >= maxDepth) return;
      updateRoot((root) =>
        updateGroupAtPath(root, path, (g) => ({
          ...g,
          elements: [
            ...g.elements,
            kind === "condition"
              ? { ...emptyCondition }
              : { operator: "AND", elements: [{ ...emptyCondition }] },
          ],
        })),
      );
    },
    [maxDepth, updateRoot, updateGroupAtPath],
  );

  const removeElement = useCallback(
    (path: number[], index: number) => {
      updateRoot((root) =>
        updateGroupAtPath(root, path, (g) => {
          const elements = [...g.elements];
          elements.splice(index, 1);
          return {
            ...g,
            elements,
          };
        }),
      );
    },
    [updateRoot, updateGroupAtPath],
  );

  const updateCondition = useCallback(
    (path: number[], index: number, patch: Partial<ConditionItem>) => {
      updateRoot((root) =>
        updateGroupAtPath(root, path, (g) => {
          const elements = [...g.elements];
          const el = elements[index];

          if (isConditionItem(el)) {
            let updated: ConditionItem = {
              ...el,
              ...patch,
            };

            // Khi đổi field: auto set operator mặc định và reset value
            if (patch.field !== undefined) {
              if (!patch.field) {
                updated = {
                  ...updated,
                  operator: "",
                  value: null,
                };
              } else {
                const operatorsForField = getOperatorsForField(
                  patch.field as string,
                  schemaFields,
                );
                const defaultOperator = operatorsForField[0]?.value || "EQ";
                updated = {
                  ...updated,
                  operator: defaultOperator,
                  value: null,
                };
              }
            } else if (patch.operator !== undefined) {
              // Đổi operator thì luôn reset value
              updated = {
                ...updated,
                value: null,
              };
            }

            elements[index] = updated;
          }

          return {
            ...g,
            elements,
          };
        }),
      );
    },
    [updateRoot, updateGroupAtPath, schemaFields],
  );

  const canAddGroup = (path: number[]) => path.length < maxDepth;

  const renderConditionRow = (
    path: number[],
    index: number,
    c: ConditionItem,
  ) => {
    const fieldDef = schemaFields.find((s) => s.key === c.field);
    const fieldType = c.field ? getFieldType(c.field, schemaFields) : "string";
    const operators = c.field
      ? getOperatorsForField(c.field, schemaFields)
      : getOperatorsForType("string");
    const isBetween = c.operator === "BETWEEN";
    const isIn = c.operator === "IN";
    const hasOptions = !!fieldDef?.options?.length;
    return (
      <div
        key={`condition-${path.join("-")}-${index}`}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          marginBottom: 8,
          width: "100%",
        }}
      >
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} sm={24} md={9} lg={9}>
              <Select
                placeholder={t("Please select condition")}
                value={c.field || undefined}
                onChange={(v) =>
                  updateCondition(path, index, { field: v || "" })
                }
                style={{ width: "100%" }}
                disabled={disabled}
                options={fieldOptions(schemaFields)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={24} md={6} lg={6}>
              <Select
                placeholder={t("Please select operator")}
                value={c.operator || undefined}
                onChange={(v) =>
                  updateCondition(path, index, { operator: v || "" })
                }
                style={{ width: "100%" }}
                disabled={disabled || !c.field}
                options={operators.map((o) => ({
                  label: o.label,
                  value: o.value,
                }))}
                allowClear
              />
            </Col>
            <Col xs={24} sm={24} md={9} lg={9}>
              <>
                {hasOptions ? (
                  <Select
                    mode={isIn ? "multiple" : undefined}
                    placeholder={"Select..."}
                    value={c.value != null ? c.value : undefined}
                    onChange={(v) => updateCondition(path, index, { value: v })}
                    style={{ width: "100%" }}
                    disabled={disabled}
                    options={fieldDef.options}
                    allowClear
                  />
                ) : (
                  <>
                    {fieldType === "number" && !isIn && !isBetween && (
                      <Input
                        type="number"
                        placeholder={"Enter..."}
                        value={c.value != null ? String(c.value) : ""}
                        onChange={(e) =>
                          updateCondition(path, index, {
                            value:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                        // style={{ flex: "1 1 30%", minWidth: 140 }}
                        disabled={disabled}
                      />
                    )}
                    {fieldType === "number" && isIn && (
                      <Input
                        placeholder="1,2,3"
                        value={
                          Array.isArray(c.value)
                            ? c.value.join(", ")
                            : c.value != null
                              ? String(c.value)
                              : ""
                        }
                        onChange={(e) =>
                          updateCondition(path, index, {
                            value: e.target.value
                              .split(",")
                              .map((s) => Number(s.trim()))
                              .filter((n) => !isNaN(n)),
                          })
                        }
                        // style={{ flex: "1 1 30%", minWidth: 140 }}
                        disabled={disabled}
                      />
                    )}

                    {fieldType === "number" && isBetween && (
                      <Input
                        placeholder="min, max"
                        value={
                          Array.isArray(c.value)
                            ? c.value.join(", ")
                            : c.value != null
                              ? String(c.value)
                              : ""
                        }
                        onChange={(e) => {
                          const parts = e.target.value
                            .split(",")
                            .map((s) => Number(s.trim()))
                            .filter((n) => !isNaN(n));
                          updateCondition(path, index, {
                            value:
                              parts.length >= 2 ? [parts[0], parts[1]] : parts,
                          });
                        }}
                        // style={{ flex: "1 1 30%", minWidth: 140 }}
                        disabled={disabled}
                      />
                    )}
                    {fieldType === "string" && !isIn && (
                      <Input
                        placeholder={"Enter..."}
                        value={c.value != null ? String(c.value) : ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          updateCondition(path, index, {
                            value: v === "" ? undefined : v,
                          });
                        }}
                        // style={{ flex: "1 1 30%", minWidth: 140 }}
                        disabled={disabled}
                      />
                    )}
                    {fieldType === "string" && isIn && (
                      <Input
                        placeholder="'A','B'"
                        value={
                          Array.isArray(c.value)
                            ? c.value.join(", ")
                            : c.value != null
                              ? String(c.value)
                              : ""
                        }
                        onChange={(e) =>
                          updateCondition(path, index, {
                            value: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        // style={{ flex: "1 1 30%", minWidth: 140 }}
                        disabled={disabled}
                      />
                    )}
                    {fieldType === "boolean" && (
                      <Select
                        placeholder={"Select..."}
                        value={
                          c.value === true || c.value === "true"
                            ? "true"
                            : c.value === false || c.value === "false"
                              ? "false"
                              : undefined
                        }
                        onChange={(v) =>
                          updateCondition(path, index, {
                            value: v === "true",
                          })
                        }
                        style={{ width: "100%" }}
                        disabled={disabled}
                        options={[
                          { label: "true", value: "true" },
                          { label: "false", value: "false" },
                        ]}
                      />
                    )}
                    {/* {fieldType === "datetime" && !isBetween && (
                    <DatePicker
                      showTime
                      value={c.value || undefined}
                      onChange={(date) =>
                        updateCondition(path, index, { value: date || null })
                      }
                      style={{ flex: "1 1 30%", minWidth: 160 }}
                      disabled={disabled}
                    />
                  )} */}
                    {/* {fieldType === "datetime" && isBetween && (
                    <Input
                      placeholder="from, to (ISO date)"
                      value={
                        Array.isArray(c.value)
                          ? c.value.join(", ")
                          : c.value != null
                            ? String(c.value)
                            : ""
                      }
                      onChange={(e) =>
                        updateCondition(path, index, {
                          value: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      style={{ flex: "1 1 40%", minWidth: 180 }}
                      disabled={disabled}
                    />
                  )} */}
                  </>
                )}
              </>
            </Col>
          </Row>
        </div>
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeElement(path, index)}
          size="small"
          style={{ marginTop: 5 }} // canh chỉnh với hàng đầu
          disabled={disabled}
        />
      </div>
    );
  };

  const renderGroup = (
    path: number[],
    group: ConditionGroup,
    isRoot: boolean,
  ) => (
    <div
      key={`group-${path.join("-") || "root"}`}
      style={{
        marginLeft: isRoot ? 0 : 16,
        marginBottom: 12,
        padding: isRoot ? 0 : 12,
        background: isRoot ? "transparent" : "#fafafa",
        border: isRoot ? "none" : "1px solid #f0f0f0",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <Space.Compact>
          <Button
            type={group.operator === "AND" ? "primary" : "default"}
            onClick={() => setGroupOperator(path, "AND")}
            disabled={disabled}
          >
            AND
          </Button>
          <Button
            type={group.operator === "OR" ? "primary" : "default"}
            onClick={() => setGroupOperator(path, "OR")}
            disabled={disabled}
          >
            OR
          </Button>
        </Space.Compact>
        <Dropdown
          menu={{
            items: [
              {
                key: "condition",
                label: "Add condition",
                onClick: () => addElement(path, "condition"),
              },
              ...(canAddGroup(path)
                ? [
                    {
                      key: "group",
                      label: "Add group",
                      onClick: () => addElement(path, "group"),
                    },
                  ]
                : []),
            ],
          }}
          trigger={["click"]}
          disabled={disabled}
        >
          <Button type="default" icon={<PlusOutlined />} />
        </Dropdown>
        {!isRoot && path.length > 0 && (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              removeElement(path.slice(0, -1), path[path.length - 1])
            }
            disabled={disabled}
          />
        )}
      </div>
      <div>
        {group.elements.map((el, idx) => {
          if (isConditionItem(el)) return renderConditionRow(path, idx, el);
          if (isConditionGroup(el))
            return renderGroup([...path, idx], el, false);
          return null;
        })}
      </div>
    </div>
  );

  return (
    <div style={{ width: "100%" }}>
      {previewString && (
        <Input.TextArea
          readOnly
          value={previewString}
          rows={2}
          style={{ background: "#f5f5f5", marginBottom: 16 }}
        />
      )}

      {renderGroup([], rootGroup, true)}
    </div>
  );
};

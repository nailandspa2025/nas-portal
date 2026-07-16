/**
 * Condition Builder: types, operators by field type, and mock event schema fields.
 */

export type FieldDataType = "number" | "string" | "boolean" | "datetime";

export type ConditionItem = {
  field: string;
  operator: string;
  value: any;
};

export type ConditionGroup = {
  operator: "AND" | "OR";
  elements: (ConditionItem | ConditionGroup)[];
};

/** ===== Condition Schema (payload) ===== */
export type ConditionSchemaDataType = "number" | "string" | "boolean";

export type ConditionSchemaItem = {
  fieldPath: string;
  operator: string;
  value: any;
  dataType: ConditionSchemaDataType;
};

export type ConditionSchemaGroup = {
  groupOperator: "AND" | "OR";
  conditions: Array<ConditionSchemaItem | ConditionSchemaGroup>;
};

export function isConditionSchemaGroup(
  el: ConditionSchemaItem | ConditionSchemaGroup,
): el is ConditionSchemaGroup {
  return (
    !!el &&
    typeof el === "object" &&
    "groupOperator" in el &&
    "conditions" in el &&
    Array.isArray((el as any).conditions)
  );
}

export function isConditionSchemaItem(
  el: ConditionSchemaItem | ConditionSchemaGroup,
): el is ConditionSchemaItem {
  return (
    !!el &&
    typeof el === "object" &&
    "fieldPath" in el &&
    "operator" in el &&
    "dataType" in el
  );
}

export function isConditionItem(
  el: ConditionItem | ConditionGroup,
): el is ConditionItem {
  return "field" in el && "operator" in el && !("elements" in el);
}

export function isConditionGroup(
  el: ConditionItem | ConditionGroup,
): el is ConditionGroup {
  return "elements" in el && Array.isArray((el as ConditionGroup).elements);
}

/** Operator key -> label for UI */
export const OPERATOR_LABELS: Record<string, string> = {
  EQ: "=",
  NE: "!=",
  GT: ">",
  LT: "<",
  GTE: ">=",
  LTE: "<=",
  IN: "IN",
  BETWEEN: "BETWEEN",
  CONTAINS: "CONTAINS",
  STARTS_WITH: "STARTS_WITH",
  ENDS_WITH: "ENDS_WITH",
  MATCHES: "MATCHES",
};

/** Operators allowed per field type */
export const OPERATORS_BY_TYPE: Record<
  FieldDataType,
  { value: string; label: string }[]
> = {
  number: [
    { value: "EQ", label: "=" },
    { value: "NE", label: "!=" },
    { value: "GT", label: ">" },
    { value: "LT", label: "<" },
    { value: "GTE", label: ">=" },
    { value: "LTE", label: "<=" },
    { value: "IN", label: "IN" },
    { value: "BETWEEN", label: "BETWEEN" },
  ],
  string: [
    { value: "EQ", label: "=" },
    { value: "NE", label: "!=" },
    { value: "IN", label: "IN" },
    { value: "CONTAINS", label: "CONTAINS" },
    { value: "STARTS_WITH", label: "STARTS_WITH" },
    { value: "ENDS_WITH", label: "ENDS_WITH" },
    { value: "MATCHES", label: "MATCHES" },
  ],
  boolean: [
    { value: "EQ", label: "=" },
    { value: "NE", label: "!=" },
  ],
  datetime: [
    { value: "EQ", label: "=" },
    { value: "NE", label: "!=" },
    { value: "GT", label: ">" },
    { value: "LT", label: "<" },
    { value: "GTE", label: ">=" },
    { value: "LTE", label: "<=" },
    { value: "BETWEEN", label: "BETWEEN" },
  ],
};

export type SchemaField = {
  key: string;
  label: string;
  type: FieldDataType;
  min?: number;
  max?: number;
  /** Prefer operator list from event schema (if provided). */
  operators?: string[];
  options?: { label: string; value: any }[];
};

/**
 * Mock schema fields for event payload (spec: "lấy từ schema/payload đã định nghĩa cho event").
 * Can be replaced by getEventSchema(eventId) when backend provides it.
 */
export const CONDITION_BUILDER_SCHEMA_FIELDS: SchemaField[] = [
  { key: "isFirstLinkBank", label: "First link bank", type: "boolean" },
  { key: "bankCode", label: "Bank code", type: "string" },
  { key: "merchantCode", label: "Merchant code", type: "string" },
  { key: "amount", label: "Amount", type: "number", min: 0 },
  { key: "billCount", label: "Bill count", type: "number", min: 0 },
  { key: "billType", label: "Bill type", type: "string" },
  { key: "phoneNumber", label: "Phone number", type: "string" },
  { key: "txnTime", label: "Transaction time", type: "datetime" },
];

export const MAX_GROUP_DEPTH = 5;

export const DEFAULT_ROOT_GROUP: ConditionGroup = {
  operator: "AND",
  elements: [],
};

/**
 * Serialize ConditionGroup to expression string for preview and API.
 * Format: groups in (...), strings in single quotes, IN ('A','B'), BETWEEN a AND b.
 */

import type {
  ConditionGroup,
  ConditionItem,
  ConditionSchemaGroup,
  ConditionSchemaItem,
  SchemaField,
} from "./conditionBuilderTypes";
import {
  isConditionGroup,
  isConditionItem,
  isConditionSchemaGroup,
  isConditionSchemaItem,
} from "./conditionBuilderTypes";

// function getFieldType(fieldKey: string, schemaFields: SchemaField[]): string {
//   const f = schemaFields.find((s) => s.key === fieldKey);
//   return f?.type ?? "string";
// }

function formatValue(
  value: any,
  operator: string,
  fieldType: string,
  fieldDef?: SchemaField,
  forPreview?: boolean,
): string {
  if (value === undefined || value === null) return "";

  //   const hasOptions =
  //     Array.isArray(fieldDef?.options) && fieldDef.options.length > 0;
  const hasOptions = !!fieldDef?.options?.length;
  if (operator === "IN") {
    const arr = Array.isArray(value)
      ? value
      : typeof value === "string"
        ? value.split(",").map((s: string) => s.trim())
        : [value];
    const formatted = arr.map((v: any) => {
      if (forPreview && hasOptions) {
        const opt = fieldDef?.options?.find((o) => o.value === v);
        if (opt) return `'${opt.label}'`;
      }
      if (fieldType === "string") return `'${String(v).replace(/'/g, "''")}'`;
      if (fieldType === "number") return Number(v);
      if (fieldType === "boolean")
        return v === true || v === "true" ? "true" : "false";
      return `'${String(v)}'`;
    });
    return `(${formatted.join(",")})`;
  }

  if (operator === "BETWEEN") {
    const [a, b] = Array.isArray(value) ? value : [value, value];
    const fmt = (v: any) => {
      if (forPreview && hasOptions) {
        const opt = fieldDef?.options?.find((o) => o.value === v);
        if (opt) return `'${opt.label}'`;
      }
      if (fieldType === "datetime")
        return `'${typeof v === "string" ? v : (v?.toISOString?.() ?? String(v))}'`;
      if (fieldType === "string") return `'${String(v).replace(/'/g, "''")}'`;
      if (fieldType === "number") return Number(v);
      return String(v);
    };
    return `${fmt(a)} AND ${fmt(b)}`;
  }

  if (forPreview && hasOptions) {
    const opt = fieldDef?.options?.find((o) => o.value === value);
    if (opt) return `'${opt.label}'`;
  }

  if (fieldType === "string") return `'${String(value).replace(/'/g, "''")}'`;
  if (fieldType === "boolean")
    return value === true || value === "true" ? "true" : "false";
  if (fieldType === "datetime")
    return `'${typeof value === "string" ? value : (value?.toISOString?.() ?? String(value))}'`;
  if (fieldType === "number") return String(Number(value));
  return `'${String(value)}'`;
}

function serializeCondition(
  c: ConditionItem,
  schemaFields: SchemaField[],
  forPreview?: boolean,
): string {
  const fieldDef = schemaFields.find((s) => s.key === c.field);
  const fieldType = fieldDef?.type ?? "string";
  const op = c.operator;
  const valStr = formatValue(c.value, op, fieldType, fieldDef, forPreview);
  if (!valStr && op !== "IN" && op !== "BETWEEN") return "";

  if (op === "BETWEEN") {
    const parts = valStr.split(" AND ");
    if (parts.length !== 2) return "";
    return `${c.field} BETWEEN ${parts[0]} AND ${parts[1]}`;
  }
  if (op === "IN") return `${c.field} IN ${valStr}`;
  const symbolMap: Record<string, string> = {
    EQ: "=",
    NE: "!=",
    GT: ">",
    LT: "<",
    GTE: ">=",
    LTE: "<=",
    CONTAINS: "CONTAINS",
    STARTS_WITH: "STARTS_WITH",
    ENDS_WITH: "ENDS_WITH",
    MATCHES: "MATCHES",
  };
  const opSymbol = symbolMap[op] ?? op;
  return `${c.field} ${opSymbol} ${valStr}`;
}

export function serializeConditionGroup(
  group: ConditionGroup,
  schemaFields: SchemaField[],
  forPreview?: boolean,
): string {
  const parts: string[] = [];
  for (const el of group.elements) {
    if (isConditionItem(el)) {
      const s = serializeCondition(el, schemaFields, forPreview);
      if (s) parts.push(s);
    } else if (isConditionGroup(el)) {
      const inner = serializeConditionGroup(el, schemaFields, forPreview);
      if (inner) parts.push(`(${inner})`);
    }
  }
  const join = group.operator === "OR" ? " OR " : " AND ";
  return parts.join(join);
}

/** Validation result for a single condition or group */
export type ValidationError = {
  type:
    | "missing_field"
    | "missing_operator"
    | "missing_value"
    | "invalid_value_type"
    | "empty_group"
    | "max_depth"
    | "invalid_regex";
  path?: string;
  message?: string;
};

export function validateConditionGroup(
  group: ConditionGroup,
  schemaFields: SchemaField[],
  depth: number,
  maxDepth: number,
  errors: ValidationError[],
): void {
  if (depth > maxDepth) {
    errors.push({ type: "max_depth", message: "Max group depth exceeded" });
    return;
  }
  if (group.elements.length === 0) {
    errors.push({ type: "empty_group", message: "Group cannot be empty" });
    return;
  }
  for (const el of group.elements) {
    if (isConditionItem(el)) {
      if (!el.field?.trim()) errors.push({ type: "missing_field" });
      else if (!el.operator) errors.push({ type: "missing_operator" });
      else if (
        el.value === undefined ||
        el.value === null ||
        (typeof el.value === "string" && !el.value.trim()) ||
        (Array.isArray(el.value) && el.value.length === 0)
      ) {
        if (
          el.operator !== "IN" ||
          (Array.isArray(el.value) && el.value.length === 0)
        )
          errors.push({ type: "missing_value" });
      }
      // Optional: value type check per field type
      const fieldDef = schemaFields.find((f) => f.key === el.field);
      if (
        fieldDef &&
        el.value !== undefined &&
        el.value !== null &&
        el.operator !== "IN" &&
        el.operator !== "BETWEEN"
      ) {
        if (
          fieldDef.type === "number" &&
          typeof el.value !== "number" &&
          (typeof el.value !== "string" || isNaN(Number(el.value)))
        )
          errors.push({
            type: "invalid_value_type",
            message: "Value must be a number",
          });
        if (
          fieldDef.type === "boolean" &&
          el.value !== true &&
          el.value !== false &&
          el.value !== "true" &&
          el.value !== "false"
        )
          errors.push({
            type: "invalid_value_type",
            message: "Value must be true or false",
          });
      }
      if (el.operator === "MATCHES" && typeof el.value === "string") {
        try {
          new RegExp(el.value);
        } catch {
          errors.push({
            type: "invalid_regex",
            message: "Invalid regex syntax",
          });
        }
      }
    } else if (isConditionGroup(el)) {
      validateConditionGroup(el, schemaFields, depth + 1, maxDepth, errors);
    }
  }
}

export function hasAtLeastOneValidCondition(group: ConditionGroup): boolean {
  for (const el of group.elements) {
    if (
      isConditionItem(el) &&
      el.field?.trim() &&
      el.operator &&
      el.value !== undefined &&
      el.value !== null &&
      (typeof el.value !== "string" || el.value.trim())
    )
      return true;
    if (isConditionGroup(el) && hasAtLeastOneValidCondition(el)) return true;
  }
  return false;
}

/**
 * Basic deserializer for condition strings.
 * Note: This is a simplified version and might need refinement for very complex nested groups.
 */
// export function deserializeConditionGroup(
//   expression: string,
//   //schemaFields: SchemaField[],
// ): ConditionGroup {
//   if (!expression?.trim()) return { operator: "AND", elements: [] };

//   const root: ConditionGroup = { operator: "AND", elements: [] };

//   // Helper to parse a single level
//   const parseLevel = (str: string): (ConditionItem | ConditionGroup)[] => {
//     const elements: (ConditionItem | ConditionGroup)[] = [];
//     let current = str.trim();

//     // Check for OR at this level (AND is default)
//     // This is a naive check, really we should split by Top-Level OR/AND
//     // Simplified: we assume the whole string for a group uses one operator as per ConditionBuilder design

//     // Split by top-level OR or AND
//     const items: { content: string; isGroup: boolean }[] = [];
//     let depth = 0;
//     let start = 0;
//     for (let i = 0; i < current.length; i++) {
//       if (current[i] === "(") depth++;
//       if (current[i] === ")") depth--;
//       if (depth === 0) {
//         // Look for AND/OR outside parens
//         const slice = current.substring(i);
//         if (slice.startsWith(" OR ") || slice.startsWith(" AND ")) {
//           const content = current.substring(start, i).trim();
//           items.push({
//             content,
//             isGroup: content.startsWith("(") && content.endsWith(")"),
//           });
//           i += slice.startsWith(" OR ") ? 3 : 4;
//           start = i + 1;
//         }
//       }
//     }
//     const lastContent = current.substring(start).trim();
//     if (lastContent) {
//       items.push({
//         content: lastContent,
//         isGroup: lastContent.startsWith("(") && lastContent.endsWith(")"),
//       });
//     }

//     // Determine operator (simplified: check if ' OR ' exists at top level)
//     // Actually, we should check what joined the items
//     // For simplicity, if we find ' OR ', we assume OR.
//     // const hasOr = current.includes(' OR '); // This is risky but let's stick to simple patterns first

//     for (const item of items) {
//       if (item.isGroup) {
//         const innerStr = item.content.substring(1, item.content.length - 1);
//         elements.push({
//           operator: innerStr.includes(" OR ") ? "OR" : "AND",
//           elements: parseLevel(innerStr),
//         });
//       } else {
//         // Parse ConditionItem: field OP value
//         // Regex to match: field OPTIONAL_SYMBOL value
//         // Note: value can be 'str', 123, (1,2), true, '2024...' AND '2025...'
//         const match = item.content.match(
//           /^(\w+)\s+([!=<>]{1,2}|IN|BETWEEN|CONTAINS|STARTS_WITH|ENDS_WITH|MATCHES)\s+(.*)$/,
//         );
//         if (match) {
//           const [, field, op, valStr] = match;
//           // const fieldDef = schemaFields.find((f) => f.key === field);
//           // const type = fieldDef?.type || 'string';

//           let value: any = valStr;
//           if (op === "IN") {
//             const innerVal = valStr
//               .trim()
//               .substring(1, valStr.trim().length - 1);
//             value = innerVal.split(",").map((v) => {
//               const s = v.trim();
//               if (s.startsWith("'") && s.endsWith("'"))
//                 return s.substring(1, s.length - 1).replace(/''/g, "'");
//               if (s === "true" || s === "false") return s === "true";
//               return isNaN(Number(s)) ? s : Number(s);
//             });
//           } else if (op === "BETWEEN") {
//             const parts = valStr.split(" AND ");
//             value = parts.map((v) => {
//               const s = v.trim();
//               if (s.startsWith("'") && s.endsWith("'"))
//                 return s.substring(1, s.length - 1).replace(/''/g, "'");
//               return isNaN(Number(s)) ? s : Number(s);
//             });
//           } else {
//             const s = valStr.trim();
//             if (s.startsWith("'") && s.endsWith("'"))
//               value = s.substring(1, s.length - 1).replace(/''/g, "'");
//             else if (s === "true" || s === "false") value = s === "true";
//             else value = isNaN(Number(s)) ? s : Number(s);
//           }

//           elements.push({ field, operator: op, value });
//         }
//       }
//     }
//     return elements;
//   };

//   root.elements = parseLevel(expression);
//   root.operator = expression.includes(" OR ") ? "OR" : "AND";

//   return root;
// }
export function deserializeConditionGroup(expression: string): ConditionGroup {
  if (!expression?.trim()) {
    return {
      operator: "AND",
      elements: [],
    };
  }

  function removeOuterParentheses(str: string): string {
    str = str.trim();

    while (str.startsWith("(") && str.endsWith(")")) {
      let depth = 0;
      let valid = true;

      for (let i = 0; i < str.length; i++) {
        if (str[i] === "(") depth++;
        else if (str[i] === ")") depth--;

        if (depth === 0 && i < str.length - 1) {
          valid = false;
          break;
        }
      }

      if (!valid) break;

      str = str.substring(1, str.length - 1).trim();
    }

    return str;
  }

  function splitTopLevel(str: string): {
    operator: "AND" | "OR";
    parts: string[];
  } {
    const parts: string[] = [];
    let depth = 0;
    let start = 0;
    let operator: "AND" | "OR" = "AND";

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];

      if (ch === "(") depth++;
      else if (ch === ")") depth--;

      if (depth !== 0) continue;

      if (str.substring(i).startsWith(" AND ")) {
        operator = "AND";
        parts.push(str.substring(start, i).trim());
        start = i + 5;
        i += 4;
      } else if (str.substring(i).startsWith(" OR ")) {
        operator = "OR";
        parts.push(str.substring(start, i).trim());
        start = i + 4;
        i += 3;
      }
    }

    parts.push(str.substring(start).trim());

    return { operator, parts };
  }

  function parseValue(value: string) {
    const s = value.trim();

    if (s.startsWith("'") && s.endsWith("'")) {
      return s.substring(1, s.length - 1).replace(/''/g, "'");
    }

    if (s === "true") return true;
    if (s === "false") return false;

    const n = Number(s);
    if (!Number.isNaN(n)) return n;

    return s;
  }

  function parseCondition(text: string): ConditionItem {
    const match = text.match(
      /^(\w+)\s*(=|!=|>=|<=|>|<|IN|BETWEEN|CONTAINS|STARTS_WITH|ENDS_WITH|MATCHES)\s*(.+)$/i,
    );

    if (!match) {
      throw new Error(`Invalid condition: ${text}`);
    }

    const [, field, operator, valueText] = match;

    let value: any;

    if (operator.toUpperCase() === "IN") {
      value = valueText
        .trim()
        .replace(/^\(/, "")
        .replace(/\)$/, "")
        .split(",")
        .map((x) => parseValue(x));
    } else if (operator.toUpperCase() === "BETWEEN") {
      value = valueText.split(/\s+AND\s+/i).map((x) => parseValue(x));
    } else {
      value = parseValue(valueText);
    }

    return {
      field,
      operator,
      value,
    };
  }

  function parseGroup(str: string): ConditionGroup {
    str = removeOuterParentheses(str);

    const { operator, parts } = splitTopLevel(str);

    return {
      operator,
      elements: parts.map((part) => {
        const item = removeOuterParentheses(part);

        // nếu còn AND/OR ở top level thì là group
        let depth = 0;
        let isGroup = false;

        for (let i = 0; i < item.length; i++) {
          if (item[i] === "(") depth++;
          else if (item[i] === ")") depth--;

          if (
            depth === 0 &&
            (item.substring(i).startsWith(" AND ") ||
              item.substring(i).startsWith(" OR "))
          ) {
            isGroup = true;
            break;
          }
        }

        return isGroup ? parseGroup(item) : parseCondition(item);
      }),
    };
  }

  return parseGroup(expression);
}
export function transformConditionGroupToSchema(
  group: ConditionGroup,
): ConditionSchemaGroup {
  const mapItem = (el: ConditionItem): ConditionSchemaItem => ({
    fieldPath: el.field,
    operator: el.operator,
    value: el.value,
    dataType:
      typeof el.value === "number"
        ? "number"
        : typeof el.value === "boolean"
          ? "boolean"
          : "string",
  });

  const mapGroup = (g: ConditionGroup): ConditionSchemaGroup => ({
    groupOperator: g.operator,
    conditions: g.elements
      .map((el) => {
        if (isConditionItem(el)) return mapItem(el);
        if (isConditionGroup(el)) return mapGroup(el);
        return null;
      })
      .filter(Boolean) as Array<ConditionSchemaItem | ConditionSchemaGroup>,
  });

  return mapGroup(group);
}

export function transformSchemaToConditionGroup(schema: any): ConditionGroup {
  // Backward compat: allow passing a ConditionGroup directly
  if (
    schema &&
    typeof schema === "object" &&
    "operator" in schema &&
    "elements" in schema
  ) {
    return schema as ConditionGroup;
  }

  const fallback: ConditionGroup = { operator: "AND", elements: [] };
  if (!schema || typeof schema !== "object") return fallback;

  const mapItem = (it: ConditionSchemaItem): ConditionItem => ({
    field: it.fieldPath,
    operator: it.operator,
    value: it.value,
  });

  const mapGroup = (g: ConditionSchemaGroup): ConditionGroup => ({
    operator: g.groupOperator,
    elements: (g.conditions || [])
      .map((c: any) => {
        if (isConditionSchemaItem(c)) return mapItem(c);
        if (isConditionSchemaGroup(c)) return mapGroup(c);
        return null;
      })
      .filter(Boolean) as any[],
  });

  if (isConditionSchemaGroup(schema)) return mapGroup(schema);
  return fallback;
}

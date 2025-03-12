/* eslint-disable @typescript-eslint/no-explicit-any */
export const buildFormData = (
  formData: FormData,
  data: any,
  parentKey?: string
) => {
  if (
    data &&
    typeof data === "object" &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    if (data.format) {
      formData.append(parentKey!, data.format("YYYY-MM-DD"));
    } else {
      Object.keys(data).forEach((key) => {
        buildFormData(
          formData,
          data[key],
          parentKey ? `${parentKey}[${key}]` : key
        );
      });
    }
  } else {
    let value: string | Blob = "";
    if (data instanceof Date) {
      value = data.toISOString();
    } else if (data instanceof File) {
      value = data;
    } else {
      value = data == null ? "" : data;
    }
    if (parentKey) {
      formData.append(parentKey, value);
    }
  }
};

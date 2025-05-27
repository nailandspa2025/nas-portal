/* eslint-disable @typescript-eslint/no-explicit-any */
export const buildFormData = (
  formData: FormData,
  data: any,
  parentKey?: string
) => {
  if (data instanceof FileList) {
    Array.from(data).forEach((file) => {
      formData.append(parentKey!, file);
    });
  } else if (
    data &&
    typeof data === "object" &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    if (data.format) {
      let formattedValue = "";
      if (parentKey?.includes("Date")) {
        formattedValue = data.format("YYYY-MM-DD");
      } else if (parentKey?.includes("Time")) {
        formattedValue = data.format("HH:mm");
      } else {
        formattedValue = data.toISOString();
      }
      formData.append(parentKey!, formattedValue);
    } else {
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value === null || value === undefined) return;

        const newKey = Array.isArray(data)
          ? parentKey
          : parentKey
          ? `${parentKey}.${key}`
          : key;

        buildFormData(formData, value, newKey);
      });
    }
  } else {
    if (data === null || data === undefined) return;
    let value: string | Blob = "";
    if (data instanceof Date) {
      value = data.toISOString();
    } else if (data instanceof File) {
      value = data;
    } else {
      value = data;
    }
    if (parentKey) {
      formData.append(parentKey, value);
    }
  }
};

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
    // Xử lý object có phương thức format (ví dụ: dayjs/moment)
    if (typeof data.format === "function") {
      let formattedValue = "";
      if (parentKey?.includes("Date")) {
        formattedValue = data.format("YYYY-MM-DD");
      } else if (parentKey?.includes("Time")) {
        formattedValue = data.format("HH:mm");
      } else {
        formattedValue = data.toISOString?.() || data.format();
      }
      formData.append(parentKey!, formattedValue);
    } else if (Array.isArray(data)) {
      // Xử lý mảng
      if (data.length > 0 && data[0] instanceof File) {
        // Mảng các File
        data.forEach((file) => {
          formData.append(parentKey!, file);
        });
      } else {
        // Mảng thường
        data.forEach((item, index) => {
          const newKey = `${parentKey}[${index}]`;
          buildFormData(formData, item, newKey);
        });
      }
    } else {
      // Xử lý object thường
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value === null || value === undefined) return;
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        buildFormData(formData, value, newKey);
      });
    }
  } else {
    // Xử lý các kiểu dữ liệu đơn giản
    if (data === null || data === undefined) return;
    let value: string | Blob;
    if (data instanceof Date) {
      value = data.toISOString();
    } else if (data instanceof File) {
      value = data;
    } else {
      value = String(data);
    }
    if (parentKey) {
      formData.append(parentKey, value);
    }
  }
};

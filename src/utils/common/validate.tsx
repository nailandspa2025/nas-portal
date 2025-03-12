/* eslint-disable @typescript-eslint/no-explicit-any */
const validatePhoneNumber = (rule: any, value: any) => {
  const phoneRegex = /^[0-9]{10}$/;
  if (value) {
    if (!value.startsWith("0")) {
      return Promise.reject("Số điện thoại phải bắt đầu bằng số 0");
    }
    if (!phoneRegex.test(value)) {
      return Promise.reject("Số điện thoại không hợp lệ");
    }
  } else {
    return Promise.reject("");
  }
  return Promise.resolve();
};

const validateLongitude = (rule: any, value: any) => {
  const longitudeRegex =
    /^-?((\d|[1-9]\d|1[0-7]\d)(\.\d{1,8})?|180(\.0{1,8})?)$/;
  if (value) {
    if (!longitudeRegex.test(value)) {
      return Promise.reject(
        "Kinh độ không hợp lệ. Vui lòng nhập giá trị hợp lệ trong khoảng -180 đến 180."
      );
    }
  } else {
    return Promise.reject("");
  }
  return Promise.resolve();
};

const validateLatitude = (rule: any, value: any) => {
  const latitudeRegex = /^-?((\d|[1-8]\d)(\.\d{1,8})?|90(\.0{1,8})?)$/;
  if (value) {
    if (!latitudeRegex.test(value)) {
      return Promise.reject(
        "Vĩ độ không hợp lệ. Vui lòng nhập giá trị hợp lệ trong khoảng -90 đến 90."
      );
    }
  } else {
    return Promise.reject("");
  }
  return Promise.resolve();
};
export { validatePhoneNumber, validateLongitude, validateLatitude };

/* eslint-disable @typescript-eslint/no-explicit-any */
const validatePhoneNumber = (value: any) => {
  const phoneRegex = /^[0-9]{10}$/;
  if (value) {
    if (!value.startsWith("0")) {
      return Promise.reject("Phone number must start with a 0");
    }
    if (!phoneRegex.test(value)) {
      return Promise.reject("Invalid phone number");
    }
  } else {
    return Promise.reject("");
  }
  return Promise.resolve();
};

const validateLongitude = (value: any) => {
  const longitudeRegex =
    /^-?((\d|[1-9]\d|1[0-7]\d)(\.\d{1,14})?|180(\.0{1,14})?)$/;
  if (value) {
    if (!longitudeRegex.test(value)) {
      return Promise.reject(
        "Invalid longitude. Please enter a valid value between -180 and 180."
      );
    }
  } else {
    return Promise.reject("");
  }
  return Promise.resolve();
};

const validateLatitude = (value: any) => {
  const latitudeRegex = /^-?((\d|[1-8]\d)(\.\d{1,15})?|90(\.0{1,15})?)$/;
  if (value) {
    if (!latitudeRegex.test(value)) {
      return Promise.reject(
        "Invalid latitude. Please enter a valid value between -90 and 90."
      );
    }
  } else {
    return Promise.reject("");
  }
  return Promise.resolve();
};
export { validatePhoneNumber, validateLongitude, validateLatitude };

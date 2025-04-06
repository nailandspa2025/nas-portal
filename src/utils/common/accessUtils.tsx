import { intersection } from "lodash-es";

export const checkAccessRight = (
  accesses: string[] | undefined,
  right: string,
  prefix: string = "user"
): boolean => {
  const values = [`${prefix}.admin`, `${prefix}.${right}`, `admin`];
  return intersection(accesses || [], values).length > 0;
};

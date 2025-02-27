export type TypeFilter = {
  key?: string;
  name: string;
  field: string | string[];
  type: string;
  popup: boolean;
  isActive: boolean;
  actionName?: string;
  remoteServer?: boolean;
  value?: string;
  selected?: object;
};

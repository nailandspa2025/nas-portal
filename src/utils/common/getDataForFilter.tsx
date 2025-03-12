export const getDataForFilter = async (actionName: string) => {
  switch (actionName) {
    case "userType":
      return [
        {
          value: 0,
          label: "User",
        },
        {
          value: 1,
          label: "Admin",
        },
      ];
    default:
      return [];
  }
};

export const getDataForFilter = async (actionName: string) => {
  switch (actionName) {
    case "userType":
      return [
        {
          value: 2,
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

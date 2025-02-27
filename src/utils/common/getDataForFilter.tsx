export const getDataForFilter = async (actionName: string) => {
  switch (actionName) {
    case "articleType":
      return [
        { value: "approve", label: "Đã duyệt" },
        { value: "decline", label: "Từ chối" },
        { value: "pending", label: "Đang chờ" },
      ];

    case "username":
      return [
        {
          value: "canhlv",
          label: "Lâm Văn Cảnh",
        },
        {
          value: "vilhp",
          label: "Lâm Huỳnh Phượng Vi",
        },
        {
          value: "linhlv",
          label: "Lê Vi Linh",
        },
      ];

    case "assignmentStatuses":
      return [
        {
          value: "true",
          label: "Đã phân bổ",
        },
        {
          value: "false",
          label: "Chưa phân bổ",
        },
      ];

    default:
      return [];
  }
};

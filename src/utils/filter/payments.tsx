/* eslint-disable @typescript-eslint/no-explicit-any */

import dayjs from "dayjs";
export const filters = [
  {
    name: "Enter name, email, phone ...",
    field: "searchText",
    type: "text",
    popup: false,
    isActive: true,
  },
];

export const columns = ({ t }: { t: any }) => {
  return [
    {
      title: "BookingId",
      dataIndex: "bookingId",
      key: "bookingId",
      width: 80,
    },
    {
      title: t("Full name"),
      dataIndex: "fullName",
      key: "fullName",
      width: 180,
    },
    {
      title: t("Amount"),
      dataIndex: "amount",
      key: "amount",
      width: 180,
      render: (amount: number) => <span>{amount.toLocaleString()}</span>,
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
    },
    {
      title: t("Phone"),
      dataIndex: "phone",
      key: "phone",
      width: 140,
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: 100,
      hidden: false,
      render: (status: number) => {
        const statusMap: Record<number, { color: string; text: string }> = {
          1: { color: "orange", text: t("Pending") },
          2: { color: "green", text: t("Success") },
          3: { color: "red", text: t("Failed") },
          4: { color: "red", text: t("Cancelled") },
          5: { color: "gray", text: t("Expired") },
          6: { color: "blue", text: t("Paid") },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap] || {
          color: "gray",
          text: t("Unknown"),
        };
        return <span style={{ color, fontWeight: "bold" }}>{text}</span>;
      },
    },
    {
      title: t("Payment date"),
      dataIndex: "paidAt",
      key: "paidAt",
      width: 100,
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
  ];
};

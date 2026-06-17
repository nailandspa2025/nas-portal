/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import dayjs from "dayjs";
export const columns = ({ t }: { t: any }) => {
  return [
    {
      title: t("BookingId"),
      dataIndex: "bookingId",
      key: "bookingId",
      width: 180,
      render: (text: string, record: { id: string }) => (
        <Link to={`/booking/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Technician",
      dataIndex: "technicianName",
      key: "technicianName",
      width: 220,
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
      width: 220,
    },
    {
      title: t("Commission"),
      dataIndex: "commissionAmount",
      key: "commissionAmount",
      width: 140,
      render: (price: number) => <span>{price?.toLocaleString()}</span>,
    },

    {
      title: t("Booking Date"),
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: 120,
      render: (created: string) => dayjs(created).format("DD/MM/YYYY"),
    },
  ];
};

export const filters = [
  {
    key: "technician",
    name: "Technician",
    field: "technicianId",
    type: "select",
    popup: true,
    isActive: false,
    actionName: "technician",
  },
  {
    key: "service",
    name: "Service",
    field: "serviceId",
    type: "select",
    popup: true,
    isActive: false,
    actionName: "service",
  },
  {
    key: "store",
    name: "Store",
    field: "storeId",
    type: "select",
    popup: true,
    isActive: false,
    actionName: "store",
  },
  {
    key: "dateRange",
    name: "Date Range",
    field: "dateRange",
    type: "dateRange",
    popup: true,
    isActive: false,
  },
];

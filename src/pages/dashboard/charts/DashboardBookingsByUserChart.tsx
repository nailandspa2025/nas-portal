import { useMemo, useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import CommonChart from "../../../components/apexchart/CommonChart";
import type { DashboardBookingsByUserChartProps } from "../dashboardChart.types";
import {
  type BookingByUserItem,
  ReportApi,
} from "../../../apis/report/report";

const DashboardBookingsByUserChart: FC<DashboardBookingsByUserChartProps> = ({
  seriesName,
  title,
  height = 300,
  cardProps,
}) => {
  const { t } = useTranslation();
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>(() => {
    const end = dayjs();
    return [end.subtract(6, "day").startOf("day"), end.startOf("day")];
  });
  const fromDate = dateRange[0].format("YYYY-MM-DD");
  const endDate = dateRange[1].format("YYYY-MM-DD");

  const { data: bookingByUserResponse } = useQuery({
    queryKey: ["dashboardBookingByUser", fromDate, endDate],
    queryFn: () => ReportApi.bookingByUser({ fromDate, endDate }),
    select: (response) => response.data.items ?? [],
  });

  const rows = useMemo(
    () => (Array.isArray(bookingByUserResponse) ? bookingByUserResponse : []),
    [bookingByUserResponse],
  );

  const categories = useMemo(
    () =>
      (rows as BookingByUserItem[]).map((row, index) =>
        row.label ? String(row.label) : `User ${index + 1}`,
      ),
    [rows],
  );
  const data = useMemo(
    () => (rows as BookingByUserItem[]).map((row) => row.value ?? 0),
    [rows],
  );

  const series = useMemo(
    () => [{ name: seriesName ?? t("Bookings"), data }],
    [data, seriesName, t],
  );

  const options = useMemo(
    () => ({
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          columnWidth: "55%",
        },
      },
      legend: { show: false },
    }),
    [],
  );

  const extra = (
    <RangePicker
      size="small"
      style={{ width: "100%", maxWidth: 280 }}
      format="DD/MM/YYYY"
      allowClear={false}
      value={dateRange}
      placeholder={[t("From date"), t("To date")]}
      disabledDate={(current) =>
        current != null && current > dayjs().endOf("day")
      }
      onChange={(dates) => {
        if (dates?.[0] && dates[1]) {
          setDateRange([dates[0], dates[1]]);
        }
      }}
    />
  );

  return (
    <CommonChart
      title={title ?? t("Bookings by user")}
      extra={extra}
      chartType="bar"
      categories={categories}
      series={series}
      height={height}
      options={options}
      cardProps={cardProps}
    />
  );
};

export default DashboardBookingsByUserChart;

import { useMemo, useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import CommonChart from "../../../components/apexchart/CommonChart";
import type { DashboardBookingStatusChartProps } from "../dashboardChart.types";
import {
  type BookingByStatusItem,
  ReportApi,
} from "../../../apis/report/report";

const BOOKING_STATUS_DONUT_COLORS = ["#faad14", "#33b79b", "#f54266"];

const DashboardBookingStatusChart: FC<DashboardBookingStatusChartProps> = ({
  title,
  height = 340,
  cardProps,
}) => {
  const { t } = useTranslation();
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>(() => {
    const end = dayjs();
    return [end.subtract(1, "month").startOf("day"), end.startOf("day")];
  });
  const fromDate = dateRange[0].format("YYYY-MM-DD");
  const endDate = dateRange[1].format("YYYY-MM-DD");

  const { data: bookingByStatusResponse } = useQuery({
    queryKey: ["dashboardBookingByStatus", fromDate, endDate],
    queryFn: () => ReportApi.bookingByStatus({ fromDate, endDate }),
    select: (response) => response.data.items ?? [],
  });

  const rows = useMemo(() => {
    if (Array.isArray(bookingByStatusResponse)) return bookingByStatusResponse;
    return [];
  }, [bookingByStatusResponse]);

  const labels = useMemo(() => {
    return [t("Pending"), t("Completed"), t("Cancelled")];
  }, [t]);

  const statusCounts = useMemo(() => {
    let pending = 0;
    let completed = 0;
    let cancelled = 0;
    (rows as BookingByStatusItem[]).forEach((row) => {
      const label = (row.label ?? "").toLowerCase();
      const count = row.value ?? 0;
      if (label === "pending") pending = count;
      if (label === "completed") completed = count;
      if (label === "cancelled" || label === "canceled") cancelled = count;
    });
    return [pending, completed, cancelled];
  }, [rows]);

  const total = useMemo(
    () => statusCounts.reduce((a, b) => a + b, 0),
    [statusCounts],
  );

  const sliceCount = (opts?: { seriesIndex?: number }) => {
    const idx = opts?.seriesIndex ?? 0;
    return statusCounts[idx] ?? 0;
  };

  const options = useMemo(
    () => ({
      colors: BOOKING_STATUS_DONUT_COLORS,
      dataLabels: {
        formatter: (
          _val: string | number | number[],
          opts?: {
            seriesIndex?: number;
            w?: { globals?: { series?: number[] } };
          },
        ) => String(sliceCount(opts)),
      },
      tooltip: {
        y: {
          formatter: (val: number) => String(val ?? 0),
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: t("Total"),
                formatter: () => String(total),
              },
            },
          },
        },
      },
    }),
    [statusCounts, t, total],
  );

  const series = useMemo(() => [...statusCounts], [statusCounts]);
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
      title={title ?? t("Booking status")}
      extra={extra}
      chartType="donut"
      labels={labels}
      series={series}
      height={height}
      options={options}
      cardProps={cardProps}
    />
  );
};

export default DashboardBookingStatusChart;

import { useMemo, useState, type FC } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "antd";
import type { ApexOptions } from "apexcharts";
import { useTranslation } from "react-i18next";
import CommonChart from "../../../components/apexchart/CommonChart";
import type { DashboardRevenueChartProps } from "../dashboardChart.types";
import { ReportApi, type RevenueByTimeItem } from "../../../apis/report/report";
import { formatUsd } from "../../../utils/formatMoneyUsd";

const DashboardRevenueChart: FC<DashboardRevenueChartProps> = ({
  title,
  height = 340,
  options,
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
  const { data: revenueByTimeResponse } = useQuery({
    queryKey: ["dashboardRevenueByTime", fromDate, endDate],
    queryFn: () => ReportApi.revenueByTime({ GroupBy: 1, fromDate, endDate }),
    select: (response) => response.data.items ?? [],
  });

  const rows = useMemo(() => {
    if (Array.isArray(revenueByTimeResponse)) return revenueByTimeResponse;
    return [];
  }, [revenueByTimeResponse]);

  const categories = useMemo(
    () =>
      (rows as RevenueByTimeItem[]).map((row) => {
        const rawLabel = row.label || row.date;
        if (!rawLabel) return "";
        const parsed = dayjs(rawLabel);
        return parsed.isValid() ? parsed.format("DD/MM") : String(rawLabel);
      }),
    [rows],
  );

  const series = useMemo(
    () => [
      {
        name: t("Revenue by time"),
        data: (rows as RevenueByTimeItem[]).map((row) => row.revenue ?? 0),
      },
    ],
    [rows, t],
  );

  const mergedOptions = useMemo<ApexOptions>(() => {
    const yaxisSingle = Array.isArray(options?.yaxis)
      ? undefined
      : options?.yaxis;
    return {
      ...options,
      plotOptions: {
        ...options?.plotOptions,
        bar: {
          ...options?.plotOptions?.bar,
          horizontal: false,
          borderRadius: 4,
          columnWidth: "55%",
        },
      },
      yaxis: {
        ...yaxisSingle,
        labels: {
          ...yaxisSingle?.labels,
          formatter: (val) => formatUsd(val),
        },
      },
      tooltip: {
        ...options?.tooltip,
        y: {
          ...options?.tooltip?.y,
          formatter: (val) => formatUsd(val),
        },
      },
    };
  }, [options]);

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
      title={title ?? t("Revenue by time")}
      extra={extra}
      chartType="bar"
      categories={categories}
      series={series}
      height={height}
      options={mergedOptions}
      cardProps={cardProps}
    />
  );
};

export default DashboardRevenueChart;

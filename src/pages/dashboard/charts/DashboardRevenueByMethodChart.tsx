import { useMemo, useState, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { DatePicker } from "antd";
import type { ApexOptions } from "apexcharts";
import dayjs, { type Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import CommonChart from "../../../components/apexchart/CommonChart";
import type { DashboardRevenueByMethodChartProps } from "../dashboardChart.types";
import {
  type RevenueByMethodItem,
  ReportApi,
} from "../../../apis/report/report";
import { formatUsd } from "../../../utils/formatMoneyUsd";

const DashboardRevenueByMethodChart: FC<DashboardRevenueByMethodChartProps> = ({
  title,
  height = 340,
}) => {
  const { t } = useTranslation();
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>(() => {
    const end = dayjs();
    return [end.subtract(1, "month").startOf("day"), end.startOf("day")];
  });
  const fromDate = dateRange[0].format("YYYY-MM-DD");
  const endDate = dateRange[1].format("YYYY-MM-DD");

  const { data: revenueByMethodResponse } = useQuery({
    queryKey: ["dashboardRevenueByMethod", fromDate, endDate],
    queryFn: () => ReportApi.revenueByMethod({ fromDate, endDate }),
    select: (response) => response.data.items ?? [],
  });

  const rows = useMemo(() => {
    if (Array.isArray(revenueByMethodResponse)) return revenueByMethodResponse;
    return [];
  }, [revenueByMethodResponse]);

  const categories = useMemo(
    () =>
      (rows as RevenueByMethodItem[]).map((row, index) =>
        row.label ? String(row.label) : `${t("Method")} ${index + 1}`,
      ),
    [rows, t],
  );
  const data = useMemo(
    () => (rows as RevenueByMethodItem[]).map((row) => row.revenue ?? 0),
    [rows],
  );

  const donutSeries = useMemo(() => [...data], [data]);

  const chartOptions = useMemo<ApexOptions>(
    () => ({
      dataLabels: {
        formatter: (value, opts) => {
          const apexOpts = opts as
            | { seriesIndex?: number; w?: { config?: { series?: number[] } } }
            | undefined;
          const rawValue =
            apexOpts?.w?.config?.series?.[apexOpts.seriesIndex ?? 0] ?? value;
          return formatUsd(Number(rawValue));
        },
      },
      tooltip: {
        y: {
          formatter: (val) => formatUsd(val),
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              value: {
                show: true,
                formatter: (val) => formatUsd(Number(val ?? 0)),
              },
              total: {
                show: true,
                label: t("Total"),
                formatter: () =>
                  formatUsd(
                    data.reduce(
                      (totalRevenue, current) => totalRevenue + current,
                      0,
                    ),
                  ),
              },
            },
          },
        },
      },
    }),
    [data, t],
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
      title={title ?? t("Revenue by method")}
      extra={extra}
      chartType="donut"
      labels={categories}
      series={donutSeries}
      height={height}
      options={chartOptions}
    />
  );
};

export default DashboardRevenueByMethodChart;

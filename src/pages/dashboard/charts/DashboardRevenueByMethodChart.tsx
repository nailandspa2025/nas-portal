import { useMemo, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ApexOptions } from "apexcharts";
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
  height = 300,
}) => {
  const { t } = useTranslation();
  const { data: revenueByMethodResponse } = useQuery({
    queryKey: ["dashboardRevenueByMethod"],
    queryFn: () => ReportApi.revenueByMethod(),
    select: (response) => response.data.items ?? [],
  });

  const rows = useMemo(() => {
    if (Array.isArray(revenueByMethodResponse)) return revenueByMethodResponse;
    return [];
  }, [revenueByMethodResponse]);

  const categories = useMemo(
    () =>
      (rows as RevenueByMethodItem[]).map((row, index) =>
        row.label ? String(row.label) : `${t("Method")} ${index + 1}`
      ),
    [rows, t]
  );
  const data = useMemo(
    () => (rows as RevenueByMethodItem[]).map((row) => row.revenue ?? 0),
    [rows]
  );

  const series = useMemo(() => [{ name: t("Revenue"), data }], [data, t]);

  const chartOptions = useMemo<ApexOptions>(
    () => ({
      yaxis: {
        labels: {
          formatter: (val) => formatUsd(val),
        },
      },
      tooltip: {
        y: {
          formatter: (val) => formatUsd(val),
        },
      },
    }),
    [],
  );

  return (
    <CommonChart
      title={title ?? t("Revenue by method")}
      chartType="bar"
      categories={categories}
      series={series}
      height={height}
      options={chartOptions}
    />
  );
};

export default DashboardRevenueByMethodChart;

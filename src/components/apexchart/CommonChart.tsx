import type { FC, ReactNode } from "react";
import { Card, type CardProps } from "antd";
import type { ApexOptions } from "apexcharts";
import type { Props as ApexChartProps } from "react-apexcharts";
import AppReactApexCharts from "./AppReactApexCharts";
import {
  buildDashboardChartOptions,
  type DashboardChartType,
} from "./buildDashboardChartOptions";

export type DashboardChartCardProps = {
  title: ReactNode;
  extra?: ReactNode;
  chartType: DashboardChartType;
  series: ApexChartProps["series"];
  categories?: string[];
  labels?: string[];
  height?: number;
  options?: ApexOptions;
  cardProps?: CardProps;
};

const DashboardChartCard: FC<DashboardChartCardProps> = ({
  title,
  extra,
  chartType,
  series,
  categories,
  labels,
  height = 320,
  options: optionsOverrides,
  cardProps,
}) => {
  const options = buildDashboardChartOptions({
    chartType,
    categories,
    labels,
    overrides: optionsOverrides,
  });

  return (
    <Card title={title} extra={extra} {...cardProps}>
      <AppReactApexCharts
        type={chartType}
        series={series}
        options={options}
        height={height}
        wrapperProps={{ style: { width: "100%" } }}
      />
    </Card>
  );
};

export default DashboardChartCard;

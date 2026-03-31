import { lazy } from "react";

const LazyReactApexChart = lazy(() => import("react-apexcharts"));

export default LazyReactApexChart;
export type { Props as ApexChartProps } from "react-apexcharts";

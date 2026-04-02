import { Suspense, type FC, type HTMLAttributes, type ReactNode } from "react";
import { Spin } from "antd";
import type { Props } from "react-apexcharts";
import LazyReactApexChart from "./ApexCharts";
import "../../assets/css/apexchart.scss";

export type AppReactApexChartsProps = Props & {
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  suspenseFallback?: ReactNode;
};

const defaultFallback = <Spin size="small" />;

const AppReactApexCharts: FC<AppReactApexChartsProps> = ({
  wrapperProps,
  suspenseFallback,
  ...chartProps
}) => {
  return (
    <div className="apex-chart-wrapper" {...wrapperProps}>
      <Suspense fallback={suspenseFallback ?? defaultFallback}>
        <LazyReactApexChart {...chartProps} />
      </Suspense>
    </div>
  );
};

export default AppReactApexCharts;

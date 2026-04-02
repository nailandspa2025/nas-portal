import type { ApexOptions } from "apexcharts";
import merge from "lodash-es/merge";
import type { Props as ApexChartProps } from "react-apexcharts";

export type DashboardChartType = NonNullable<ApexChartProps["type"]>;

const portalColors = ["#2196f3", "#33b79b", "#f54266", "#3858f9", "#faad14", "#722ed1"];

function isRadialChart(type: DashboardChartType): boolean {
  return (
    type === "pie" ||
    type === "donut" ||
    type === "radialBar" ||
    type === "polarArea"
  );
}

/**
 * Default Apex options for dashboard cards; merged with `overrides` (lodash merge).
 */
export function buildDashboardChartOptions(params: {
  chartType: DashboardChartType;
  categories?: string[];
  labels?: string[];
  overrides?: ApexOptions;
}): ApexOptions {
  const { chartType, categories, labels, overrides } = params;
  const radial = isRadialChart(chartType);

  // ApexCharts 5 reads `config.labels.length` in several paths; `undefined` throws.
  // Pie/donut numeric series also require `labels` to be a defined array for old-format detection.
  const safeLabels = labels ?? [];

  const defaults: ApexOptions = {
    chart: {
      type: chartType,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif",
    },
    colors: portalColors,
    dataLabels: { enabled: radial, style: { fontSize: "11px" } },
    stroke: { curve: "smooth", width: radial ? 0 : 2 },
    grid: radial
      ? { padding: { top: 0, right: 0, bottom: 0, left: 0 } }
      : { strokeDashArray: 4, padding: { top: 4, right: 8, bottom: 0, left: 8 } },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      markers: { size: 6 },
    },
    tooltip: {
      shared: !radial,
      intersect: radial,
      theme: "light",
    },
    labels: safeLabels,
    ...(categories?.length
      ? {
          xaxis: {
            categories,
            labels: { style: { fontSize: "11px" } },
          },
        }
      : {}),
    ...(chartType === "bar"
      ? { plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } } }
      : chartType === "donut"
        ? { plotOptions: { pie: { donut: { size: "65%" } } } }
        : {}),
  };

  return merge({}, defaults, overrides ?? {});
}

import type { CardProps } from "antd";
import type { ReactNode } from "react";
import type { ApexOptions } from "apexcharts";

export type DashboardLineSeries = {
  name: string;
  data: number[];
};

export type DashboardChartsApiPayload = {
  revenue?: {
    categories: string[];
    series: DashboardLineSeries[];
  };
  bookingStatusCounts?: readonly [number, number, number];
  bookingsByWeekday?: {
    categories: string[];
    counts: number[];
  };
  bookingsByService?: {
    categories: string[];
    counts: number[];
  };
};

export type DashboardRevenueChartProps = {
  title?: ReactNode;
  height?: number;
  options?: ApexOptions;
  cardProps?: CardProps;
};

export type DashboardBookingStatusChartProps = {
  title?: ReactNode;
  height?: number;
  cardProps?: CardProps;
};

export type DashboardBookingsWeekdayChartProps = {
  categories: string[];
  data: number[];
  seriesName?: string;
  title?: ReactNode;
  height?: number;
  cardProps?: CardProps;
};

export type DashboardBookingsByUserChartProps = {
  seriesName?: string;
  title?: ReactNode;
  height?: number;
  cardProps?: CardProps;
};

export type DashboardRevenueByMethodChartProps = {
  title?: string;
  height?: number;
};

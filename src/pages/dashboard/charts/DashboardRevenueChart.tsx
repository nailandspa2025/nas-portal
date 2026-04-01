import { useQuery } from "@tanstack/react-query";
import { DatePicker, Radio } from "antd";
import type { ApexOptions } from "apexcharts";
import dayjs, { type Dayjs } from "dayjs";
import { useMemo, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { ReportApi, type RevenueByTimeItem } from "../../../apis/report/report";
import CommonChart from "../../../components/apexchart/CommonChart";
import { formatUsd } from "../../../utils/formatMoneyUsd";
import type { DashboardRevenueChartProps } from "../dashboardChart.types";

const API_DATE_FORMAT = "YYYY-MM-DD";
const UI_DATE_FORMAT = "DD/MM/YYYY";
const UI_MONTH_FORMAT = "MM/YYYY";
const UI_YEAR_FORMAT = "YYYY";

const DashboardRevenueChart: FC<DashboardRevenueChartProps> = ({
  title,
  height = 340,
  options,
  cardProps,
}) => {
  const { t } = useTranslation();
  const { RangePicker } = DatePicker;
  const [groupBy, setGroupBy] = useState<1 | 2 | 3>(2);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>(() => {
    const end = dayjs();
    return [end.subtract(1, "month").startOf("day"), end.startOf("day")];
  });
  const [monthYear, setMonthYear] = useState<Dayjs>(() => dayjs());
  const [yearRange, setYearRange] = useState<[Dayjs, Dayjs]>(() => {
    const endYear = dayjs().startOf("year");
    return [endYear.subtract(4, "year"), endYear];
  });
  const queryParams = useMemo(() => {
    if (groupBy === 1) {
      return {
        GroupBy: 1 as const,
        fromDate: dateRange[0].format(API_DATE_FORMAT),
        endDate: dateRange[1].format(API_DATE_FORMAT),
      };
    }
    if (groupBy === 2) {
      return {
        GroupBy: 2 as const,
        year: monthYear.year(),
      };
    }
    return {
      GroupBy: 3 as const,
      fromYear: yearRange[0].year(),
      toYear: yearRange[1].year(),
    };
  }, [dateRange, groupBy, monthYear, yearRange]);

  const { data: revenueByTimeResponse } = useQuery({
    queryKey: ["dashboardRevenueByTime", queryParams],
    queryFn: () => ReportApi.revenueByTime(queryParams),
    select: (response) => response.data.items ?? [],
    placeholderData: (previousData) => previousData,
  });

  const rows = useMemo(() => {
    if (Array.isArray(revenueByTimeResponse)) return revenueByTimeResponse;
    return [];
  }, [revenueByTimeResponse]);

  const categories = useMemo(
    () =>
      (rows as RevenueByTimeItem[]).map((row) => {
        if (row.label) return String(row.label);
        if (!row.date) return "";
        const parsed = dayjs(row.date);
        if (!parsed.isValid()) return String(row.date);
        if (groupBy === 1) return parsed.format(UI_DATE_FORMAT);
        if (groupBy === 2) return parsed.format(UI_MONTH_FORMAT);
        return parsed.format(UI_YEAR_FORMAT);
      }),
    [groupBy, rows],
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
      dataLabels: {
        ...options?.dataLabels,
        enabled: true,
        formatter: (val) => formatUsd(Number(val ?? 0)),
        offsetY: -20,
        style: {
          ...options?.dataLabels?.style,
          fontSize: "11px",
          fontWeight: 700,
          colors: ["#1f2937"],
        },
        background: {
          enabled: true,
          foreColor: "#ffffff",
          borderRadius: 6,
          borderWidth: 0,
          opacity: 0.92,
          padding: 4,
        },
      },
      plotOptions: {
        ...options?.plotOptions,
        bar: {
          ...options?.plotOptions?.bar,
          horizontal: false,
          borderRadius: 4,
          columnWidth: "55%",
          dataLabels: {
            ...options?.plotOptions?.bar?.dataLabels,
            position: "top",
          },
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 10,
        width: "100%",
        maxWidth: "100%",
        flexWrap: "wrap",
      }}>
      <Radio.Group
        size="small"
        value={groupBy}
        buttonStyle="solid"
        onChange={(event) => setGroupBy(event.target.value as 1 | 2 | 3)}>
        <Radio.Button value={1}>{t("Day")}</Radio.Button>
        <Radio.Button value={2}>{t("Month")}</Radio.Button>
        <Radio.Button value={3}>{t("Year")}</Radio.Button>
      </Radio.Group>
      <div
        style={{
          minHeight: 32,
          display: "flex",
          alignItems: "center",
          width: 260,
        }}>
        {groupBy === 1 && (
          <RangePicker
            size="small"
            style={{ width: "100%" }}
            format={UI_DATE_FORMAT}
            allowClear={false}
            inputReadOnly
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
        )}
        {groupBy === 2 && (
          <DatePicker
            size="small"
            picker="year"
            style={{ width: "100%" }}
            allowClear={false}
            inputReadOnly
            value={monthYear}
            onChange={(value) => {
              if (value) setMonthYear(value);
            }}
            disabledDate={(current) =>
              current != null && current > dayjs().endOf("year")
            }
          />
        )}
        {groupBy === 3 && (
          <RangePicker
            size="small"
            picker="year"
            style={{ width: "100%" }}
            allowClear={false}
            inputReadOnly
            value={yearRange}
            onChange={(dates) => {
              if (dates?.[0] && dates[1]) {
                setYearRange([dates[0], dates[1]]);
              }
            }}
            disabledDate={(current) =>
              current != null && current > dayjs().endOf("year")
            }
          />
        )}
      </div>
    </div>
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

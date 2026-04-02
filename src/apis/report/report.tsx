import queryString from "query-string";
import apiCall from "../index";
import { API_METHOD } from "../../constants/application.constant";

type DateRangeParams = {
  fromDate?: string;
  endDate?: string;
};

type RevenueByTimeParams = DateRangeParams & {
  GroupBy?: number;
  year?: number;
  fromYear?: number;
  toYear?: number;
};

export type ReportApiEnvelope<T> = {
  succeeded?: boolean;
  message?: string;
  data: {
    items: T;
    total?: number;
    totalRevenue?: number;
  };
};

export type BookingByStatusItem = {
  value: number;
  label: string;
};

export type BookingByUserItem = {
  label: string;
  value: number;
};

export type RevenueByTimeItem = {
  date: string;
  label: string;
  revenue: number;
};

export type RevenueByMethodItem = {
  date: string;
  label: string;
  revenue: number;
};

export const ReportApi = {
  bookingByStatus: async (params: DateRangeParams) => {
    const qs = queryString.stringify(params);
    const endpoint = `/report/api/v1/report/booking-by-status?${qs}`;
    return await apiCall<ReportApiEnvelope<BookingByStatusItem[]>>(
      API_METHOD.GET,
      endpoint,
    );
  },
  bookingByUser: async (params: DateRangeParams) => {
    const qs = queryString.stringify(params);
    const endpoint = `/report/api/v1/report/booking-by-user?${qs}`;
    return await apiCall<ReportApiEnvelope<BookingByUserItem[]>>(
      API_METHOD.GET,
      endpoint,
    );
  },
  revenueByTime: async (params: RevenueByTimeParams) => {
    const qs = queryString.stringify({
      GroupBy: params?.GroupBy ?? 1,
      fromDate: params?.fromDate,
      endDate: params?.endDate,
      year: params?.year,
      fromYear: params?.fromYear,
      toYear: params?.toYear,
    });
    const endpoint = `/report/api/v1/report/revenue-by-time?${qs}`;
    return await apiCall<ReportApiEnvelope<RevenueByTimeItem[]>>(
      API_METHOD.GET,
      endpoint,
    );
  },
  revenueByMethod: async (params: DateRangeParams) => {
    const qs = queryString.stringify(params);
    const endpoint = `/report/api/v1/report/revenue-by-method?${qs}`;
    return await apiCall<ReportApiEnvelope<RevenueByMethodItem[]>>(
      API_METHOD.GET,
      endpoint,
    );
  },
};

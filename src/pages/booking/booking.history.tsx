/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import queryString from "query-string";
import useElementHeight from "../../utils/useElementHeight";
import DataTable from "../../components/common/DataTable";
import FilterData from "../../components/common/FilterData";
import * as utils from "../../utils/filter/bookingHistory";
import { BookingApi } from "../../apis/order/booking";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const cardStyle = {
  height: "100%",
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
};
const valueStyle = { fontWeight: 600 };

/** Lịch sử booking: danh sách chỉ xem, mới nhất trước, lọc theo trạng thái / ngày / cửa hàng. */
const BookingHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const heightElement = useElementHeight(divRef);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filteredColumns, setFilteredColumns] = useState<any>();
  // Cùng một bộ tham số (đã cộng 1 ngày cho endDate trong handleFilterChange)
  // cho danh sách và GetBookingSummaryQuery (Total booking, Doanh thu).
  const filterParams = filters;

  const { data } = useQuery({
    queryKey: ["bookingHistory", { pageNumber, pageSize, ...filterParams }],
    queryFn: async () => {
      const response: any = await BookingApi.getWithPagination(
        queryString.stringify({
          pageNumber,
          pageSize,
          sortDescending: true,
          ...filterParams,
        }),
      );
      return response.data;
    },
  });

  const { data: summary, isFetching: loadingSummary } = useQuery({
    queryKey: ["bookingHistorySummary", filterParams],
    queryFn: async () => {
      const response: any = await BookingApi.summary(
        queryString.stringify(filterParams),
      );
      return response.data;
    },
  });

  const handleFilterChange = (params: Record<string, any>) => {
    // API lọc BookingDate < endDate → cộng 1 ngày để bao gồm ngày cuối khoảng chọn.
    if (params.endDate) {
      params = {
        ...params,
        endDate: dayjs(params.endDate).add(1, "day").format("YYYY-MM-DD"),
      };
    }
    setFilters(params);
    setPageNumber(1);
  };

  const columns = useMemo(
    () =>
      utils.columns({
        t,
        handleView: (record: any) => navigate(`/booking/${record.id}`),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  return (
    <Card className="ant-custom-pagination">
      <div ref={divRef}>
        <Row style={{ marginBottom: "16px" }}>
          <FilterData
            filteredColumns={columns}
            onColumnChange={setFilteredColumns}
            onFilterChange={handleFilterChange}
            handlers={{}}
            utils={utils}
          />
        </Row>
        <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={cardStyle}>
              <Statistic
                title={t("Total booking")}
                value={summary?.totalBookings ?? 0}
                loading={loadingSummary}
                prefix={<CalendarOutlined />}
                valueStyle={{ ...valueStyle, color: "#1677ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={cardStyle}>
              <Statistic
                title={t("Revenue")}
                value={summary?.revenue ?? 0}
                precision={2}
                prefix={<DollarOutlined />}
                loading={loadingSummary}
                valueStyle={{ ...valueStyle, color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={cardStyle}>
              <Statistic
                title={t("Tip")}
                value={summary?.tipAmount ?? 0}
                precision={2}
                prefix={<DollarOutlined />}
                loading={loadingSummary}
                valueStyle={{ ...valueStyle, color: "#d48806" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={cardStyle}>
              <Statistic
                title={`${t("Completed")} / ${t("Cancelled")}`}
                value={summary?.completedBookings ?? 0}
                prefix={<CheckCircleOutlined />}
                suffix={
                  <span style={{ color: "#cf1322" }}>
                    / {summary?.cancelledBookings ?? 0}
                  </span>
                }
                loading={loadingSummary}
                valueStyle={{ ...valueStyle, color: "#389e0d" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <DataTable
        current={pageNumber}
        columns={filteredColumns}
        dataSource={data?.items}
        total={data?.totalCount}
        pageSize={pageSize}
        heightTable={heightElement}
        onChange={(page, size) => {
          setPageSize(size);
          setPageNumber(page);
        }}
      />
    </Card>
  );
};
export default BookingHistory;

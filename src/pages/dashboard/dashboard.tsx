import { Col, Row } from "antd";
import { type FC } from "react";
import {
  DashboardBookingStatusChart,
  DashboardBookingsByUserChart,
  DashboardRevenueByMethodChart,
  DashboardRevenueChart,
} from "./charts";

const Dashboard: FC = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={14}>
        <DashboardRevenueChart />
      </Col>
      <Col xs={24} lg={10}>
        <DashboardRevenueByMethodChart />
      </Col>
      <Col xs={24} lg={16}>
        <DashboardBookingsByUserChart />
      </Col>
      <Col xs={24} lg={8}>
        <DashboardBookingStatusChart />
      </Col>
    </Row>
  );
};

export default Dashboard;

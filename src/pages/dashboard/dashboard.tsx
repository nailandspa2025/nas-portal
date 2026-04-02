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
      <Col xs={24} lg={24}>
        <DashboardBookingsByUserChart />
      </Col>
      <Col xs={24} lg={24}>
        <DashboardRevenueChart />
      </Col>
      <Col xs={24} lg={12}>
        <DashboardBookingStatusChart />
      </Col>
      <Col xs={24} lg={12}>
        <DashboardRevenueByMethodChart />
      </Col>
    </Row>
  );
};

export default Dashboard;

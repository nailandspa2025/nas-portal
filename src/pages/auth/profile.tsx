/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Button, Card, Col, Descriptions, Row } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.auth.user);

  const genderType = [
    { label: t("Male"), value: 1 },
    { label: t("Female"), value: 2 },
    { label: t("Other"), value: 3 },
  ];
  return (
    <div style={styles.container}>
      <Card
        style={styles.card}
        styles={{ body: { paddingLeft: 0, paddingRight: 0 } }}
      >
        <Row align="middle">
          <Col xs={24} md={8} style={styles.avatarContainer}>
            <Avatar
              size={180}
              src={
                user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : undefined
              }
              icon={<UserOutlined />}
              style={styles.avatar}
            />
          </Col>
          <Col xs={24} md={16}>
            <h1 style={styles.userName}>{user.fullName}</h1>
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label={t("Email")}>
                {user.email}
              </Descriptions.Item>
              <Descriptions.Item label={t("Phone")}>
                {user.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label={t("Gender")}>
                {genderType.find((g) => g.value === user.gender)?.label ||
                  t("Unknown")}
              </Descriptions.Item>
              <Descriptions.Item label={t("Birthday")}>
                {user.dateOfBirth
                  ? dayjs(user.dateOfBirth).format("DD/MM/YYYY")
                  : t("Unknown")}
              </Descriptions.Item>
              <Descriptions.Item label={t("Status")}>
                {user.isActive ? t("Active") : t("InActive")}
              </Descriptions.Item>
              <Descriptions.Item label={t("Address")}>
                {user.street}
              </Descriptions.Item>
            </Descriptions>
            <div style={{ textAlign: "center", paddingTop: 20 }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate("/update-profile")}
              >
                {t("Edit Profile")}
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "85vh",
    // padding: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    //background: "#f0f2f5",
  },
  card: {
    width: "100%",
    maxWidth: 1000,
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    background: "#fff",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    border: "4px solid #1890ff",
    backgroundColor: "#fff",
  },
  userName: {
    fontSize: "24px",
    fontWeight: 600,
    marginBottom: 16,
    textAlign: "center",
  },
};

export default Profile;

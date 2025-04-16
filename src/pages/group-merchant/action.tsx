/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Form, Input, Row, Space, Switch } from "antd";
import TopActionButtons from "../../components/common/TopActionButtons";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Collapse, Checkbox } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RoleApi } from "../../apis/auth/role";
import { buildFormData } from "../../utils/common/buildFormData";
import { toast } from "react-toastify";
import { useEffect } from "react";
import UserMerchantSelect from "../../components/UserMerchantSelect";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
const accessRights = [
  {
    id: "booking",
    name: "Booking",
  },
  {
    id: "store",
    name: "Store",
  },
];
const defaultRights = [
  {
    name: "Admin",
    value: "admin",
  },
  {
    name: "View",
    value: "view",
  },
  {
    name: "Create",
    value: "create",
  },
  {
    name: "Update",
    value: "update",
  },
  {
    name: "Delete",
    value: "delete",
  },
  {
    name: "Export",
    value: "export",
  },
];
const customRightsMap: {
  [key: string]: { name: string; value: string }[];
} = {
  // post: [
  //   { name: "Gửi duyệt", value: "submitForApproval" },
  //   { name: "Xét duyệt của trưởng nhóm", value: "approvel1" },
  // ],
  // booking: [
  //   { name: "Duyệt lịch hẹn", value: "approveBooking" },
  //   { name: "Hủy lịch hẹn", value: "cancelBooking" },
  // ],
};
const GroupMerchantActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const [checkedPermissions, setCheckedPermissions] = useState<{
    [key: string]: string[];
  }>({});
  const [form] = Form.useForm();
  const { data = { data: {} } } = useQuery({
    queryKey: ["roleDetail", params.id],
    queryFn: () => RoleApi.getById(params.id as any),
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && (data as any)?.data) {
      const value = (data as any).data;
      form.setFieldsValue({
        name: value.name || "",
        note: value.note || "",
        isActive: value.isActive ?? true,
        userIds: value?.userIds ?? null,
      });
      if (value.permissions) {
        const mappedPermissions: { [key: string]: string[] } = {};
        value.permissions.forEach((perm: string) => {
          const [key, action] = perm.split(".");
          if (!mappedPermissions[key]) {
            mappedPermissions[key] = [];
          }
          mappedPermissions[key].push(action);
        });
        setCheckedPermissions(mappedPermissions);
      }
    }
  }, [data, form, params.id]);
  const handleCheck = (key: string, action: string, checked: boolean) => {
    setCheckedPermissions((prev) => {
      const updatedActions = checked
        ? [...(prev[key] || []), action]
        : prev[key]?.filter((a) => a !== action) || [];
      return { ...prev, [key]: updatedActions };
    });
  };
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await RoleApi.update(params.id as string, formD)
        : await RoleApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/groupmerchant");
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  const handleSubmit = () => {
    form.submit();
  };
  const onFinish = (values: any) => {
    const permissions = Object.keys(checkedPermissions).flatMap((key) =>
      checkedPermissions[key].map((action) => `${key}.${action}`)
    );
    const paylpad = {
      ...values,
      permissions,
      isActive: values.isActive ?? true,
      roleType: 1,
    };
    if (params?.id) paylpad.id = params.id;
    mutation.mutate(paylpad);
  };

  return (
    <>
      <Row
        className="custom-row"
        justify="space-between"
        align="middle"
        gutter={[0, 16]}
      >
        <Col flex="auto">
          <div className="custom-title">
            {params?.id ? t("Update group") : t("Create group")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/groupmerchant"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(
              accesses,
              "update",
              "groupmerchant"
            )}
          />
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("Group name")}
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: t("Please enter group name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter group name")} />
              </Form.Item>
              <Form.Item label={t("Users")} name="userIds">
                <UserMerchantSelect mode="multiple" />
              </Form.Item>
              <Space align="center">
                <Form.Item name="isActive" valuePropName="checked" noStyle>
                  <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={true}
                  />
                </Form.Item>
                <span>{t("Active")}</span>
              </Space>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label={t("Note")} name={"note"}>
                <Input.TextArea rows={4} placeholder={t("Enter note")} />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ padding: "30px 0px" }} className="custom-title">
            {t("Access Rights")}
          </div>
          <div className="group-collapse">
            {accessRights.map((nav: any) => {
              return (
                <Collapse
                  key={nav.id}
                  defaultActiveKey={nav.id}
                  expandIconPosition="end"
                  style={{ marginBottom: 10 }}
                  items={[
                    {
                      key: nav.id,
                      label: (
                        <div style={{ fontWeight: 500, fontSize: 13 }}>
                          {nav.name}
                        </div>
                      ),
                      children: (
                        <div>
                          {nav?.children && nav.children.length > 0 ? (
                            <Row>
                              {nav?.children.map(
                                (child: any, index: number) => (
                                  <Row
                                    key={child.id}
                                    gutter={[0, 10]}
                                    style={{
                                      width: "100%",
                                      borderBottom:
                                        index !== nav.children.length - 1
                                          ? "1px solid #ddd"
                                          : "none",
                                      display: "flex",
                                      alignItems: "center",
                                      padding: 16,
                                    }}
                                  >
                                    <Col
                                      key={index}
                                      xs={24}
                                      sm={12}
                                      md={4}
                                      lg={4}
                                      xl={4}
                                      style={{
                                        fontWeight: 500,
                                        display: "flex",
                                        alignItems: "center",
                                        fontSize: 13,
                                      }}
                                    >
                                      {child.name}
                                    </Col>
                                    <Col
                                      xs={24}
                                      sm={20}
                                      md={20}
                                      lg={20}
                                      xl={20}
                                    >
                                      <Row
                                        gutter={[16, 5]}
                                        style={{ width: "100%" }}
                                      >
                                        {[
                                          ...defaultRights,
                                          ...(customRightsMap[nav.id] || []),
                                        ].map((right) => (
                                          <Col
                                            key={right.value}
                                            xs={24}
                                            sm={12}
                                            md={8}
                                            lg={6}
                                            xl={4}
                                            style={{ fontSize: 13 }}
                                          >
                                            <Space>
                                              <Checkbox
                                                checked={checkedPermissions[
                                                  child.id
                                                ]?.includes(right.value)}
                                                onChange={(e) =>
                                                  handleCheck(
                                                    child.id,
                                                    right.value,
                                                    e.target.checked
                                                  )
                                                }
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                }
                                              />
                                              <span
                                                style={{ whiteSpace: "nowrap" }}
                                              >
                                                {right.name}
                                              </span>
                                            </Space>
                                          </Col>
                                        ))}
                                      </Row>
                                    </Col>
                                  </Row>
                                )
                              )}
                            </Row>
                          ) : (
                            <Row
                              gutter={[0, 10]}
                              key={nav.id}
                              style={{
                                width: "100%",
                                alignItems: "center",
                                padding: 16,
                                fontSize: 13,
                              }}
                            >
                              <Col
                                xs={24}
                                sm={12}
                                md={4}
                                lg={4}
                                xl={4}
                                style={{
                                  fontWeight: 500,
                                  display: "flex",
                                  alignItems: "center",
                                  fontSize: 13,
                                }}
                              >
                                <Space>{nav.name}</Space>
                              </Col>
                              <Col xs={24} sm={20} md={20} lg={20} xl={20}>
                                <Row gutter={[16, 5]} style={{ width: "100%" }}>
                                  {[
                                    ...defaultRights,
                                    ...(customRightsMap[nav.id] || []),
                                  ].map((right) => (
                                    <Col
                                      key={right.value}
                                      xs={24}
                                      sm={12}
                                      md={8}
                                      lg={6}
                                      xl={4}
                                      style={{ fontSize: 13 }}
                                    >
                                      <Space>
                                        <Checkbox
                                          checked={checkedPermissions[
                                            nav.id
                                          ]?.includes(right.value)}
                                          onChange={(e) =>
                                            handleCheck(
                                              nav.id,
                                              right.value,
                                              e.target.checked
                                            )
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <span style={{ whiteSpace: "nowrap" }}>
                                          {right.name}
                                        </span>
                                      </Space>
                                    </Col>
                                  ))}
                                </Row>
                              </Col>
                            </Row>
                          )}
                        </div>
                      ),
                    },
                  ]}
                />
              );
            })}
          </div>
        </Form>
      </Card>
      <TopActionButtons
        style={{ marginTop: 20, marginBottom: 20 }}
        backUrl="/groupmerchant"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(
          accesses,
          "update",
          "groupmerchant"
        )}
      />
    </>
  );
};
export default GroupMerchantActions;

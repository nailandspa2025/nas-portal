/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Form, Input, Row, Space, Switch } from "antd";
import TopActionButtons from "../../components/common/TopActionButtons";
import BottomActionButtons from "../../components/common/BottomActionButtons";
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
import _nav, {
  customRightsMap,
  defaultRights,
} from "../../components/layout/_nav";
import UserSelect from "../../components/UserSelect";

const GroupActions = () => {
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
    if ((data as any)?.data) {
      const value = (data as any).data;
      form.setFieldsValue({
        name: value.name || "",
        note: value.note || "",
        isActive: value.isActive ?? true,
        userIds: value?.userIds ?? null,
      });
      const permissionMap: { [key: string]: string[] } = {};
      value.permissions?.forEach((perm: string) => {
        const [key, action] = perm.split(".");
        if (!permissionMap[key]) permissionMap[key] = [];
        permissionMap[key].push(action);
      });
      if (
        JSON.stringify(permissionMap) !== JSON.stringify(checkedPermissions)
      ) {
        setCheckedPermissions(permissionMap);
      }
    }
  }, [data, form, checkedPermissions]);
  const getNavItems = () => {
    return _nav.flatMap((nav: any) =>
      nav.children ? nav.children : nav.id !== "groupuser" ? [nav] : []
    );
  };
  const handleCheck = (key: string, action: string, checked: boolean) => {
    setCheckedPermissions((prev) => {
      const updatedActions = checked
        ? [...(prev[key] || []), action]
        : prev[key]?.filter((a) => a !== action) || [];
      return { ...prev, [key]: updatedActions };
    });
  };
  const handleCheckAll = (navId: string, checked: boolean) => {
    const allRights = [
      ...defaultRights.map((r) => r.value),
      ...(customRightsMap[navId]?.map((r) => r.value) || []),
    ];
    setCheckedPermissions((prev) => ({
      ...prev,
      [navId]: checked ? allRights : [],
    }));
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
        navigate("/group");
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
          <TopActionButtons backUrl="/group" onSubmit={handleSubmit} />
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
                <UserSelect mode="multiple" />
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
        </Form>
        <div style={{ padding: "30px 0px" }} className="custom-title">
          {t("Access Rights")}
        </div>
        <div>
          {getNavItems().map((nav) => {
            const allRights = [
              ...defaultRights.map((r) => r.value),
              ...(customRightsMap[nav.id]?.map((r) => r.value) || []),
            ];
            const isAllChecked =
              checkedPermissions[nav.id]?.length === allRights.length &&
              allRights.length > 0;

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
                      <Checkbox
                        checked={isAllChecked}
                        indeterminate={
                          checkedPermissions[nav.id]?.length > 0 &&
                          checkedPermissions[nav.id]?.length < allRights.length
                        }
                        onChange={(e) =>
                          handleCheckAll(nav.id, e.target.checked)
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        {nav.name}
                      </Checkbox>
                    ),

                    children: (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 16,
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Mặc định quyền */}
                        {defaultRights.map((right) => (
                          <Checkbox
                            key={right.value}
                            checked={checkedPermissions[nav.id]?.includes(
                              right.value
                            )}
                            onChange={(e) =>
                              handleCheck(nav.id, right.value, e.target.checked)
                            }
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: "auto",
                              marginRight: "10px",
                            }}
                          >
                            {right.name}
                          </Checkbox>
                        ))}
                        {/* Quyền tùy chỉnh (chỉ hiển thị với từng trang) */}
                        {customRightsMap[nav.id]?.map((right) => (
                          <Checkbox
                            key={right.value}
                            checked={checkedPermissions[nav.id]?.includes(
                              right.value
                            )}
                            onChange={(e) =>
                              handleCheck(nav.id, right.value, e.target.checked)
                            }
                            onClick={(e) => e.stopPropagation()}
                          >
                            {right.name}
                          </Checkbox>
                        ))}
                      </div>
                    ),
                  },
                ]}
              />
            );
          })}
        </div>
      </Card>
      <BottomActionButtons backUrl="/group" onSubmit={handleSubmit} />
    </>
  );
};

export default GroupActions;

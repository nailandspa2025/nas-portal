import { Card, Form, Row, Col, Input, InputNumber } from "antd";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { buildFormData } from "../../utils/common/buildFormData";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { BankAccountApi } from "../../apis/catalog/bank";
const BankActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const { data } = useQuery({
    queryKey: ["bankAccountDetail", params.id],
    queryFn: async () => {
      const res: any = await BankAccountApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && data) {
      form.setFieldsValue({
        accountName: data.accountName || "",
        accountNumber: data.accountNumber || "",
        bankName: data.bankName || "",
        branchName: data.branchName || "",
        swiftCode: data.swiftCode || "",
        currencyCode: data.currencyCode || "",
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await BankAccountApi.update(params.id as any, formD)
        : await BankAccountApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/bank");
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  const onFinish = (values: any) => {
    const payload = {
      ...values,
      serviceIds: values.serviceIds ?? null,
    };
    if (params.id) {
      payload.id = params.id;
    }
    mutation.mutate(payload);
  };
  const handleSubmit = () => {
    form.submit();
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
            {params?.id
              ? t("Update a bank account")
              : t("Create a bank account")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/bank"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(accesses, "update", "bank")}
          />
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("Account Name")}
                name="accountName"
                rules={[
                  {
                    required: true,
                    message: t("Please enter account name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter account name")} />
              </Form.Item>
              <Form.Item
                label={t("Account Number")}
                name="accountNumber"
                rules={[
                  {
                    required: true,
                    message: t("Please enter branch name!"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("Enter account number")}
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Form.Item
                label={t("Bank Name")}
                name="bankName"
                rules={[
                  {
                    required: true,
                    message: t("Please enter bank name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter bank name")} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                label={t("Branch Name")}
                name="branchName"
                rules={[
                  {
                    required: true,
                    message: t("Please enter branch name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter branch name")} />
              </Form.Item>
              <Form.Item label={t("Code")} name="swiftCode">
                <Input placeholder={t("Enter branch code")} />
              </Form.Item>
              <Form.Item label={t("Currency")} name="currencyCode">
                <Input placeholder={t("Enter currency")} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default BankActions;

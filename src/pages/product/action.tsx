/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Form, Row, Col, Input, InputNumber } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import UseEditor from "../../components/common/UserEditor";
import { ProductApi } from "../../apis/catalog/product";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { buildFormData } from "../../utils/common/buildFormData";
import { uploadImage } from "../../utils/common/uploadImages";
import TopActionButtons from "../../components/common/TopActionButtons";
import StoreSelect from "../../components/StoreSelect";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";

const ProdutActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [description, setDescription] = useState("");
  const [imageList, setImageList] = useState<File[]>([]);

  const { data } = useQuery({
    queryKey: ["productDetail", params.id],
    queryFn: async () => {
      const res: any = await ProductApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && data) {
      setDescription(data.description ?? "");
      form.setFieldsValue({
        productName: data.productName || "",
        price: data.price || "",
        description: data.description || "",
        storeId: data.storeId || null,
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await ProductApi.update(params.id as any, formD)
        : await ProductApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/product");
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
    },
  });
  const onFinish = async (values: any) => {
    const updatedDescription = await uploadImage(description, imageList);
    const payload = {
      ...values,
      description: updatedDescription,
    };
    if (params.id) payload.id = params.id;

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
            {params?.id ? t("Update product") : t("Create product")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/product"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(
              accesses,
              "update",
              "product"
            )}
          />
        </Col>
      </Row>

      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                label={t("Product name")}
                name="productName"
                rules={[
                  {
                    required: true,
                    message: t("Please enter product name!"),
                  },
                ]}
              >
                <Input placeholder={t("Enter product name")} />
              </Form.Item>
              <Form.Item
                label={t("Price")}
                name="price"
                rules={[
                  {
                    required: true,
                    message: t("Please enter price"),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("Enter prce")}
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Form.Item label={t("Store")} name="storeId">
                <StoreSelect placeholder={t("Choose store")} />
              </Form.Item>
              <Form.Item label={t("Description")} name="description">
                <UseEditor
                  content={description}
                  setContent={(value) => {
                    setDescription(value);
                    form.setFieldsValue({ description: value });
                  }}
                  setImages={setImageList}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <TopActionButtons
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
        backUrl="/product"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(accesses, "update", "product")}
      />
    </>
  );
};
export default ProdutActions;

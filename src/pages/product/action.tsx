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
import BottomActionButtons from "../../components/common/BottomActionButtons";
import StoreSelect from "../../components/StoreSelect";
import { useTranslation } from "react-i18next";
const ProdutActions = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [description, setDescription] = useState("");
  const [imageList, setImageList] = useState<File[]>([]);

  const { data = { data: {} }, isLoading } = useQuery({
    queryKey: ["productDetail", params.id],
    queryFn: () => ProductApi.getById(params.id as any),
    enabled: !!params.id,
  });
  useEffect(() => {
    if ((data as any)?.data?.description) {
      setDescription((data as any).data.description);
    }
  }, [data]);
  const initialValues = {
    productName: (data as any)?.data.productName || "",
    price: (data as any)?.data.price || "",
    description: (data as any)?.data.description || "",
    storeId: (data as any)?.data?.storeId || null,
  };
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await ProductApi.update(params.id as string, formD)
        : await ProductApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success("Save successfully");
        navigate("/product");
      } else toast.error(res.message);
    },
    onError: () => {
      toast.error("An error occurred");
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
  return (
    <>
      {!isLoading && (
        <Card>
          <Form
            layout="vertical"
            form={form}
            initialValues={initialValues}
            onFinish={onFinish}
          >
            <TopActionButtons backUrl="/product" />
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
            <BottomActionButtons backUrl="/product" />
          </Form>
        </Card>
      )}
    </>
  );
};
export default ProdutActions;

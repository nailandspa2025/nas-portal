/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Form, Row, Col, Input } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import UseEditor from "../../components/common/UserEditor";
import { PostApi } from "../../apis/article/post";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { buildFormData } from "../../utils/common/buildFormData";
import { uploadImage } from "../../utils/common/uploadImages";
import TopActionButtons from "../../components/common/TopActionButtons";
import BottomActionButtons from "../../components/common/BottomActionButtons";
import { useTranslation } from "react-i18next";
import AvatarUploader from "../../components/AvatarUploader";
const PostActions = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [content, setContent] = useState("");
  const [imageList, setImageList] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { data = { data: {} }, isLoading } = useQuery({
    queryKey: ["postDetail", params.id],
    queryFn: () => PostApi.getById(params.id as any),
    enabled: !!params.id,
  });
  useEffect(() => {
    if ((data as any)?.data?.content) {
      setContent((data as any).data.content);
    }
    if ((data as any)?.data?.avatar) {
      setImageUrl((data as any).data.avatar);
    }
  }, [data]);
  const initialValues = {
    title: (data as any)?.data.title || "",
    content: (data as any)?.data.content || "",
    description: (data as any)?.data.description || "",
  };
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await PostApi.update(params.id as string, formD)
        : await PostApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success("Save successfully");
        navigate("/post");
      } else toast.error(res.message);
    },
    onError: () => {
      toast.error("An error occurred");
    },
  });
  const onFinish = async (values: any) => {
    const updatedDescription = await uploadImage(content, imageList);
    const payload = {
      ...values,
      content: updatedDescription,
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
            <TopActionButtons backUrl="/post" />
            <Row gutter={32}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  label={t("Title")}
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: t("Please enter title!"),
                    },
                  ]}
                >
                  <Input placeholder={t("Enter title")} />
                </Form.Item>
                <Form.Item
                  label={t("Description")}
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: t("Please enter description!"),
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder={t("Enter description")}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Form.Item label={t("Avatar")} name="avatar">
                  <AvatarUploader
                    data={imageUrl || undefined}
                    placeholder="Choose avatar"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={t("Content")} name="content">
                  <UseEditor
                    content={content}
                    setContent={(value) => {
                      setContent(value);
                      form.setFieldsValue({ content: value });
                    }}
                    setImages={setImageList}
                  />
                </Form.Item>
              </Col>
            </Row>
            <BottomActionButtons backUrl="/post" />
          </Form>
        </Card>
      )}
    </>
  );
};
export default PostActions;

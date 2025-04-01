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
  const { data = { data: {} } } = useQuery({
    queryKey: ["postDetail", params.id],
    queryFn: () => PostApi.getById(params.id as any),
    enabled: !!params.id,
  });
  useEffect(() => {
    if ((data as any)?.data) {
      const value = (data as any).data;
      setImageUrl(value.avatar);
      setContent(value.content ?? "");
      form.setFieldsValue({
        title: value.title || "",
        content: value.content || "",
        description: value.description || "",
      });
    }
  }, [data, form]);

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
        toast.success(t("Save successfully"));
        navigate("/post");
      } else toast.error(t(res.message));
    },
    onError: () => {
      toast.error(t("An error occurred"));
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
  const handleSubmit = () => {
    form.submit();
  };
  return (
    <>
      <Row className="custom-row" justify="space-between" align="middle">
        <Col>
          <div className="custom-title">
            {params?.id ? t("Update post") : t("Create post")}
          </div>
        </Col>
        <Col>
          <TopActionButtons backUrl="/post" onSubmit={handleSubmit} />
        </Col>
      </Row>
      <Card style={{ padding: "10px 20px" }}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
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
                <Input.TextArea rows={5} placeholder={t("Enter description")} />
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
        </Form>
      </Card>
      <BottomActionButtons backUrl="/post" onSubmit={handleSubmit} />
    </>
  );
};
export default PostActions;

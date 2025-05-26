/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Form, Row, Col, Input, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import UseEditor from "../../components/common/UserEditor";
import { PostApi } from "../../apis/article/post";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { buildFormData } from "../../utils/common/buildFormData";
import { uploadImage } from "../../utils/common/uploadImages";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useTranslation } from "react-i18next";
import AvatarUploader from "../../components/AvatarUploader";
import { useSelector } from "react-redux";
import { checkAccessRight } from "../../utils/common/accessUtils";
const PostActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [content, setContent] = useState("");
  const [imageList, setImageList] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAvatar, setIsAvatar] = useState(false);
  const { data } = useQuery({
    queryKey: ["postDetail", params.id],
    queryFn: async () => {
      const res: any = await PostApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && data) {
      setImageUrl(data.avatar);
      setContent(data.content ?? "");
      form.setFieldsValue({
        title: data.title || "",
        content: data.content || "",
        description: data.description || "",
        type: data.type || null,
      });
    }
  }, [data, form, params.id]);

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
    if (params.id) {
      payload.id = params.id;
      payload.isAvatar = isAvatar;
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
            {params?.id ? t("Update post") : t("Create post")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/post"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(accesses, "update", "post")}
          />
        </Col>
      </Row>
      <Card>
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
                label={t("Type")}
                name="type"
                rules={[
                  {
                    required: true,
                    message: t("Please enter type!"),
                  },
                ]}
              >
                <Select placeholder={t("Select type")}>
                  <Select.Option value={1}>{t("Normal")}</Select.Option>
                  <Select.Option value={2}>{t("Trend")}</Select.Option>
                </Select>
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
                  onChange={() => setIsAvatar(true)}
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
      <TopActionButtons
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
        backUrl="/post"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(accesses, "update", "post")}
      />
    </>
  );
};
export default PostActions;

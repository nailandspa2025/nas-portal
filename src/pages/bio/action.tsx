/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Col,
  Row,
  Form,
  Input,
  Space,
  Switch,
  Upload,
  Button,
} from "antd";
import TopActionButtons from "../../components/common/TopActionButtons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { checkAccessRight } from "../../utils/common/accessUtils";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { buildFormData } from "../../utils/common/buildFormData";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DropdownApi } from "../../apis/dropdown/dropdown";
import { StoreBioApi } from "../../apis/catalog/bio";
import AvatarUploader from "../../components/AvatarUploader";
import { UploadOutlined } from "@ant-design/icons";
import RemoteSelect from "../../components/RemoteSelect";
import { useState } from "react";

const { TextArea } = Input;
const BioActions = () => {
  const accesses = useSelector((state: any) => state.auth.user?.accesses);
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [isFile, setIsFile] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);

  const { data } = useQuery({
    queryKey: ["categoryDetail", params.id],
    queryFn: async () => {
      const res: any = await StoreBioApi.getById(params.id as any);
      return res?.data || {};
    },
    enabled: !!params.id,
  });
  useEffect(() => {
    if (params.id && data) {
      setImageUrl(data.image);
      form.setFieldsValue({
        text: data.text || "",
        isActive: data.isActive ?? true,
        storeId: data.storeId || null,
      });
    }
  }, [data, form, params.id]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return params.id
        ? await StoreBioApi.update(params.id as any, formD)
        : await StoreBioApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Save successfully"));
        navigate("/bio");
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
    const payload = {
      ...values,
      isActive: values.isActive ?? true,
    };
    if (values.file?.fileList?.length > 0) {
      payload.file = values.file.fileList[0].originFileObj;
    } else {
      payload.file = null;
    }
    if (params.id) {
      payload.id = params.id;
      payload.isFile = isFile;
      payload.isImage = isImage;
    }
    console.log("Payload submitted: ", payload);
    mutation.mutate(payload);
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
            {params?.id ? t("Update bio") : t("Create bio")}
          </div>
        </Col>
        <Col flex="auto">
          <TopActionButtons
            backUrl="/bio"
            onSubmit={handleSubmit}
            hasSubmitPermission={checkAccessRight(accesses, "update", "bio")}
          />
        </Col>
      </Row>
      <Card>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col xs={24} sm={24}>
              <Form.Item
                label={t("Text")}
                name="text"
                dependencies={["image", "file"]}
                rules={[
                  {
                    validator: async (_, value) => {
                      const image = form.getFieldValue("image");
                      const file = form.getFieldValue("file");

                      // Nếu tất cả đều trống → báo lỗi
                      if (!value && !image && (!file || file.length === 0)) {
                        throw new Error(
                          t("Please enter text or upload image/file!")
                        );
                      }
                    },
                  },
                ]}
              >
                <TextArea rows={4} placeholder={t("Enter text")} />
              </Form.Item>
              <Form.Item label={t("Image")} name="image">
                <AvatarUploader
                  placeholder={t("Image ")}
                  data={imageUrl || undefined}
                  onChange={() => setIsImage(true)}
                />
              </Form.Item>
              <Form.Item label={t("File")}>
                <Form.Item name="file" valuePropName="file" noStyle>
                  <Upload
                    name="file"
                    maxCount={1}
                    fileList={fileList}
                    showUploadList={{ showRemoveIcon: false }}
                    beforeUpload={(file) => {
                      // chỉ lưu 1 file cuối cùng
                      setFileList([file]);
                      form.setFieldValue("file", file);
                      return false; // chặn upload tự động
                    }}
                    onRemove={() => {
                      setFileList([]);
                      form.setFieldValue("file", null);
                    }}
                    onChange={() => {
                      setIsFile(true);
                    }}
                    accept=".pdf,.doc,.docx,.zip,.rar,.txt,.xlsx,.xls"
                  >
                    {/* Ẩn nút "Select file" khi đã chọn 1 file */}
                    {fileList.length === 0 && (
                      <Button icon={<UploadOutlined />}>
                        {t("Select file")}
                      </Button>
                    )}
                  </Upload>
                </Form.Item>

                {/* Hiện nút Remove khi có file */}
                {fileList.length > 0 && (
                  <Button
                    type="link"
                    danger
                    style={{ paddingLeft: 0 }}
                    onClick={() => {
                      setFileList([]);
                      form.setFieldValue("file", null);
                    }}
                  >
                    {t("Remove file")}
                  </Button>
                )}
              </Form.Item>

              <Form.Item label={t("Store")} name="storeId">
                <RemoteSelect
                  placeholder={t("Select store)")}
                  fetchList={DropdownApi.getStores}
                  fetchById={DropdownApi.getStoreById}
                  labelKey="storeName"
                  valueKey="id"
                />
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
          </Row>
        </Form>
      </Card>
      <TopActionButtons
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
        backUrl="/bio"
        onSubmit={handleSubmit}
        hasSubmitPermission={checkAccessRight(accesses, "update", "banner")}
      />
    </>
  );
};
export default BioActions;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Upload, Button, Image, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
interface AvatarUploaderProps {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
}

const ImagesUploader: React.FC<AvatarUploaderProps> = ({
  value = [],
  onChange,
  placeholder = "Avatar",
}) => {
  const { t } = useTranslation();
  const [uploadKey, setUploadKey] = useState(0);

  const getPreviewUrl = (file: string | File) =>
    typeof file === "string" ? file : URL.createObjectURL(file);
  const handleUpload = (info: any) => {
    const newFiles = info.fileList
      .map((file: any) => file.originFileObj)
      .filter(
        (file: File | undefined) => file && file.type.startsWith("image/")
      );

    if (!newFiles.length) return;

    const existingFileSet = new Set(
      value.map((f: File) => `${f.name}-${f.size}`)
    );

    const uniqueFiles = newFiles.filter(
      (f: File) => !existingFileSet.has(`${f.name}-${f.size}`)
    );

    if (uniqueFiles.length < newFiles.length) {
      toast.warning("Some duplicate images were skipped!");
    }
    const updatedValue = [...value, ...uniqueFiles];
    onChange?.(updatedValue);
    setUploadKey((prev) => prev + 1);
  };

  const handleRemoveImage = (index: number) => {
    const newValue = value.filter((_: any, i: any) => i !== index);
    onChange?.(newValue);
  };

  const handleClearAll = () => {
    onChange?.([]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {value?.length > 0 ? (
        <Space wrap style={{ display: "flex", gap: "10px" }}>
          {value.map((item: any, index: number) => (
            <div key={index} style={{ position: "relative" }}>
              <Image
                src={getPreviewUrl(item)}
                alt={t(placeholder)}
                width={120}
                height={120}
                style={{
                  objectFit: "cover",
                  border: "1px solid #ddd",
                  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                }}
                fallback="https://via.placeholder.com/150"
              />
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                }}
              />
            </div>
          ))}
        </Space>
      ) : (
        <div
          style={{
            width: "100%",
            height: 150,
            borderRadius: "8px",
            backgroundColor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed #ccc",
            color: "#888",
            fontSize: 13,
          }}
        >
          {placeholder}
        </div>
      )}

      <Space
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <Upload
          key={uploadKey}
          name="avatar"
          showUploadList={false}
          multiple
          beforeUpload={() => false}
          onChange={handleUpload}
          accept="image/png, image/jpeg, image/gif"
        >
          <Button type="primary" ghost icon={<PlusOutlined />}>
            {t("Choose images")}
          </Button>
        </Upload>

        {value?.length > 1 && (
          <Button
            type="primary"
            danger
            ghost
            icon={<DeleteOutlined />}
            onClick={handleClearAll}
          >
            {t("Remove")}
          </Button>
        )}
      </Space>
    </div>
  );
};

export default ImagesUploader;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Upload, Button, Image, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

interface AvatarUploaderProps {
  data?: string;
  onChange?: (value: any) => void;
  placeholder?: string;
}
const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  data,
  onChange,
  placeholder = "Ảnh đại diện",
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(data || null);
  useEffect(() => {
    setImageUrl(data || null);
  }, [data]);
  const handleUpload = (info: any) => {
    const file = info.file;
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Only image files can be selected!");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);
    onChange?.(file);
  };
  const handleRemoveImage = () => {
    setImageUrl(null);
    onChange?.(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={placeholder}
          width="100%"
          height="auto"
          style={{
            aspectRatio: "16 / 9",
            borderRadius: "8px",
            objectFit: "cover",
            border: "1px solid #ddd",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          }}
          fallback="https://via.placeholder.com/150"
        />
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
          name="avatar"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleUpload}
          accept="image/png, image/jpeg, image/gif"
        >
          <Button type="primary" ghost icon={<PlusOutlined />}>
            Choose image
          </Button>
        </Upload>
        {imageUrl && (
          <Button
            type="primary"
            danger
            ghost
            icon={<DeleteOutlined />}
            onClick={handleRemoveImage}
          >
            Remove
          </Button>
        )}
      </Space>
    </div>
  );
};

export default AvatarUploader;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Upload, Button, Image, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

interface AvatarUploaderProps {
  data?: any;
  onChange?: (value: string[]) => void;
  placeholder?: string;
}
const ImagesUploader: React.FC<AvatarUploaderProps> = ({
  data = [],
  onChange,
  placeholder = "Ảnh đại diện",
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>(data || []);
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setImageUrls(data);
    }
  }, [data]);
  const handleUpload = (info: any) => {
    const files = info.fileList.map((file: any) => file.originFileObj);
    if (!files.length) return;
    const newImages = files
      .filter((file: File) => file.type.startsWith("image/"))
      .map((file: File) => URL.createObjectURL(file));
    if (newImages.length !== files.length) {
      toast.error("Some files are not images and have been ignored!");
    }
    setImageUrls(newImages);
    onChange?.(files);
  };
  const handleRemoveImage = (index: number) => {
    const newImageList = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageList);
    onChange?.(newImageList);
  };
  const handleClearAll = () => {
    setImageUrls([]);
    onChange?.([]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {imageUrls.length > 0 ? (
        <Space wrap style={{ display: "flex", gap: "10px" }}>
          {imageUrls.map((url, index) => (
            <div key={index} style={{ position: "relative" }}>
              <Image
                src={url}
                alt={placeholder}
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
          multiple
          beforeUpload={() => false}
          onChange={handleUpload}
          accept="image/png, image/jpeg, image/gif"
        >
          <Button type="primary" ghost icon={<PlusOutlined />}>
            Choose images
          </Button>
        </Upload>
        {imageUrls.length > 1 && (
          <Button
            type="primary"
            danger
            ghost
            icon={<DeleteOutlined />}
            onClick={handleClearAll}
          >
            Remove
          </Button>
        )}
      </Space>
    </div>
  );
};

export default ImagesUploader;

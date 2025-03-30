/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Input, Form, Button } from "antd";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthApi } from "../apis/auth/auth";
import { toast } from "react-toastify";
const ChangePasswordModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const changePassword = useMutation({
    mutationFn: async (values) => {
      return await AuthApi.changePassword(values);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success("Save successfully");
        form.resetFields();
        onClose();
      } else {
        toast.error(res.message);
      }
    },
    onError: () => {
      toast.error("An error occurred");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = async () => {
    const values = await form.validateFields();
    changePassword.mutate(values);
  };
  return (
    <Modal
      title="Change Password"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Change Password
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[
            { required: true, message: "Please enter your current password!" },
          ]}
        >
          <Input.Password placeholder="Enter current password" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ required: true, message: "Please enter a new password!" }]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;

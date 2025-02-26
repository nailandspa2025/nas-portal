import React from "react";
import { Button, Modal } from "antd";

interface ModalConfirmProps {
  content?: string;
  title?: string;
  openModal?: boolean;
  setOpenModal: (open: boolean) => void;
  loading?: boolean;
  onChange?: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  content = "Bạn chắc chắn muốn xóa dữ liệu?",
  title = "Xóa",
  openModal = false,
  setOpenModal,
  loading = false,
  onChange = () => {},
}) => {
  return (
    <Modal
      title={title}
      open={openModal}
      onCancel={() => setOpenModal(false)}
      footer={[
        <Button
          key="cancel"
          type="primary"
          danger
          onClick={() => setOpenModal(false)}
        >
          Hủy bỏ
        </Button>,
        <Button
          key="confirm"
          type="primary"
          loading={loading}
          onClick={onChange}
        >
          Đồng ý
        </Button>,
      ]}
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ModalConfirm;

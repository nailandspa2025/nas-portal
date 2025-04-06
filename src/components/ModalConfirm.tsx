import React from "react";
import { Button, Modal } from "antd";
import { useTranslation } from "react-i18next";
interface ModalConfirmProps {
  content?: string;
  title?: string;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  loading?: boolean;
  onChange?: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  content = "Are you sure you want to delete the data?",
  title = "Delete",
  openModal = false,
  setOpenModal,
  loading = false,
  onChange = () => {},
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={t(title)}
      open={openModal}
      onCancel={() => setOpenModal(false)}
      footer={[
        <Button
          key="cancel"
          type="primary"
          danger
          onClick={() => setOpenModal(false)}
        >
          {t("Cancel")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onChange}
        >
          {t("Agree")}
        </Button>,
      ]}
    >
      <p>{t(content)}</p>
    </Modal>
  );
};

export default ModalConfirm;

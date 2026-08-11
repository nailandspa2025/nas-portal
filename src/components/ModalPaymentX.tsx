import React, { useMemo, useState } from "react";
import { Modal, Form, Row, Col, Button } from "antd";

import TechnicianRevenue from "./TechnicianRevenue";
import PaymentSummary from "./PaymentSummary";
import PaymentMethod from "./PaymentMethod";
import CustomerInformation from "./CustomerInformation";
import SplitTipModal from "./SplitTipModal";

interface Props {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  loading?: boolean;
  data: any;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const ModalPayment: React.FC<Props> = ({
  openModal,
  setOpenModal,
  loading,
  data,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const [tip, setTip] = useState(0);

  const [splitOpen, setSplitOpen] = useState(false);

  const serviceAmount = useMemo(() => {
    if (!data?.technicians) return 0;

    return data.technicians.reduce((sum: number, t: any) => {
      return (
        sum +
        t.services.reduce((s: number, x: any) => s + Number(x.priceTo || 0), 0)
      );
    }, 0);
  }, [data]);

  const discount = Form.useWatch("discountAmount", form) || 0;

  const surcharge = Form.useWatch("surchargeAmount", form) || 0;

  const customerPaid = Form.useWatch("customerPaid", form) || 0;

  const subtotal = Math.max(serviceAmount - discount + surcharge, 0);

  const total = subtotal + tip;

  const change = Math.max(customerPaid - total, 0);

  const amount = Math.max(total - customerPaid, 0);

  const submit = (values: any) => {
    onSubmit({
      ...values,

      bookingId: data.id,

      serviceAmount,

      discountAmount: discount,

      surchargeAmount: surcharge,

      customerPaid,

      changeAmount: change,

      amount,

      tipAmount: tip,
    });
  };

  return (
    <>
      <Modal
        width={1200}
        open={openModal}
        footer={null}
        destroyOnClose
        centered
        title={`Booking #${data?.id}`}
        onCancel={() => setOpenModal(false)}
      >
        <Form layout="vertical" form={form} onFinish={submit}>
          <Row gutter={20}>
            <Col span={15}>
              <TechnicianRevenue technicians={data?.technicians} />
            </Col>

            <Col span={9}>
              {/* <PaymentSummary
                serviceAmount={serviceAmount}
                discount={discount}
                surcharge={surcharge}
                subtotal={subtotal}
                tip={tip}
                total={total}
                amount={amount}
                technicians={data?.technicians}
                onTipChange={setTip}
                onSplitTip={() => setSplitOpen(true)}
              /> */}

              <div style={{ marginTop: 16 }}>
                <PaymentMethod form={form} data={data} />
              </div>

              <div style={{ marginTop: 16 }}>
                <CustomerInformation />
              </div>
            </Col>
          </Row>

          <Row justify="end" style={{ marginTop: 24 }}>
            <Col span={9}>
              <Button
                block
                size="large"
                type="primary"
                loading={loading}
                onClick={() => form.submit()}
              >
                Xác nhận thanh toán
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* <SplitTipModal
        open={splitOpen}
        onClose={() => setSplitOpen(false)}
        technicians={data?.technicians}
        totalTip={tip}
      /> */}
    </>
  );
};

export default ModalPayment;

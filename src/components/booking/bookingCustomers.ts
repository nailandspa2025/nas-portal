/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";

// Helper cho khối "Khách & thợ" của form booking (xem BookingCustomersEditor).

export type BookingServiceLine = { serviceId: number; quantity: number };
export type BookingCustomerLine = {
  technicianId: number;
  services: BookingServiceLine[];
};

/** Chi tiết booking từ API (technicians[].services[]) -> giá trị form. */
export const toFormCustomers = (technicians?: any[]): BookingCustomerLine[] =>
  (technicians ?? []).map((tech: any) => {
    const counts = new Map<number, number>();
    (tech.services ?? []).forEach((s: any) => {
      const id = Number(s?.id ?? s?.serviceId);
      if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
    });
    return {
      technicianId: Number(tech.technicianId),
      services: Array.from(counts, ([serviceId, quantity]) => ({
        serviceId,
        quantity,
      })),
    };
  });

/** Giá trị form -> payload API: ServiceId lặp lại theo số lượt. */
export const toTechniciansPayload = (customers?: BookingCustomerLine[]) =>
  (customers ?? []).map((c) => ({
    technicianId: c.technicianId,
    serviceIds: c.services.flatMap((s) =>
      Array.from({ length: Math.max(1, s.quantity) }, () => s.serviceId),
    ),
  }));

/**
 * Giá trị form booking -> payload gửi API tạo/sửa booking.
 * Bỏ technicianIds/serviceIds/number cũ; Number = số khách = số thợ.
 */
export const toBookingPayload = (values: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { technicians, technicianIds, serviceIds, number, ...rest } = values;
  return {
    ...rest,
    userId: rest.userId != null ? String(rest.userId) : null,
    bookingDate: rest.bookingDate
      ? dayjs(rest.bookingDate).format("YYYY-MM-DD")
      : null,
    bookingTime: rest.bookingTime
      ? dayjs(rest.bookingTime).format("HH:mm:ss")
      : null,
    technicians: toTechniciansPayload(technicians),
    number: technicians?.length ?? 0,
  };
};

/** Rule cho <Form.Item name="technicians">. */
export const bookingCustomersRule = (t: (key: string) => string) => ({
  validator: async (_: unknown, value?: BookingCustomerLine[]) => {
    if (!value?.length) {
      throw new Error(t("Please choose technician"));
    }
    const ids = value.map((c) => c.technicianId);
    if (new Set(ids).size !== ids.length) {
      throw new Error(t("Each technician can only serve one customer"));
    }
  },
});

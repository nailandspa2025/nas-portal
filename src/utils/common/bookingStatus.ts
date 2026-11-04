// Trạng thái booking — khớp Order.Domain.Enums.BookingStatus (nas-order-api).
export const BookingStatus = {
  Pending: 1,
  Completed: 2,
  Cancelled: 3,
  InProgress: 4,
  CheckIn: 5,
  Close: 6,
} as const;

// Booking đã kết thúc: không sửa, không thanh toán.
const FINISHED: number[] = [
  BookingStatus.Completed,
  BookingStatus.Cancelled,
  BookingStatus.Close,
];

/** Completed / Cancelled / Close: không cho sửa. */
export const isBookingLocked = (status?: number | null) =>
  FINISHED.includes(Number(status));

/** Chỉ thanh toán booking còn mở: Pending / CheckIn / InProgress. */
export const canPayBooking = (status?: number | null) =>
  status != null && !FINISHED.includes(Number(status));

/** Huỷ chỉ áp dụng cho Pending (backend CancelBooking). */
export const canCancelBooking = (status?: number | null) =>
  Number(status) === BookingStatus.Pending;

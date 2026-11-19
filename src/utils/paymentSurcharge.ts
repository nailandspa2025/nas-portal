// Poynt (paylink): phụ phí thẻ credit do GoDaddy tính (eligible-fees, SE-Poynt mục 11),
// không dùng cấu hình phí NAS của payment provider (tránh thu phí 2 lần)
export const GODADDY_SURCHARGE_METHODS = [10];

// POS Payment: lệnh gửi xuống máy không có field phí, nên phí NAS được cộng sẵn vào số tiền gửi xuống máy,
// chỉ khi nhân viên chọn khách trả bằng thẻ credit (luật không cho thu phụ phí thẻ debit)
export const CREDIT_ONLY_SURCHARGE_METHODS = [11];

export type PosCardType = "credit" | "debit";

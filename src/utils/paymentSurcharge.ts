// Poynt (paylink) và POS Payment: phụ phí thẻ credit do GoDaddy tính (eligible-fees / máy POS),
// không dùng cấu hình phí NAS của payment provider (tránh thu phí 2 lần)
export const GODADDY_SURCHARGE_METHODS = [10, 11];

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Trang thanh toán Poynt public (khách quét QR từ modal thanh toán booking).
 * Dữ liệu và charge đi qua nas-paylink (VITE_PAYLINK_URL); số thẻ nhập trong iframe Poynt Collect,
 * portal chỉ nhận nonce.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Divider,
  Result,
  Skeleton,
  Typography,
} from "antd";

const { Title, Text } = Typography;

const PAYLINK_URL = (
  (import.meta.env.VITE_PAYLINK_URL as string | undefined) || ""
).replace(/\/$/, "");

type PaylinkInfo = {
  id: string;
  amount: number; // cents
  currency: string;
  description?: string;
  reference?: string;
  merchantName?: string;
  status: "ACTIVE" | "PAID" | "CANCELLED" | "EXPIRED";
  paidAt?: string;
  transactionId?: string;
  collect: {
    sdkUrl: string;
    businessId: string;
    storeId?: string | null;
    applicationId: string;
  };
};

type PaidInfo = {
  transactionId?: string;
  paidAt?: string;
  card?: { type?: string; last4?: string };
};

type View =
  | { kind: "loading" }
  | { kind: "form" }
  | { kind: "paid"; data: PaidInfo }
  | { kind: "closed"; title: string; text: string };

const FIELD_NAMES: Record<string, string> = {
  firstName: "first name",
  lastName: "last name",
  cardNumber: "card number",
  expiryDate: "expiration date",
  cvc: "CVV",
  zipCode: "ZIP code",
  zip: "ZIP code",
  emailAddress: "email",
};

const joinList = (items: string[]) =>
  items.length > 1
    ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
    : items[0];

// Lỗi kiểm tra form: Poynt gửi `error` (có danh sách field) rồi `nonce_error` chung chung
const validationMessage = (err: any): string | null => {
  const fields = [
    ...new Set<string>(
      (err?.fields || []).map((f: string) => FIELD_NAMES[f] || f),
    ),
  ];
  if (!fields.length) return null;
  return err.type === "missing_fields"
    ? `Please enter your ${joinList(fields)}.`
    : `Please check your ${joinList(fields)}.`;
};

const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("load failed"));
    document.head.appendChild(s);
  });

const FONT = 'Inter, -apple-system, "Segoe UI", Roboto, sans-serif';

const PoyntPayment = () => {
  const { id = "" } = useParams();
  const [link, setLink] = useState<PaylinkInfo | null>(null);
  const [view, setView] = useState<View>({ kind: "loading" });
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const collectRef = useRef<any>(null);
  const detailShownRef = useRef(false);

  const money = link
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: link.currency,
      }).format(link.amount / 100)
    : "";
  const merchant = link?.merchantName || "the store";

  const collectError = useCallback((e: any) => {
    console.error("[collect]", JSON.stringify(e));
    const err = e?.data?.error;
    if (err) {
      // Lỗi phát ra lúc đang gõ thì để form tự báo trên từng ô
      if (err.source && err.source !== "submit") return;
      setPaying(false);
      detailShownRef.current = true;
      setError(
        validationMessage(err) ||
          "Your card details are invalid. Please check and try again.",
      );
      return;
    }
    setPaying(false);
    if (e?.data?.code === "validation_error" && detailShownRef.current) return;
    setError(
      e?.data?.code === "validation_error"
        ? "Your card details are invalid. Please check and try again."
        : "We couldn't process your card. Please try again or use a different card.",
    );
  }, []);

  const onNonce = useCallback(
    async (event: any) => {
      const nonce = event?.nonce || event?.data?.nonce;
      const email = event?.emailAddress || event?.data?.emailAddress;
      try {
        const res = await axios.post(
          `${PAYLINK_URL}/api/pay/${encodeURIComponent(id)}/pay`,
          { nonce, email },
          { validateStatus: () => true },
        );
        if (res.status === 200 && res.data?.approved) {
          setView({ kind: "paid", data: res.data });
        } else {
          setPaying(false);
          setError(
            res.data?.error ||
              "Your payment was declined. Please check your card or use a different card.",
          );
        }
      } catch {
        setPaying(false);
        setError("Connection lost. Please try again.");
      }
    },
    [id],
  );

  // 1. Lấy thông tin paylink
  useEffect(() => {
    if (!PAYLINK_URL) {
      setView({
        kind: "closed",
        title: "Not configured",
        text: "VITE_PAYLINK_URL is missing for the payment page.",
      });
      return;
    }
    let cancelled = false;
    axios
      .get<PaylinkInfo>(`${PAYLINK_URL}/api/pay/${encodeURIComponent(id)}`)
      .then(({ data }) => {
        if (cancelled) return;
        setLink(data);
        if (data.status === "PAID") {
          setView({ kind: "paid", data });
        } else if (data.status !== "ACTIVE") {
          const reason =
            data.status === "EXPIRED"
              ? "This payment link has expired."
              : "This payment link has been cancelled.";
          setView({
            kind: "closed",
            title: "Payment unavailable",
            text: `${reason} Please contact ${data.merchantName || "the store"} for a new link.`,
          });
        } else {
          setView({ kind: "form" });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setView({
          kind: "closed",
          title: "Link not found",
          text: "This payment link does not exist or has been removed.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (link) document.title = `Pay ${money} – ${merchant}`;
  }, [link, money, merchant]);

  // 2. Nạp Poynt Collect và mount form thẻ khi paylink còn ACTIVE
  useEffect(() => {
    if (view.kind !== "form" || !link || collectRef.current) return;
    loadScript(link.collect.sdkUrl)
      .then(() => {
        const opts: Record<string, string> = {
          businessId: link.collect.businessId,
          applicationId: link.collect.applicationId,
        };
        if (link.collect.storeId) opts.storeId = link.collect.storeId;
        const collect = new (window as any).TokenizeJs(opts);
        collectRef.current = collect;
        collect.mount("poynt-card-element", document, {
          paymentMethods: ["card"],
          defaultPaymentMethod: "card",
          displayComponents: {
            firstName: true,
            lastName: true,
            emailAddress: false,
            zipCode: true,
            labels: true,
          },
          labels: {
            firstName: "First name",
            lastName: "Last name",
            cardNumber: "Card number",
            expiration: "Expiration",
            expiryDate: "Expiration",
            cvc: "CVV",
            zip: "ZIP code",
            zipCode: "ZIP code",
          },
          placeholders: {
            firstName: "First name",
            lastName: "Last name",
            cardNumber: "1234 1234 1234 1234",
            zip: "ZIP code",
            zipCode: "ZIP code",
          },
          customCss: {
            container: `font-family: ${FONT}; color: #1c1917; flex-flow: row wrap; gap: 0 4%;`,
            inputLabel: `font-family: ${FONT}; font-size: 13px; font-weight: 500; color: #44403c; text-transform: none; letter-spacing: 0; margin: 0 0 6px;`,
            inputDefault: `font-family: ${FONT}; font-size: 15px; color: #1c1917; height: 44px; padding: 0 12px; border: 1px solid #d9d9d9; border-radius: 8px; background: #fff; &:focus { border-color: #1677ff; box-shadow: 0 0 0 2px rgba(22,119,255,.15); outline: none; } &[data-error="true"] { border-color: #ff4d4f; background: #fff2f0; }`,
            requiredMark: "color: #ff4d4f; margin-left: 2px;",
            rowFirstName:
              "flex: 1 0 48%; min-width: 120px; padding: 0; margin-bottom: 14px;",
            rowLastName:
              "flex: 1 0 48%; min-width: 120px; padding: 0; margin-bottom: 14px;",
            rowCardNumber: "flex: 100%; padding: 0; margin-bottom: 14px;",
            rowExpiration:
              "flex: 1 0 30%; min-width: 90px; padding: 0; margin-bottom: 14px;",
            rowCVV:
              "flex: 1 0 30%; min-width: 80px; padding: 0; margin-bottom: 14px;",
            rowZip:
              "flex: 1 0 30%; min-width: 90px; padding: 0; margin-bottom: 14px;",
          },
          iFrame: { width: "100%", height: "262px", border: "0px" },
        });
        collect.on("ready", () => setReady(true));
        collect.on("nonce", onNonce);
        collect.on("nonce_error", collectError);
        collect.on("error", collectError);
      })
      .catch(() =>
        setError("Could not load the payment form. Please reload the page."),
      );
  }, [view.kind, link, onNonce, collectError]);

  const handlePay = () => {
    if (!collectRef.current) return;
    setError(null);
    detailShownRef.current = false;
    setPaying(true);
    collectRef.current.getNonce({}).catch((e: any) => collectError(e));
  };

  const receipt = (data: PaidInfo) => (
    <Descriptions bordered size="small" column={1} style={{ marginTop: 8 }}>
      <Descriptions.Item label="Amount">{money}</Descriptions.Item>
      <Descriptions.Item label="Description">
        {link?.description || "Payment"}
      </Descriptions.Item>
      {data.card?.last4 && (
        <Descriptions.Item label="Card">
          {`${data.card.type || "Card"} •••• ${data.card.last4}`}
        </Descriptions.Item>
      )}
      {data.paidAt && (
        <Descriptions.Item label="Paid at">
          {fmtDate(data.paidAt)}
        </Descriptions.Item>
      )}
      {data.transactionId && (
        <Descriptions.Item label="Transaction ID">
          <Text code>{data.transactionId}</Text>
        </Descriptions.Item>
      )}
    </Descriptions>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <Card style={{ width: "100%", maxWidth: 480, borderRadius: 16 }}>
        {view.kind === "loading" && <Skeleton active paragraph={{ rows: 6 }} />}

        {view.kind === "closed" && (
          <Result status="warning" title={view.title} subTitle={view.text} />
        )}

        {view.kind === "paid" && (
          <Result
            status="success"
            title="Payment successful"
            subTitle={`Thank you! ${merchant} has received ${money}.`}
            extra={receipt(view.data)}
          />
        )}

        {view.kind === "form" && link && (
          <>
            <Text type="secondary">{merchant}</Text>
            <Title level={2} style={{ margin: "4px 0 0" }}>
              {money}
            </Title>
            <Text>{link.description || "Payment"}</Text>
            {link.reference && (
              <div>
                <Text type="secondary">Reference: {link.reference}</Text>
              </div>
            )}
            <Divider />
            {!ready && <Skeleton active paragraph={{ rows: 5 }} />}
            <div
              id="poynt-card-element"
              style={{ display: ready ? "block" : "none" }}
            />
            {error && (
              <Alert
                type="error"
                showIcon
                message={error}
                style={{ marginBottom: 12 }}
              />
            )}
            <Button
              type="primary"
              size="large"
              block
              loading={paying}
              disabled={!ready}
              onClick={handlePay}
            >
              {paying ? "Processing…" : `Pay ${money}`}
            </Button>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Your card details are encrypted and processed by GoDaddy Payments (Poynt).
              </Text>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default PoyntPayment;

/**
 * UZALINK M-Pesa client.
 *
 * The browser only talks to the public UzaLink M-Pesa API route.
 * Daraja consumer credentials, secrets and passkeys must remain on the server.
 */
const MPESA_API_BASE = (
  import.meta.env.VITE_UZALINK_MPESA_API || "https://uzalink.onrender.com/uzalink/mpesa"
).replace(/\/$/, "");

export type UzaLinkOrder = {
  orderId: string;
  status: "pending" | "paid" | "failed" | string;
  receipt?: string | null;
  failureReason?: string | null;
  amount?: number;
  phone?: string;
};

export type StkPushResponse = {
  ok?: boolean;
  message?: string;
  order: UzaLinkOrder;
};

function normalizeKenyanPhone(value: string) {
  let phone = String(value || "").replace(/[\s\-+]/g, "");
  if (phone.startsWith("0")) phone = `254${phone.slice(1)}`;
  if (/^[17]\d{8}$/.test(phone)) phone = `254${phone}`;
  return /^254[17]\d{8}$/.test(phone) ? phone : null;
}

export async function startMpesaPayment(params: {
  phone: string;
  amount: number;
  productName: string;
}) {
  const phone = normalizeKenyanPhone(params.phone);
  if (!phone) throw new Error("Enter a valid Kenyan M-Pesa number.");

  const response = await fetch(`${MPESA_API_BASE}/stk-push`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone,
      amount: Math.round(params.amount),
      productName: params.productName,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as Partial<StkPushResponse> & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error || data.message || "Could not start M-Pesa payment.");
  }
  if (!data.order?.orderId) {
    throw new Error("M-Pesa server did not return an order ID.");
  }

  return data as StkPushResponse;
}

export async function getMpesaOrder(orderId: string) {
  const response = await fetch(
    `${MPESA_API_BASE}/order-status/${encodeURIComponent(orderId)}`,
    { method: "GET" },
  );

  const data = (await response.json().catch(() => ({}))) as {
    order?: UzaLinkOrder;
    error?: string;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(data.error || data.message || "Unable to check M-Pesa payment.");
  }
  if (!data.order) throw new Error("M-Pesa server returned no order status.");

  return data.order;
}

export { normalizeKenyanPhone };

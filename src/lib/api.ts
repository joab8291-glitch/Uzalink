const API_BASE = (
  import.meta.env.VITE_UZALINK_API ||
  "https://uzalink-backend.onrender.com"
).replace(/\/$/, "");

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;

  console.log("[UzaLink API] Request:", {
    method: init.method || "GET",
    url,
  });

  try {
    const response = await fetch(url, {
      ...init,
      credentials: "include",
      headers: {
        ...(init.body instanceof FormData
          ? {}
          : {
              "Content-Type": "application/json",
            }),
        ...(init.headers || {}),
      },
    });

    console.log("[UzaLink API] Response:", {
      status: response.status,
      ok: response.ok,
      url,
    });

    const text = await response.text();

    let data: any = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {
        raw: text,
      };
    }

    if (!response.ok) {
      console.error("[UzaLink API] Server error:", {
        status: response.status,
        data,
        url,
      });

      throw new Error(
        data?.error ||
          data?.message ||
          `Request failed with status ${response.status}`
      );
    }

    return data as T;
  } catch (error: any) {
    console.error("[UzaLink API] Fetch failed:", {
      url,
      error: error?.message || error,
      name: error?.name,
    });

    if (error instanceof TypeError) {
      throw new Error(
        `Unable to connect to UzaLink backend. Check CORS/API URL: ${url}`
      );
    }

    throw error;
  }
}

export const api = {
  me: () =>
    request<any>("/api/auth/me"),

  requestMagic: (body: any) =>
    request<any>("/api/auth/magic-link", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  verifyMagic: (token: string) =>
    request<any>("/api/auth/verify-magic-link", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  logout: () =>
    request<any>("/api/auth/logout", {
      method: "POST",
    }),

  createProduct: (body: FormData) =>
    request<any>("/api/products", {
      method: "POST",
      body,
    }),

  product: (code: string) =>
    request<any>(
      `/api/products/${encodeURIComponent(code)}`
    ),

  products: () =>
    request<any>("/api/products"),

  createOrder: (body: any) =>
    request<any>("/api/orders", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  payOrder: (id: string) =>
    request<any>(`/api/orders/${encodeURIComponent(id)}/pay`, {
      method: "POST",
    }),

  order: (id: string) =>
    request<any>(
      `/api/orders/${encodeURIComponent(id)}`
    ),

  downloadAccess: (id: string, phone: string) =>
    request<{ url: string; expiresInSeconds?: number }>(
      `/api/orders/${encodeURIComponent(id)}/download-access`,
      {
        method: "POST",
        body: JSON.stringify({ phone }),
      }
    ),

  sellerDashboard: () =>
    request<any>("/api/seller/dashboard"),

  sellerProfile: (body: any) =>
    request<any>("/api/seller/profile", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  payout: (amountCents: number) =>
    request<any>("/api/seller/payout", {
      method: "POST",
      body: JSON.stringify({ amountCents }),
    }),

  /*
   * ---------------------------------------------------------
   * ADMIN
   * ---------------------------------------------------------
   */

  adminDashboard: () =>
    request<any>("/api/admin/dashboard"),

  adminOrders: () =>
    request<any>("/api/admin/orders"),

  adminProductStatus: (
    id: string,
    status: string
  ) =>
    request<any>(
      "/api/admin/products/" +
        encodeURIComponent(id) +
        "/status",
      {
        method: "POST",
        body: JSON.stringify({ status }),
      }
    ),

  /*
   * Create a payout for an author/seller.
   *
   * amountCents:
   * Example:
   * KSh 500 = 50000
   */
  adminCreatePayout: (
    sellerId: string,
    amountCents: number
  ) =>
    request<any>("/api/admin/payouts", {
      method: "POST",
      body: JSON.stringify({
        sellerId,
        amountCents,
      }),
    }),

  /*
   * Send an existing payout through M-Pesa B2C.
   */
  adminSendPayout: (id: string) =>
    request<any>(
      `/api/admin/payouts/${encodeURIComponent(
        id
      )}/send-mpesa`,
      {
        method: "POST",
      }
    ),

  /*
   * Legacy/manual payout completion endpoint.
   *
   * Kept here for compatibility with existing backend
   * functionality, although the new dashboard workflow
   * uses adminSendPayout() instead.
   */
  adminMarkPayoutPaid: (
    id: string,
    reference?: string
  ) =>
    request<any>(
      "/api/admin/payouts/" +
        encodeURIComponent(id) +
        "/mark-paid",
      {
        method: "POST",
        body: JSON.stringify({
          reference,
        }),
      }
    ),

  subscribe: (phone: string) =>
    request<any>("/api/subscriptions/start", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
};

export { API_BASE };

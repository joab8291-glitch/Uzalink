const API_BASE = (
  import.meta.env.VITE_UZALINK_API ||
  "https://uzalink-backend.onrender.com"
).replace(/\/$/, "");

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;

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

  const text = await response.text();

  let data: any = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data as T;
}

export const api = {
  me: () => request<any>("/api/auth/me"),

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

  premiumRequest: (identity: string) =>
    request<any>("/api/auth/premium/request", {
      method: "POST",
      body: JSON.stringify({ identity }),
    }),

  premiumVerify: (identity: string, code: string) =>
    request<any>("/api/auth/premium/verify", {
      method: "POST",
      body: JSON.stringify({ identity, code }),
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
    request<any>(
      `/api/orders/${encodeURIComponent(id)}/pay`,
      {
        method: "POST",
      }
    ),

  order: (id: string) =>
    request<any>(
      `/api/orders/${encodeURIComponent(id)}`
    ),

  downloadAccess: (id: string, phone: string) =>
    request<{
      url: string;
      expiresInSeconds?: number;
    }>(
      `/api/orders/${encodeURIComponent(
        id
      )}/download-access`,
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

  adminTestRequest: (phone: string) =>
    request<any>("/api/auth/admin/test/request", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),

  adminTestVerify: (phone: string, code: string) =>
    request<any>("/api/auth/admin/test/verify", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    }),

  adminDashboard: () =>
    request<any>("/api/admin/dashboard"),

  adminOrders: () =>
    request<any>("/api/admin/orders"),

  adminProductStatus: (
    id: string,
    status: string
  ) =>
    request<any>(
      `/api/admin/products/${encodeURIComponent(
        id
      )}/status`,
      {
        method: "POST",
        body: JSON.stringify({ status }),
      }
    ),

  adminDeleteProduct: (id: string) =>
    request<any>(
      `/api/admin/products/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      }
    ),

  adminFeatureProduct: (
    id: string,
    featured: boolean
  ) =>
    request<any>(
      `/api/admin/products/${encodeURIComponent(
        id
      )}/featured`,
      {
        method: "PATCH",
        body: JSON.stringify({ featured }),
      }
    ),

  adminFeatureSeller: (
    id: string,
    featured: boolean
  ) =>
    request<any>(
      `/api/admin/sellers/${encodeURIComponent(
        id
      )}/featured`,
      {
        method: "PATCH",
        body: JSON.stringify({ featured }),
      }
    ),

  adminVerifySeller: (
    id: string,
    verified: boolean,
    note?: string
  ) =>
    request<any>(
      `/api/admin/sellers/${encodeURIComponent(
        id
      )}/verification`,
      {
        method: "PATCH",
        body: JSON.stringify({
          verified,
          note,
        }),
      }
    ),

  adminReviews: () =>
    request<any>("/api/admin/reviews"),

  adminReviewStatus: (
    id: string,
    approved: boolean
  ) =>
    request<any>(
      `/api/admin/reviews/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ approved }),
      }
    ),

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

  adminSendPayout: (id: string) =>
    request<any>(
      `/api/admin/payouts/${encodeURIComponent(
        id
      )}/send-mpesa`,
      {
        method: "POST",
      }
    ),

  adminMarkPayoutPaid: (
    id: string,
    reference?: string
  ) =>
    request<any>(
      `/api/admin/payouts/${encodeURIComponent(
        id
      )}/mark-paid`,
      {
        method: "POST",
        body: JSON.stringify({ reference }),
      }
    ),

  subscribe: (phone: string) =>
    request<any>("/api/subscriptions/start", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),

  engagementReviews: (code: string) =>
    request<any>(
      `/api/engagement/products/${encodeURIComponent(
        code
      )}/reviews`
    ),

  addReview: (code: string, body: any) =>
    request<any>(
      `/api/engagement/products/${encodeURIComponent(
        code
      )}/reviews`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    ),

  wishlist: () =>
    request<any>("/api/engagement/wishlist"),

  addWishlist: (code: string) =>
    request<any>(
      `/api/engagement/wishlist/${encodeURIComponent(
        code
      )}`,
      {
        method: "POST",
      }
    ),

  removeWishlist: (code: string) =>
    request<any>(
      `/api/engagement/wishlist/${encodeURIComponent(
        code
      )}`,
      {
        method: "DELETE",
      }
    ),

  followSeller: (sellerId: string) =>
    request<any>(
      `/api/engagement/sellers/${encodeURIComponent(
        sellerId
      )}/follow`,
      {
        method: "POST",
      }
    ),

  unfollowSeller: (sellerId: string) =>
    request<any>(
      `/api/engagement/sellers/${encodeURIComponent(
        sellerId
      )}/follow`,
      {
        method: "DELETE",
      }
    ),

  sellerPublic: (sellerId: string) =>
    request<any>(
      `/api/engagement/sellers/${encodeURIComponent(
        sellerId
      )}`
    ),

  coupon: (code: string) =>
    request<any>(
      `/api/engagement/coupons/${encodeURIComponent(
        code
      )}`
    ),

  createCoupon: (body: any) =>
    request<any>("/api/engagement/coupons", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateCoupon: (code: string, body: any) =>
    request<any>(
      `/api/engagement/coupons/${encodeURIComponent(
        code
      )}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    ),

  createReferral: () =>
    request<any>("/api/engagement/referrals", {
      method: "POST",
    }),

  myReferrals: () =>
    request<any>("/api/engagement/referrals/me"),

  referral: (code: string) =>
    request<any>(
      `/api/engagement/referrals/${encodeURIComponent(
        code
      )}`
    ),

  sellerAnalytics: () =>
    request<any>("/api/seller/analytics"),

  sellerFulfillment: () =>
    request<any>("/api/seller/fulfillment"),

  updateSellerDelivery: (
    id: string,
    body: any
  ) =>
    request<any>(
      `/api/seller/deliveries/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    ),

  updateSellerBooking: (
    id: string,
    body: any
  ) =>
    request<any>(
      `/api/seller/bookings/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    ),

  messages: () =>
    request<any>("/api/messages"),

  sendMessage: (
    recipientId: string,
    body: any
  ) =>
    request<any>("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        recipientId,
        ...body,
      }),
    }),

  readMessage: (id: string) =>
    request<any>(
      `/api/messages/${encodeURIComponent(id)}/read`,
      {
        method: "PATCH",
      }
    ),

  adminRefunds: () =>
    request<any>("/api/admin/refunds"),

  adminRefundOrder: (
    id: string,
    body: any
  ) =>
    request<any>(
      `/api/admin/orders/${encodeURIComponent(
        id
      )}/refund`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    ),

  adminFraudFlags: () =>
    request<any>("/api/admin/fraud-flags"),

  adminFraudStatus: (
    id: string,
    status: string
  ) =>
    request<any>(
      `/api/admin/fraud-flags/${encodeURIComponent(
        id
      )}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    ),
};

export { API_BASE };

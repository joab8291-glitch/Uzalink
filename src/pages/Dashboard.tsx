import {
  useEffect,
  useState,
} from "react";

import {
  Container,
  btnClass,
} from "@/components/ui";

import {
  Icon,
  Logo,
} from "@/components/Icon";

import { api, API_BASE } from "@/lib/api";

import {
  useAuth,
} from "@/lib/auth";

import {
  navigate,
} from "@/lib/router";

export function Dashboard() {
  const {
    user,
    loading,
    logout,
  } = useAuth();

  const [data, setData] =
    useState<any>();

  const [error, setError] =
    useState("");

  const [payout, setPayout] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [premiumOpen, setPremiumOpen] =
    useState(false);

  const [premiumPhone, setPremiumPhone] =
    useState("");

  const [premiumLoading, setPremiumLoading] =
    useState(false);

  const [premiumPending, setPremiumPending] =
    useState(false);

  const load = async () => {
    try {
      setError("");

      const result =
        await api.sellerDashboard();

      setData(result);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not load author dashboard."
      );
    }
  };

  useEffect(() => {
    if (
      !loading &&
      (!user ||
        !["SELLER", "ADMIN"].includes(
          user.role
        ))
    ) {
      navigate("/seller-login");
      return;
    }

    if (user) {
      void load();
    }
  }, [loading, user]);

  useEffect(() => {
    if (!user) return;

    const refreshDashboard = () => {
      if (document.visibilityState === "visible") {
        void load();
      }
    };

    window.addEventListener("focus", refreshDashboard);
    document.addEventListener("visibilitychange", refreshDashboard);

    return () => {
      window.removeEventListener("focus", refreshDashboard);
      document.removeEventListener("visibilitychange", refreshDashboard);
    };
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen pt-32 text-center">
        Loading author account…
      </div>
    );
  }

  const seller =
    data?.seller;

  const orders =
    data?.orders || [];

  // The seller dashboard API stores the real products inside seller.products.
  // Keep the old top-level fallback so this remains compatible with older API responses.
  const products =
    seller?.products || data?.products || [];

  const premium =
    Boolean(data?.premium);

  const available =
    (seller?.balanceCents || 0) / 100;

  const lifetime =
    (seller?.lifetimeSalesCents || 0) /
    100;

  const totalBooks =
    products.length;

  const totalOrders =
    seller?.totalOrders || 0;

  return (
    <section className="min-h-screen bg-mint/40 pb-20 pt-24">
      <Container className="max-w-7xl">

        {/* =====================================================
            AUTHOR HEADER
        ====================================================== */
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-forest/10 bg-white p-5">

          <div className="flex items-center gap-3">
            <Logo />

            <div>
              <p className="font-extrabold text-deep">
                {user.name}
              </p>

              <p className="text-xs text-forest/55">
                @{seller?.handle ||
                  "author"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">

            <span
              className={`rounded-full px-4 py-2 text-xs font-extrabold ${
                premium
                  ? "bg-goldsoft text-deep"
                  : "bg-mint text-brand"
              }`}
            >
              {premium
                ? "PREMIUM AUTHOR"
                : "FREE AUTHOR"}
            </span>

            <button
              onClick={() =>
                navigate("/sell")
              }
              className={btnClass(
                "gold",
                "md"
              )}
            >
              Publish a Book
            </button>

            {!premium && (
              <button
                onClick={() => {
                  setMessage("");
                  setError("");
                  setPremiumPhone(
                    seller?.paymentNumber || ""
                  );
                  setPremiumOpen(true);
                }}
                className={btnClass(
                  "outline",
                  "md"
                )}
              >
                Premium
              </button>
            )}

            <button
              onClick={async () => {
                await logout();
                navigate("/");
              }}
              className={btnClass(
                "outline",
                "md"
              )}
            >
              Log out
            </button>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}
        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* =====================================================
            WELCOME
        ====================================================== */}
        <div className="mt-7">

          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand">
            Author dashboard
          </p>

          <h1 className="mt-2 text-3xl text-deep sm:text-4xl">
            Welcome back, {user.name}.
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-forest/65">
            Manage your books, track your sales and
            monitor your earnings from one place.
          </p>
        </div>

        {/* =====================================================
            STAT CARDS
        ====================================================== */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <Stat
            label="Published books"
            value={totalBooks}
            icon="book"
          />

          <Stat
            label="Available earnings"
            value={`KSh ${available.toLocaleString()}`}
            icon="wallet"
          />

          <Stat
            label="Pending payouts"
            value={`KSh ${(
              (seller?.pendingCents ||
                0) / 100
            ).toLocaleString()}`}
            icon="clock"
          />

          <Stat
            label="Lifetime earnings"
            value={`KSh ${lifetime.toLocaleString()}`}
            icon="chart"
          />

          <Stat
            label="Book sales"
            value={totalOrders}
            icon="bag"
          />
        </div>

        {/* =====================================================
            EARNINGS BANNER
        ====================================================== */}
        <div className="mt-6 rounded-3xl border border-brand/10 bg-white p-6">

          <div className="flex flex-wrap items-start justify-between gap-5">

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand">
                Author earnings
              </p>

              <h2 className="mt-2 text-2xl text-deep">
                Keep 95% of every book sale
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-forest/65">
                When a reader successfully pays for
                your book through UzaLink, you receive
                95% of the sale. UzaLink retains 5%
                as the platform commission.
              </p>
            </div>

            <div className="rounded-2xl bg-mint px-6 py-4 text-right">
              <p className="text-xs font-bold uppercase text-forest/50">
                You keep
              </p>

              <p className="mt-1 text-3xl font-extrabold text-deep">
                95%
              </p>

              <p className="text-xs font-semibold text-forest/55">
                per successful sale
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            YOUR BOOKS
        ====================================================== */
        <div className="mt-6 rounded-3xl border border-forest/10 bg-white p-6">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand">
                Your library
              </p>

              <h2 className="mt-1 text-2xl text-deep">
                Your books
              </h2>

              <p className="mt-1 text-sm text-forest/60">
                Books you have published through
                UzaLink.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => void load()}
                className={btnClass("outline", "md")}
              >
                Refresh books
              </button>

              <button
                onClick={() =>
                  navigate("/sell")
                }
                className={btnClass(
                  "gold",
                  "md"
                )}
              >
                Publish another book
              </button>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {products.map(
                (product: any) => {
                  const coverUrl = product.code
                    ? `${API_BASE}/api/products/${encodeURIComponent(product.code)}/cover`
                    : "";

                  return (
                    <div
                      key={
                        product.id ||
                        product.code
                      }
                      className="group overflow-hidden rounded-2xl border border-forest/10 bg-mint/30 transition hover:-translate-y-0.5 hover:border-brand/20"
                    >

                      <div className="relative aspect-[4/3] overflow-hidden bg-deep">
                        <div className="absolute inset-0 flex items-center justify-center text-gold">
                          <Icon
                            name="book"
                            className="h-10 w-10"
                          />
                        </div>

                        {coverUrl && (
                          <img
                            src={coverUrl}
                            alt={`Cover of ${product.name || "book"}`}
                            loading="lazy"
                            className="relative z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        )}

                        <div className="absolute inset-x-0 bottom-0 z-20 h-20 bg-gradient-to-t from-deep/70 to-transparent" />

                        <span className="absolute left-3 top-3 z-20 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-forest shadow-sm">
                          Digital Book
                        </span>
                      </div>

                      <div className="p-5">
                        <h3 className="line-clamp-2 text-lg font-extrabold text-deep">
                          {product.name ||
                            "Untitled book"}
                        </h3>

                        {product.category && (
                          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-brand">
                            {product.category}
                          </p>
                        )}

                        {product.description && (
                          <p className="mt-2 line-clamp-3 text-sm text-forest/60">
                            {product.description}
                          </p>
                        )}

                        {product.priceCents !==
                          undefined && (
                          <p className="mt-4 text-lg font-extrabold text-deep">
                            KSh{" "}
                            {(
                              product.priceCents /
                              100
                            ).toLocaleString()}
                          </p>
                        )}

                        <div className="mt-4 flex gap-2">

                          {product.code && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/magic/${product.code}`
                                )
                              }
                              className={btnClass(
                                "deep",
                                "sm",
                                "flex-1"
                              )}
                            >
                              View book
                            </button>
                          )}

                          <button
                            onClick={() =>
                              navigate("/sell")
                            }
                            className={btnClass(
                              "outline",
                              "sm",
                              product.code
                                ? ""
                                : "w-full"
                            )}
                          >
                            New
                          </button>

                        </div>
                      </div>
                    </div>
                  );
                }
              )}

            </div>
          ) : (
            <div className="mt-6 rounded-3xl bg-mint/50 px-6 py-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-brand shadow-sm">
                <Icon
                  name="book"
                  className="h-8 w-8"
                />
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-deep">
                Your first book starts here
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-forest/60">
                You haven't published a book yet.
                Upload your first digital book and
                start reaching readers.
              </p>

              <button
                onClick={() =>
                  navigate("/sell")
                }
                className={btnClass(
                  "gold",
                  "lg",
                  "mt-5"
                )}
              >
                Publish My First Book
              </button>
            </div>
          )}
        </div>

        {/* =====================================================
            SALES + PAYOUT
        ====================================================== */
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.6fr]">

          {/* ===================================================
              BOOK SALES
          ==================================================== */
          <div className="rounded-3xl border border-forest/10 bg-white p-6">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>
                <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand">
                  Sales activity
                </p>

                <h2 className="mt-1 text-xl text-deep">
                  Recent book sales
                </h2>
              </div>

              <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-brand">
                95% author earnings
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">

              <table className="w-full min-w-[720px] text-left text-sm">

                <thead>
                  <tr className="border-b border-forest/10">

                    <th className="p-3 text-xs font-extrabold uppercase tracking-wide text-forest/50">
                      Order
                    </th>

                    <th className="p-3 text-xs font-extrabold uppercase tracking-wide text-forest/50">
                      Book
                    </th>

                    <th className="p-3 text-xs font-extrabold uppercase tracking-wide text-forest/50">
                      Sale
                    </th>

                    <th className="p-3 text-xs font-extrabold uppercase tracking-wide text-forest/50">
                      UzaLink 5%
                    </th>

                    <th className="p-3 text-xs font-extrabold uppercase tracking-wide text-forest/50">
                      Your 95%
                    </th>

                    <th className="p-3 text-xs font-extrabold uppercase tracking-wide text-forest/50">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {orders.map(
                    (order: any) => {
                      const item =
                        order.items?.[0];

                      const commission =
                        (order.commissionCents ||
                          0) /
                        100;

                      const authorNet =
                        (order.sellerNetCents ||
                          0) /
                        100;

                      return (
                        <tr
                          key={order.id}
                          className="border-b border-forest/5"
                        >

                          <td className="p-3 font-bold">
                            {order.publicId}
                          </td>

                          <td className="p-3">
                            {item?.product
                              ?.name ||
                              "Book"}
                          </td>

                          <td className="p-3">
                            KSh{" "}
                            {(
                              order.amountCents /
                              100
                            ).toLocaleString()}
                          </td>

                          <td className="p-3 text-forest/60">
                            KSh{" "}
                            {commission.toLocaleString()}
                          </td>

                          <td className="p-3 font-extrabold text-brand">
                            KSh{" "}
                            {authorNet.toLocaleString()}
                          </td>

                          <td className="p-3">
                            <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-brand">
                              {order.status}
                            </span>
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>
              </table>

              {!orders.length && (
                <div className="py-12 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-brand">
                    <Icon
                      name="bag"
                      className="h-6 w-6"
                    />
                  </div>

                  <p className="mt-4 font-bold text-deep">
                    No book sales yet
                  </p>

                  <p className="mt-1 text-sm text-forest/50">
                    Your reader purchases will
                    appear here.
                  </p>

                </div>
              )}

            </div>
          </div>

          {/* ===================================================
              PAYOUT
          ==================================================== */}
          <div className="rounded-3xl border border-forest/10 bg-white p-6">

            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand">
              Your earnings
            </p>

            <h2 className="mt-1 text-xl text-deep">
              Request payout
            </h2>

            <p className="mt-2 text-sm text-forest/65">
              Withdraw money from your available
              book-sale balance.
            </p>

            <div className="mt-5 rounded-2xl bg-mint/60 p-4">

              <p className="text-xs font-bold uppercase tracking-wide text-forest/50">
                Available to withdraw
              </p>

              <p className="mt-1 text-2xl font-extrabold text-deep">
                KSh{" "}
                {available.toLocaleString()}
              </p>
            </div>

            <input
              value={payout}
              onChange={(e) =>
                setPayout(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              placeholder="Amount in KSh"
              className="mt-5 w-full rounded-2xl border border-forest/10 p-3 outline-none focus:border-brand"
            />

            <button
              onClick={async () => {
                setMessage("");

                if (
                  !payout ||
                  Number(payout) <= 0
                ) {
                  setMessage(
                    "Enter a valid payout amount."
                  );
                  return;
                }

                try {
                  await api.payout(
                    Math.round(
                      Number(payout) *
                        100
                    )
                  );

                  setMessage(
                    "Payout request created successfully."
                  );

                  setPayout("");

                  await load();
                } catch (e) {
                  setMessage(
                    e instanceof Error
                      ? e.message
                      : "Payout failed."
                  );
                }
              }}
              className={btnClass(
                "deep",
                "lg",
                "mt-3 w-full"
              )}
            >
              Request payout
            </button>

            {message && !premiumOpen && (
              <p className="mt-3 text-sm font-semibold text-brand">
                {message}
              </p>
            )}

            <div className="mt-7 border-t pt-5">

              <p className="text-xs font-bold uppercase tracking-wide text-forest/50">
                M-Pesa settlement number
              </p>

              <p className="mt-2 font-extrabold text-deep">
                {seller?.paymentNumber ||
                  "Not set"}
              </p>

              {!seller?.paymentNumber && (
                <p className="mt-1 text-xs text-forest/50">
                  Add your M-Pesa number from your
                  author profile before requesting
                  a payout.
                </p>
              )}

            </div>
          </div>
        </div>

        {/* =====================================================
            PREMIUM SUBSCRIPTION MODAL
        ====================================================== */
        {premiumOpen && !premium && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-deep/60 backdrop-blur-sm"
              onClick={() => !premiumLoading && setPremiumOpen(false)}
            />

            <div className="relative z-10 w-full max-w-md rounded-3xl border border-forest/10 bg-white p-6 shadow-2xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand">
                    UzaLink Premium
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold text-deep">
                    Upgrade your author account
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-forest/65">
                    Enter the M-Pesa number you want to use. UzaLink will send an STK Push. Your account becomes Premium only after the payment is confirmed.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={premiumLoading}
                  onClick={() => setPremiumOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-forest/10 text-forest/60 hover:bg-mint disabled:opacity-50"
                  aria-label="Close Premium dialog"
                >
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 rounded-2xl bg-mint/60 p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-forest/50">
                  M-Pesa number
                </p>
                <input
                  value={premiumPhone}
                  onChange={(e) =>
                    setPremiumPhone(
                      e.target.value.replace(/[^0-9+]/g, "")
                    )
                  }
                  placeholder="0712345678"
                  inputMode="tel"
                  autoComplete="tel"
                  disabled={premiumLoading}
                  className="mt-2 w-full rounded-2xl border border-forest/10 bg-white px-4 py-3.5 text-base font-semibold text-deep outline-none focus:border-brand disabled:opacity-60"
                />
                <p className="mt-2 text-xs text-forest/50">
                  Use a Safaricom M-Pesa number that can receive the STK Push.
                </p>
              </div>

              {premiumPending && (
                <div className="mt-4 rounded-2xl border border-gold/30 bg-goldsoft/60 p-4 text-sm text-[#6b5200]">
                  <p className="font-extrabold">STK Push sent.</p>
                  <p className="mt-1">
                    Complete the payment on your phone. We are checking your Premium status automatically.
                  </p>
                </div>
              )}

              {message && (
                <p className="mt-4 rounded-2xl bg-mint p-3.5 text-sm font-semibold text-brand">
                  {message}
                </p>
              )}

              <button
                type="button"
                disabled={premiumLoading || premiumPending}
                onClick={async () => {
                  setMessage("");
                  setError("");

                  const normalized = premiumPhone
                    .trim()
                    .replace(/\s+/g, "");

                  if (!/^2547\d{8}$/.test(normalized) && !/^07\d{8}$/.test(normalized)) {
                    setMessage(
                      "Enter a valid Kenyan M-Pesa number, for example 0712345678 or 254712345678."
                    );
                    return;
                  }

                  try {
                    setPremiumLoading(true);

                    const result =
                      await api.subscribe(normalized);

                    setPremiumPending(true);
                    setMessage(
                      result?.message ||
                        "STK Push sent. Complete the payment on your phone."
                    );

                    let attempts = 0;
                    const checkPremium = async () => {
                      attempts += 1;

                      try {
                        const latest =
                          await api.sellerDashboard();
                        setData(latest);

                        if (latest?.premium) {
                          setPremiumPending(false);
                          setPremiumOpen(false);
                          setMessage(
                            "Premium activated successfully. Your author account is now Premium."
                          );
                          return;
                        }
                      } catch {
                        // Keep polling; the payment callback may still be processing.
                      }

                      if (attempts < 20) {
                        window.setTimeout(
                          checkPremium,
                          3000
                        );
                      }
                    };

                    window.setTimeout(
                      checkPremium,
                      3000
                    );
                  } catch (e) {
                    setPremiumPending(false);
                    setMessage(
                      e instanceof Error
                        ? e.message
                        : "Could not start Premium payment."
                    );
                  } finally {
                    setPremiumLoading(false);
                  }
                }}
                className={btnClass(
                  "gold",
                  "lg",
                  "mt-5 w-full"
                )}
              >
                {premiumLoading
                  ? "Sending STK Push…"
                  : premiumPending
                    ? "Payment Sent"
                    : "Pay for Premium"}
              </button>

              <p className="mt-3 text-center text-[11px] leading-relaxed text-forest/45">
                Do not close the dashboard after paying. UzaLink will refresh your account when the M-Pesa callback confirms the payment.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            AUTHOR CTA
        ====================================================== */
        <div className="mt-6 overflow-hidden rounded-3xl bg-deep p-7 text-white sm:p-9">

          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-gold">
                Keep writing. Keep selling.
              </p>

              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Ready to publish another book?
              </h2>

              <p className="mt-2 max-w-xl text-sm text-white/65">
                Give your next book a home where
                readers can discover it, pay through
                M-Pesa and access it securely.
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/sell")
              }
              className={btnClass(
                "gold",
                "lg"
              )}
            >
              Publish a Book
            </button>
          </div>
        </div>

      </Container>
    </section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon: string;
}) {
  return (
    <div className="rounded-3xl border border-forest/10 bg-white p-5">

      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mint text-brand">
        <Icon
          name={icon}
          className="h-5 w-5"
        />
      </span>

      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-forest/50">
        {label}
      </p>

      <p className="mt-1 text-2xl font-extrabold text-deep">
        {value}
      </p>

    </div>
  );
}
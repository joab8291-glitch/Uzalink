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

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

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
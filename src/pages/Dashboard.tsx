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

import { api } from "@/lib/api";
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

  const load = async () => {
    try {
      const result =
        await api.sellerDashboard();

      setData(result);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not load dashboard."
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

  if (loading || !user) {
    return (
      <div className="min-h-screen pt-32 text-center">
        Loading seller account…
      </div>
    );
  }

  const seller =
    data?.seller;

  const orders =
    data?.orders || [];

  const premium =
    Boolean(data?.premium);

  const available =
    (seller?.balanceCents || 0) / 100;

  const lifetime =
    (seller?.lifetimeSalesCents || 0) /
    100;

  return (
    <section className="min-h-screen bg-mint/40 pb-20 pt-24">
      <Container className="max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-forest/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <Logo />

            <div>
              <p className="font-extrabold text-deep">
                {user.name}
              </p>

              <p className="text-xs text-forest/55">
                {seller?.handle ||
                  "Seller account"}
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
                ? "PREMIUM SELLER"
                : "FREE SELLER"}
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
              New product
            </button>

            {!premium && (
              <button
                onClick={() => {
                  setMessage("");
                  navigate("/dashboard");
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

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Available balance"
            value={`KSh ${available.toLocaleString()}`}
            icon="wallet"
          />

          <Stat
            label="Pending payouts"
            value={`KSh ${(
              (seller?.pendingCents ||
                0) /
              100
            ).toLocaleString()}`}
            icon="clock"
          />

          <Stat
            label="Lifetime seller net"
            value={`KSh ${lifetime.toLocaleString()}`}
            icon="chart"
          />

          <Stat
            label="Orders"
            value={
              seller?.totalOrders ||
              0
            }
            icon="bag"
          />
        </div>

        <div className="mt-6 rounded-3xl border border-brand/10 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand">
                Seller earnings
              </p>

              <h2 className="mt-2 text-2xl text-deep">
                You keep 95% of every sale
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-forest/65">
                UzaLink automatically retains 5%
                as the platform commission after
                successful M-Pesa payment confirmation.
              </p>
            </div>

            <div className="rounded-2xl bg-mint px-5 py-4 text-right">
              <p className="text-xs font-bold uppercase text-forest/50">
                Platform fee
              </p>

              <p className="mt-1 text-2xl font-extrabold text-deep">
                5%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
          <div className="rounded-3xl border border-forest/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-deep">
                Your orders
              </h2>

              <span className="text-xs font-bold text-forest/50">
                5% platform commission
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">
                      Order
                    </th>

                    <th className="p-3">
                      Product
                    </th>

                    <th className="p-3">
                      Gross
                    </th>

                    <th className="p-3">
                      Commission
                    </th>

                    <th className="p-3">
                      Your 95%
                    </th>

                    <th className="p-3">
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

                      const sellerNet =
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
                              "—"}
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

                          <td className="p-3 font-extrabold">
                            KSh{" "}
                            {sellerNet.toLocaleString()}
                          </td>

                          <td className="p-3">
                            {order.status}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>

              {!orders.length && (
                <p className="py-10 text-center text-forest/50">
                  No orders yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-forest/10 bg-white p-6">
            <h2 className="text-xl text-deep">
              Request payout
            </h2>

            <p className="mt-2 text-sm text-forest/65">
              Withdraw from your available seller
              balance.
            </p>

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
              className="mt-5 w-full rounded-2xl border border-forest/10 p-3"
            />

            <button
              onClick={async () => {
                setMessage("");

                try {
                  await api.payout(
                    Math.round(
                      Number(payout) *
                        100
                    )
                  );

                  setMessage(
                    "Payout request created."
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

            {message && (
              <p className="mt-3 text-sm font-semibold text-brand">
                {message}
              </p>
            )}

            <div className="mt-7 border-t pt-5">
              <p className="text-xs font-bold uppercase tracking-wide text-forest/50">
                Settlement number
              </p>

              <p className="mt-2 font-extrabold text-deep">
                {seller?.paymentNumber ||
                  "Not set"}
              </p>
            </div>
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

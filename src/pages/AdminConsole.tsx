import { useEffect, useState } from "react";
import { Container, btnClass } from "@/components/ui";
import { BrandLogo } from "@/components/BrandLogo";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { navigate } from "@/lib/router";

const money = (n = 0) =>
  `KSh ${(Number(n) / 100).toLocaleString("en-KE")}`;

export function AdminConsole() {
  const { user, loading, logout } = useAuth();

  const [d, setD] = useState<any>({});
  const [tab, setTab] = useState("overview");
  const [error, setError] = useState("");
  const [seller, setSeller] = useState("");
  const [amount, setAmount] = useState("");
  const [deletingProductId, setDeletingProductId] =
    useState<string | null>(null);

  const load = async () => {
    try {
      setD(await api.adminDashboard());
      setError("");
    } catch (e: any) {
      setError(
        e?.message || "Could not load admin data."
      );
    }
  };

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      navigate("/");
      return;
    }

    if (user?.role === "ADMIN") {
      void load();
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center">
        Loading admin console…
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const products = d.products || [];

  const sellers = (d.sellers || []).filter(
    (x: any) => x?.user?.role === "SELLER"
  );

  const customers = (d.users || []).filter(
    (x: any) =>
      x?.role !== "ADMIN" &&
      x?.role !== "SELLER"
  );

  const orders = d.orders || [];
  const payouts = d.payouts || [];
  const stats = d.stats || {};

  const payout = async () => {
    const cents = Math.round(
      Number(amount) * 100
    );

    const s = sellers.find(
      (x: any) => x.id === seller
    );

    if (
      !s ||
      !cents ||
      cents > s.balanceCents
    ) {
      return setError(
        "Select a seller and enter a valid amount within the available balance."
      );
    }

    try {
      setError("");

      const r = await api.adminCreatePayout(
        seller,
        cents
      );

      if (r?.payout?.id) {
        await api.adminSendPayout(
          r.payout.id
        );
      }

      setSeller("");
      setAmount("");

      await load();
    } catch (e: any) {
      setError(
        e?.message || "Payout failed."
      );
    }
  };

  const deleteProduct = async (
    product: any
  ) => {
    if (!product?.id) {
      setError(
        "This product does not have a valid ID."
      );
      return;
    }

    const productName = String(
      product.name || "this product"
    );

    const productCode = String(
      product.code || ""
    );

    const firstConfirmation =
      window.confirm(
        [
          "PERMANENT DELETE",
          "",
          `You are about to permanently delete "${productName}".`,
          productCode
            ? `Product code: ${productCode}`
            : "",
          "",
          "This action cannot be undone.",
          "",
          "The product and its product-specific records will be permanently removed.",
          "",
          "Orders, payments, refunds and financial history will NOT be deleted.",
          "",
          "Do you want to continue?",
        ]
          .filter(Boolean)
          .join("\n")
      );

    if (!firstConfirmation) {
      return;
    }

    const secondConfirmation =
      window.confirm(
        `FINAL CONFIRMATION\n\nPermanently delete "${productName}"?\n\nThis cannot be undone.`
      );

    if (!secondConfirmation) {
      return;
    }

    try {
      setError("");
      setDeletingProductId(product.id);

      const result =
        await api.adminDeleteProduct(
          product.id
        );

      if (
        result?.storageCleanupFailed
      ) {
        setError(
          result?.warning ||
            "Product was deleted, but private storage cleanup needs attention."
        );
      }

      await load();
    } catch (e: any) {
      setError(
        e?.message ||
          "Permanent product deletion failed."
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  const tabs = [
    "overview",
    "products",
    "sellers",
    "customers",
    "orders",
    "payouts",
  ];

  return (
    <section className="min-h-screen bg-mint/40 pb-20 pt-24">
      <Container className="max-w-7xl">
        <header className="rounded-3xl border border-forest/10 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <BrandLogo className="w-[175px]" />

              <div>
                <b className="text-deep">
                  Admin Console
                </b>

                <p className="text-xs text-forest/50">
                  Marketplace management
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => void load()}
                className={btnClass(
                  "outline",
                  "md"
                )}
              >
                Refresh
              </button>

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

          <div className="mt-5 flex gap-2 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap ${
                  tab === t
                    ? "bg-deep text-white"
                    : "bg-mint text-forest"
                }`}
              >
                {t[0].toUpperCase() +
                  t.slice(1)}
              </button>
            ))}
          </div>
        </header>

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {tab === "overview" && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Users", stats.users],
              ["Sellers", stats.sellers],
              ["Products", stats.products],
              ["Orders", stats.orders],
              [
                "Gross sales",
                money(stats.grossCents),
              ],
              [
                "Commission",
                money(
                  stats.commissionCents
                ),
              ],
              [
                "Seller earnings",
                money(
                  stats.sellerNetCents
                ),
              ],
              ["Payouts", stats.payouts],
            ].map(([a, b]) => (
              <div
                key={String(a)}
                className="rounded-2xl border border-forest/10 bg-white p-5"
              >
                <p className="text-xs font-bold uppercase text-forest/50">
                  {a}
                </p>

                <p className="mt-2 text-2xl font-extrabold text-deep">
                  {b ?? 0}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === "products" && (
          <Panel
            title={`Products (${products.length})`}
          >
            <Table
              headers={[
                "Product",
                "Type",
                "Seller",
                "Price",
                "Status",
                "Actions",
              ]}
            >
              {products.map((p: any) => {
                const deleting =
                  deletingProductId ===
                  p.id;

                return (
                  <tr
                    key={p.id}
                    className="border-b border-forest/5"
                  >
                    <Td>
                      <div>
                        <span className="font-bold">
                          {p.name}
                        </span>

                        <small className="block text-xs text-forest/50">
                          {p.category}
                        </small>
                      </div>
                    </Td>

                    <Td>{p.kind}</Td>

                    <Td>
                      {p.seller?.handle ||
                        p.seller?.user?.name ||
                        "—"}
                    </Td>

                    <Td>
                      {money(p.priceCents)}
                    </Td>

                    <Td>{p.status}</Td>

                    <Td>
                      <button
                        type="button"
                        disabled={deleting}
                        onClick={() =>
                          void deleteProduct(
                            p
                          )
                        }
                        className={`rounded-xl px-3 py-2 text-xs font-extrabold transition ${
                          deleting
                            ? "cursor-not-allowed bg-gray-200 text-gray-500"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        {deleting
                          ? "Deleting…"
                          : "Delete Permanently"}
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          </Panel>
        )}

        {tab === "sellers" && (
          <Panel
            title={`Sellers (${sellers.length})`}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {sellers.map((s: any) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-forest/10 p-4"
                >
                  <b>
                    {s.user?.name ||
                      s.handle}
                  </b>

                  <p className="text-sm text-forest/55">
                    @{s.handle}
                  </p>

                  <p className="mt-2 font-extrabold text-brand">
                    Balance{" "}
                    {money(
                      s.balanceCents
                    )}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {tab === "customers" && (
          <Panel
            title={`Customers (${customers.length})`}
          >
            <Table
              headers={[
                "Name",
                "Email",
                "Phone",
              ]}
            >
              {customers.map((u: any) => (
                <tr
                  key={u.id}
                  className="border-b border-forest/5"
                >
                  <Td>{u.name}</Td>
                  <Td>
                    {u.email || "—"}
                  </Td>
                  <Td>
                    {u.phone || "—"}
                  </Td>
                </tr>
              ))}
            </Table>
          </Panel>
        )}

        {tab === "orders" && (
          <Panel
            title={`Orders (${orders.length})`}
          >
            <Table
              headers={[
                "Order",
                "Customer",
                "Product",
                "Amount",
                "Status",
              ]}
            >
              {orders.map((o: any) => (
                <tr
                  key={o.id}
                  className="border-b border-forest/5"
                >
                  <Td>{o.publicId}</Td>

                  <Td>
                    {o.buyer?.name ||
                      o.buyerPhone ||
                      "—"}
                  </Td>

                  <Td>
                    {o.items?.[0]?.product
                      ?.name || "—"}
                  </Td>

                  <Td>
                    {money(
                      o.amountCents
                    )}
                  </Td>

                  <Td>{o.status}</Td>
                </tr>
              ))}
            </Table>
          </Panel>
        )}

        {tab === "payouts" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
            <Panel title="Seller payout">
              <select
                value={seller}
                onChange={(e) =>
                  setSeller(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border p-3"
              >
                <option value="">
                  Select seller
                </option>

                {sellers.map((s: any) => (
                  <option
                    key={s.id}
                    value={s.id}
                  >
                    {s.user?.name ||
                      s.handle}{" "}
                    —{" "}
                    {money(
                      s.balanceCents
                    )}
                  </option>
                ))}
              </select>

              <input
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value.replace(
                      /[^0-9.]/g,
                      ""
                    )
                  )
                }
                placeholder="Amount in KSh"
                className="mt-3 w-full rounded-xl border p-3"
              />

              <button
                onClick={() =>
                  void payout()
                }
                className={btnClass(
                  "gold",
                  "lg",
                  "mt-3 w-full"
                )}
              >
                Send M-Pesa Payout
              </button>
            </Panel>

            <Panel
              title={`Payout history (${payouts.length})`}
            >
              <Table
                headers={[
                  "Seller",
                  "Amount",
                  "Phone",
                  "Status",
                ]}
              >
                {payouts.map((p: any) => (
                  <tr
                    key={p.id}
                    className="border-b border-forest/5"
                  >
                    <Td>
                      {p.seller?.user
                        ?.name ||
                        p.seller?.handle ||
                        "—"}
                    </Td>

                    <Td>
                      {money(
                        p.amountCents
                      )}
                    </Td>

                    <Td>
                      {p.phone || "—"}
                    </Td>

                    <Td>{p.status}</Td>
                  </tr>
                ))}
              </Table>
            </Panel>
          </div>
        )}
      </Container>
    </section>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: any;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-forest/10 bg-white p-5">
      <h2 className="text-xl font-extrabold text-deep">
        {title}
      </h2>

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

function Table({
  headers,
  children,
}: {
  headers: string[];
  children: any;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[750px] text-left text-sm">
        <thead>
          <tr className="border-b border-forest/10">
            {headers.map((h) => (
              <th
                key={h}
                className="px-3 py-3 text-xs uppercase text-forest/50"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Td({
  children,
}: {
  children: any;
}) {
  return (
    <td className="px-3 py-3 text-forest/75">
      {children}
    </td>
  );
}

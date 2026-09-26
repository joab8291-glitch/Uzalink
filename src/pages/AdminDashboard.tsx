import {
  useCallback,
  useEffect,
  useMemo,
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

import {
  api,
  API_BASE,
} from "@/lib/api";

import {
  useAuth,
} from "@/lib/auth";

import {
  navigate,
} from "@/lib/router";

type Tab =
  | "overview"
  | "orders"
  | "books"
  | "sellers"
  | "users"
  | "payouts";

const money = (cents = 0) =>
  `KSh ${(Number(cents) / 100).toLocaleString("en-KE")}`;

const date = (value: string) =>
  new Date(value).toLocaleString("en-KE");

export function AdminDashboard() {
  const {
    user,
    loading,
    logout,
  } = useAuth();

  const [data, setData] = useState<any>();
  const [tab, setTab] =
    useState<Tab>("overview");

  const [error, setError] =
    useState("");

  const [busy, setBusy] =
    useState("");

  /*
   * New payout form
   */
  const [
    payoutSellerId,
    setPayoutSellerId,
  ] = useState("");

  const [
    payoutAmount,
    setPayoutAmount,
  ] = useState("");

  /*
   * Load dashboard data
   */
  const load = useCallback(async () => {
    setError("");

    try {
      const result =
        await api.adminDashboard();

      setData(result);
    } catch (e: any) {
      setError(
        e?.message ||
          "Could not load the admin dashboard."
      );
    }
  }, []);

  /*
   * Protect admin dashboard
   */
  useEffect(() => {
    if (
      !loading &&
      user?.role !== "ADMIN"
    ) {
      navigate("/");
      return;
    }

    if (
      user?.role === "ADMIN"
    ) {
      void load();
    }
  }, [
    loading,
    user,
    load,
  ]);

  /*
   * Dashboard data
   */
  const stats =
    data?.stats || {};

  const orders =
    data?.orders || [];

  const books =
    data?.products || [];

  const sellers =
    data?.sellers || [];

  const users =
    data?.users || [];

  const payouts =
    data?.payouts || [];

  /*
   * Paid orders
   */
  const paidOrders = useMemo(
    () =>
      orders.filter(
        (order: any) =>
          [
            "PAID",
            "FULFILLED",
          ].includes(order.status)
      ),
    [orders]
  );

  /*
   * Payouts that are not completed
   */
  const pendingPayouts =
    useMemo(
      () =>
        payouts.filter(
          (payout: any) =>
            payout.status !== "PAID"
        ),
      [payouts]
    );

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="min-h-screen pt-32 text-center">
        Loading admin console…
      </div>
    );
  }

  /*
   * Non-admin users
   */
  if (
    !user ||
    user.role !== "ADMIN"
  ) {
    return null;
  }

  /*
   * ---------------------------------------------------------
   * BOOK STATUS
   * ---------------------------------------------------------
   */

  const setBookStatus = async (
    id: string,
    status: string
  ) => {
    setBusy(id);

    try {
      await api.adminProductStatus(
        id,
        status
      );

      await load();
    } catch (e: any) {
      setError(
        e?.message ||
          "Could not update book status."
      );
    } finally {
      setBusy("");
    }
  };

  /*
   * ---------------------------------------------------------
   * CREATE + SEND AUTHOR PAYOUT
   * ---------------------------------------------------------
   */

  const createAndSendPayout =
    async () => {
      const amount =
        Number(payoutAmount);

      /*
       * Validate author
       */
      const seller =
        sellers.find(
          (item: any) =>
            item.id ===
            payoutSellerId
        );

      if (!seller) {
        setError(
          "Please select an author."
        );
        return;
      }

      /*
       * Validate amount
       */
      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        setError(
          "Enter a valid payout amount."
        );
        return;
      }

      /*
       * Convert KSh to cents
       */
      const amountCents =
        Math.round(
          amount * 100
        );

      /*
       * Check available balance
       */
      const available =
        Number(
          seller.balanceCents || 0
        );

      if (
        amountCents >
        available
      ) {
        setError(
          `Payout exceeds this author's available balance of ${money(
            available
          )}.`
        );
        return;
      }

      setBusy(
        "new-payout"
      );

      setError("");

      try {
        /*
         * Step 1:
         * Create payout.
         *
         * Backend reserves the author's
         * balance and creates PENDING payout.
         */
        const created =
          await api.adminCreatePayout(
            payoutSellerId,
            amountCents
          );

        const payoutId =
          created?.payout?.id;

        if (!payoutId) {
          throw new Error(
            "Payout was created without an ID."
          );
        }

        /*
         * Step 2:
         * Send payout using M-Pesa B2C.
         */
        await api.adminSendPayout(
          payoutId
        );

        /*
         * Reset form
         */
        setPayoutSellerId("");
        setPayoutAmount("");

        /*
         * Refresh live dashboard
         */
        await load();
      } catch (e: any) {
        setError(
          e?.message ||
            "Could not send the author payout."
        );

        /*
         * Refresh because backend may
         * have changed the payout state.
         */
        await load();
      } finally {
        setBusy("");
      }
    };

  /*
   * ---------------------------------------------------------
   * SEND EXISTING PAYOUT
   * ---------------------------------------------------------
   */

  const sendExistingPayout =
    async (id: string) => {
      setBusy(id);
      setError("");

      try {
        await api.adminSendPayout(
          id
        );

        await load();
      } catch (e: any) {
        setError(
          e?.message ||
            "Could not send the payout through M-Pesa."
        );

        await load();
      } finally {
        setBusy("");
      }
    };

  /*
   * ---------------------------------------------------------
   * TABS
   * ---------------------------------------------------------
   */

  const tabs: [
    Tab,
    string
  ][] = [
    [
      "overview",
      "Overview",
    ],
    [
      "orders",
      "Orders",
    ],
    [
      "books",
      "Books",
    ],
    [
      "sellers",
      "Sellers",
    ],
    [
      "users",
      "Users",
    ],
    [
      "payouts",
      "Payouts",
    ],
  ];

  return (
    <section className="min-h-screen bg-mint/40 pb-20 pt-24">
      <Container className="max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="rounded-3xl border border-forest/10 bg-white p-5">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <Logo />

              <div>
                <p className="font-extrabold text-deep">
                  UzaLink Admin Console
                </p>

                <p className="text-xs text-forest/50">
                  Live marketplace management
                </p>
              </div>

            </div>

            <div className="flex gap-2">

              <button
                onClick={() =>
                  void load()
                }
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

          {/* Tabs */}

          <div className="mt-5 flex flex-wrap gap-2">

            {tabs.map(
              ([key, label]) => (
                <button
                  key={key}
                  onClick={() =>
                    setTab(key)
                  }
                  className={`rounded-full px-4 py-2 text-sm font-extrabold ${
                    tab === key
                      ? "bg-deep text-white"
                      : "bg-mint text-forest"
                  }`}
                >
                  {label}
                </button>
              )
            )}

          </div>

        </header>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* =====================================================
            OVERVIEW
        ===================================================== */}

        {tab === "overview" && (
          <>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <Stat
                label="Users"
                value={stats.users}
              />

              <Stat
                label="Sellers"
                value={stats.sellers}
              />

              <Stat
                label="Published / books"
                value={stats.products}
              />

              <Stat
                label="Orders"
                value={stats.orders}
              />

              <Stat
                label="Gross sales"
                value={money(
                  stats.grossCents
                )}
              />

              <Stat
                label="UzaLink commission"
                value={money(
                  stats.commissionCents
                )}
              />

              <Stat
                label="Seller earnings"
                value={money(
                  stats.sellerNetCents
                )}
              />

              <Stat
                label="Payout requests"
                value={stats.payouts}
              />

            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">

              <Panel title="Marketplace health">

                <Row
                  label="Books in database"
                  value={books.length}
                />

                <Row
                  label="Active books"
                  value={
                    books.filter(
                      (b: any) =>
                        b.status ===
                        "ACTIVE"
                    ).length
                  }
                />

                <Row
                  label="Paused / archived"
                  value={
                    books.filter(
                      (b: any) =>
                        [
                          "PAUSED",
                          "ARCHIVED",
                        ].includes(
                          b.status
                        )
                    ).length
                  }
                />

                <Row
                  label="Completed sales"
                  value={
                    paidOrders.length
                  }
                />

                <Row
                  label="Payouts awaiting processing"
                  value={
                    pendingPayouts.length
                  }
                />

              </Panel>

              <Panel title="Recent activity">

                {orders
                  .slice(0, 5)
                  .map(
                    (order: any) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between border-b border-forest/5 py-3 text-sm"
                      >

                        <div>

                          <p className="font-bold text-deep">
                            {
                              order.items?.[0]
                                ?.product?.name ||
                              "Book order"
                            }
                          </p>

                          <p className="text-xs text-forest/50">
                            {
                              order.buyer
                                ?.name ||
                              order.buyerPhone ||
                              "Reader"
                            }{" "}
                            ·{" "}
                            {date(
                              order.createdAt
                            )}
                          </p>

                        </div>

                        <span className="font-extrabold text-brand">
                          {money(
                            order.amountCents
                          )}
                        </span>

                      </div>
                    )
                  )}

                {!orders.length && (
                  <p className="py-8 text-center text-sm text-forest/50">
                    No orders yet.
                  </p>
                )}

              </Panel>

            </div>

          </>
        )}

        {/* =====================================================
            ORDERS
        ===================================================== */}

        {tab === "orders" && (
          <Panel
            title={`All orders (${orders.length})`}
            className="mt-6"
          >

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] text-left text-sm">

                <thead>

                  <tr className="border-b border-forest/10">

                    <Th>Order</Th>
                    <Th>Reader</Th>
                    <Th>Book</Th>
                    <Th>Seller</Th>
                    <Th>Amount</Th>
                    <Th>Status</Th>
                    <Th>Payment</Th>
                    <Th>Date</Th>

                  </tr>

                </thead>

                <tbody>

                  {orders.map(
                    (order: any) => {

                      const item =
                        order.items?.[0];

                      return (
                        <tr
                          key={order.id}
                          className="border-b border-forest/5"
                        >

                          <Td>
                            {order.publicId}
                          </Td>

                          <Td>
                            {
                              order.buyer
                                ?.name ||
                              "—"
                            }

                            <br />

                            <span className="text-xs text-forest/50">
                              {
                                order.buyerPhone ||
                                ""
                              }
                            </span>
                          </Td>

                          <Td>
                            {
                              item
                                ?.product
                                ?.name ||
                              "—"
                            }
                          </Td>

                          <Td>
                            {
                              item
                                ?.product
                                ?.seller
                                ?.user
                                ?.name ||
                              item
                                ?.product
                                ?.seller
                                ?.handle ||
                              "—"
                            }
                          </Td>

                          <Td>
                            {money(
                              order.amountCents
                            )}
                          </Td>

                          <Td>
                            <Badge>
                              {order.status}
                            </Badge>
                          </Td>

                          <Td>
                            {
                              order
                                .payments?.[0]
                                ?.receipt ||
                              order
                                .payments?.[0]
                                ?.status ||
                              "Pending"
                            }
                          </Td>

                          <Td>
                            {date(
                              order.createdAt
                            )}
                          </Td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </Panel>
        )}

        {/* =====================================================
            BOOKS
        ===================================================== */}

        {tab === "books" && (
          <Panel
            title={`Books (${books.length})`}
            className="mt-6"
          >

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {books.map(
                (book: any) => (
                  <div
                    key={book.id}
                    className="overflow-hidden rounded-3xl border border-forest/10 bg-mint/20"
                  >

                    <div className="h-56 bg-mint">

                      {book.code ? (
                        <img
                          src={`${API_BASE}/api/products/${encodeURIComponent(
                            book.code
                          )}/cover`}
                          alt={book.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}

                    </div>

                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <h3 className="font-extrabold text-deep">
                            {book.name}
                          </h3>

                          <p className="text-xs text-forest/50">
                            {
                              book.seller
                                ?.user
                                ?.name ||
                              book.seller
                                ?.handle ||
                              "Unknown seller"
                            }
                          </p>

                        </div>

                        <Badge>
                          {book.status}
                        </Badge>

                      </div>

                      <p className="mt-2 line-clamp-2 text-sm text-forest/60">
                        {book.description}
                      </p>

                      <p className="mt-3 font-extrabold text-deep">
                        {money(
                          book.priceCents
                        )}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">

                        {[
                          "ACTIVE",
                          "PAUSED",
                          "ARCHIVED",
                        ].map(
                          (status) => (
                            <button
                              key={status}
                              disabled={
                                busy ===
                                  book.id ||
                                book.status ===
                                  status
                              }
                              onClick={() =>
                                void setBookStatus(
                                  book.id,
                                  status
                                )
                              }
                              className={btnClass(
                                status ===
                                  "ACTIVE"
                                  ? "gold"
                                  : "outline",
                                "sm"
                              )}
                            >
                              {busy ===
                              book.id
                                ? "Saving…"
                                : status ===
                                  "ACTIVE"
                                ? "Publish"
                                : status
                                    .charAt(0)
                                    .toUpperCase() +
                                  status
                                    .slice(1)
                                    .toLowerCase()}
                            </button>
                          )
                        )}

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

            {!books.length && (
              <Empty text="No books in the database yet." />
            )}

          </Panel>
        )}

        {/* =====================================================
            SELLERS
        ===================================================== */}

        {tab === "sellers" && (
          <Panel
            title={`Sellers (${sellers.length})`}
            className="mt-6"
          >

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left text-sm">

                <thead>

                  <tr className="border-b border-forest/10">

                    <Th>Seller</Th>
                    <Th>Handle</Th>
                    <Th>Books</Th>
                    <Th>Available</Th>
                    <Th>Pending</Th>
                    <Th>Lifetime</Th>
                    <Th>Orders</Th>
                    <Th>Joined</Th>

                  </tr>

                </thead>

                <tbody>

                  {sellers.map(
                    (seller: any) => (
                      <tr
                        key={seller.id}
                        className="border-b border-forest/5"
                      >

                        <Td>
                          {
                            seller.user
                              ?.name ||
                            "—"
                          }
                        </Td>

                        <Td>
                          @{seller.handle}
                        </Td>

                        <Td>
                          {
                            seller.products
                              ?.length ||
                            0
                          }
                        </Td>

                        <Td>
                          {money(
                            seller.balanceCents
                          )}
                        </Td>

                        <Td>
                          {money(
                            seller.pendingCents
                          )}
                        </Td>

                        <Td>
                          {money(
                            seller.lifetimeSalesCents
                          )}
                        </Td>

                        <Td>
                          {
                            seller.totalOrders ||
                            0
                          }
                        </Td>

                        <Td>
                          {date(
                            seller.createdAt
                          )}
                        </Td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </Panel>
        )}

        {/* =====================================================
            USERS
        ===================================================== */}

        {tab === "users" && (
          <Panel
            title={`Users (${users.length})`}
            className="mt-6"
          >

            <div className="overflow-x-auto">

              <table className="w-full min-w-[750px] text-left text-sm">

                <thead>

                  <tr className="border-b border-forest/10">

                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Joined</Th>

                  </tr>

                </thead>

                <tbody>

                  {users.map(
                    (item: any) => (
                      <tr
                        key={item.id}
                        className="border-b border-forest/5"
                      >

                        <Td>
                          {item.name}
                        </Td>

                        <Td>
                          {item.email}
                        </Td>

                        <Td>
                          <Badge>
                            {item.role}
                          </Badge>
                        </Td>

                        <Td>
                          {date(
                            item.createdAt
                          )}
                        </Td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </Panel>
        )}

        {/* =====================================================
            PAYOUTS
        ===================================================== */}

        {tab === "payouts" && (
          <Panel
            title={`Payouts (${payouts.length})`}
            className="mt-6"
          >

            {/* -------------------------------------------------
                PAY AN AUTHOR
            ------------------------------------------------- */}

            <div className="mb-6 rounded-3xl bg-mint/50 p-5">

              <div className="mb-4">

                <h3 className="text-lg font-extrabold text-deep">
                  Pay an Author
                </h3>

                <p className="mt-1 text-sm text-forest/60">
                  Send an author's available earnings
                  directly to their M-Pesa number.
                </p>

              </div>

              <div className="flex flex-wrap items-end gap-3">

                {/* Author */}

                <div className="min-w-[260px] flex-1">

                  <label className="text-xs font-extrabold uppercase tracking-wide text-forest/50">
                    Author
                  </label>

                  <select
                    value={
                      payoutSellerId
                    }
                    onChange={(event) =>
                      setPayoutSellerId(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-2xl border border-forest/10 bg-white px-3 py-3 text-sm"
                  >

                    <option value="">
                      Select author
                    </option>

                    {sellers
                      .filter(
                        (seller: any) =>
                          Number(
                            seller.balanceCents ||
                              0
                          ) > 0
                      )
                      .map(
                        (seller: any) => (
                          <option
                            key={seller.id}
                            value={seller.id}
                          >
                            {
                              seller.user
                                ?.name ||
                              seller.handle
                            }{" "}
                            —{" "}
                            {money(
                              seller.balanceCents
                            )}{" "}
                            available
                          </option>
                        )
                      )}

                  </select>

                </div>

                {/* Amount */}

                <div className="w-44">

                  <label className="text-xs font-extrabold uppercase tracking-wide text-forest/50">
                    Amount (KSh)
                  </label>

                  <input
                    value={
                      payoutAmount
                    }
                    onChange={(event) =>
                      setPayoutAmount(
                        event.target.value
                      )
                    }
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 500"
                    className="mt-2 w-full rounded-2xl border border-forest/10 bg-white px-3 py-3 text-sm"
                  />

                </div>

                {/* Send */}

                <button
                  disabled={
                    busy ===
                    "new-payout"
                  }
                  onClick={() =>
                    void createAndSendPayout()
                  }
                  className={btnClass(
                    "gold",
                    "md"
                  )}
                >
                  {busy ===
                  "new-payout"
                    ? "Sending…"
                    : "Send via M-Pesa"}
                </button>

              </div>

              <p className="mt-3 text-xs text-forest/55">
                The amount is reserved from the
                author's available balance before
                the M-Pesa B2C request is sent.
              </p>

            </div>

            {/* -------------------------------------------------
                PAYOUT TABLE
            ------------------------------------------------- */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px] text-left text-sm">

                <thead>

                  <tr className="border-b border-forest/10">

                    <Th>Author</Th>
                    <Th>Phone</Th>
                    <Th>Amount</Th>
                    <Th>Status</Th>
                    <Th>M-Pesa Reference</Th>
                    <Th>Date</Th>
                    <Th>Action</Th>

                  </tr>

                </thead>

                <tbody>

                  {payouts.map(
                    (payout: any) => (
                      <tr
                        key={payout.id}
                        className="border-b border-forest/5"
                      >

                        <Td>
                          {
                            payout.seller
                              ?.user
                              ?.name ||
                            payout.seller
                              ?.handle ||
                            "—"
                          }
                        </Td>

                        <Td>
                          {payout.phone}
                        </Td>

                        <Td>
                          {money(
                            payout.amountCents
                          )}
                        </Td>

                        <Td>
                          <Badge>
                            {payout.status}
                          </Badge>
                        </Td>

                        <Td>
                          {payout.reference ||
                            "—"}
                        </Td>

                        <Td>
                          {date(
                            payout.createdAt
                          )}
                        </Td>

                        <Td>

                          {payout.status ===
                          "PAID" ? (
                            <span className="font-bold text-green-700">
                              Completed
                            </span>
                          ) : payout.status ===
                            "PROCESSING" ? (
                            <span className="text-sm font-bold text-amber-700">
                              Waiting for Safaricom…
                            </span>
                          ) : (
                            <button
                              disabled={
                                busy ===
                                payout.id
                              }
                              onClick={() =>
                                void sendExistingPayout(
                                  payout.id
                                )
                              }
                              className={btnClass(
                                "gold",
                                "sm"
                              )}
                            >
                              {busy ===
                              payout.id
                                ? "Sending…"
                                : "Pay via M-Pesa"}
                            </button>
                          )}

                        </Td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {!payouts.length && (
              <div className="py-12 text-center text-sm text-forest/50">
                No payout records yet.
              </div>
            )}

          </Panel>
        )}

      </Container>
    </section>
  );
}

/* ============================================================
   REUSABLE COMPONENTS
============================================================ */

function Panel({
  title,
  children,
  className = "",
}: any) {
  return (
    <div
      className={`rounded-3xl border border-forest/10 bg-white p-6 ${className}`}
    >
      <h2 className="text-xl font-extrabold text-deep">
        {title}
      </h2>

      {children}
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="rounded-3xl border border-forest/10 bg-white p-5">

      <p className="text-xs font-bold uppercase tracking-wide text-forest/50">
        {label}
      </p>

      <p className="mt-2 text-2xl font-extrabold text-deep">
        {value ?? "—"}
      </p>

    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="flex items-center justify-between border-b border-forest/5 py-3 text-sm">

      <span className="text-forest/60">
        {label}
      </span>

      <span className="font-extrabold text-deep">
        {value}
      </span>

    </div>
  );
}

function Th({
  children,
}: any) {
  return (
    <th className="p-3 text-xs font-extrabold uppercase tracking-wide text-forest/50">
      {children}
    </th>
  );
}

function Td({
  children,
}: any) {
  return (
    <td className="p-3 align-top">
      {children}
    </td>
  );
}

function Badge({
  children,
}: any) {
  return (
    <span className="inline-flex rounded-full bg-mint px-3 py-1 text-xs font-extrabold text-brand">
      {children}
    </span>
  );
}

function Empty({
  text,
}: {
  text: string;
}) {
  return (
    <div className="py-12 text-center text-sm text-forest/50">

      <Icon
        name="book"
        className="mx-auto h-8 w-8"
      />

      <p className="mt-3">
        {text}
      </p>

    </div>
  );
}

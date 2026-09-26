import { useCallback, useEffect, useMemo, useState } from "react";
import { Container, btnClass } from "@/components/ui";
import { Icon, Logo } from "@/components/Icon";
import { api, API_BASE } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { navigate } from "@/lib/router";

type Tab = "overview" | "orders" | "books" | "sellers" | "users" | "payouts";

const money = (cents = 0) => `KSh ${(Number(cents) / 100).toLocaleString("en-KE")}`;
const date = (value: string) => new Date(value).toLocaleString("en-KE");

export function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const [data, setData] = useState<any>();
  const [tab, setTab] = useState<Tab>("overview");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [reference, setReference] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setData(await api.adminDashboard());
    } catch (e: any) {
      setError(e?.message || "Could not load the admin dashboard.");
    }
  }, []);

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      navigate("/");
      return;
    }
    if (user?.role === "ADMIN") void load();
  }, [loading, user, load]);

  const stats = data?.stats || {};
  const orders = data?.orders || [];
  const books = data?.products || [];
  const sellers = data?.sellers || [];
  const users = data?.users || [];
  const payouts = data?.payouts || [];

  const paidOrders = useMemo(() => orders.filter((o: any) => ["PAID", "FULFILLED"].includes(o.status)), [orders]);
  const pendingPayouts = useMemo(() => payouts.filter((p: any) => p.status !== "PAID"), [payouts]);

  if (loading) return <div className="min-h-screen pt-32 text-center">Loading admin console…</div>;
  if (!user || user.role !== "ADMIN") return null;

  const setBookStatus = async (id: string, status: string) => {
    setBusy(id);
    try {
      await api.adminProductStatus(id, status);
      await load();
    } catch (e: any) {
      setError(e?.message || "Could not update book status.");
    } finally {
      setBusy("");
    }
  };

  const markPayoutPaid = async (id: string) => {
    setBusy(id);
    try {
      await api.adminMarkPayoutPaid(id, reference.trim() || undefined);
      setReference("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Could not update payout.");
    } finally {
      setBusy("");
    }
  };

  const tabs: [Tab, string][] = [
    ["overview", "Overview"],
    ["orders", "Orders"],
    ["books", "Books"],
    ["sellers", "Sellers"],
    ["users", "Users"],
    ["payouts", "Payouts"],
  ];

  return (
    <section className="min-h-screen bg-mint/40 pb-20 pt-24">
      <Container className="max-w-7xl">
        <header className="rounded-3xl border border-forest/10 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <p className="font-extrabold text-deep">UzaLink Admin Console</p>
                <p className="text-xs text-forest/50">Live marketplace management</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => void load()} className={btnClass("outline", "md")}>Refresh</button>
              <button onClick={async () => { await logout(); navigate("/"); }} className={btnClass("outline", "md")}>Log out</button>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} className={`rounded-full px-4 py-2 text-sm font-extrabold ${tab === key ? "bg-deep text-white" : "bg-mint text-forest"}`}>
                {label}
              </button>
            ))}
          </div>
        </header>

        {error && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-red-700">{error}</div>}

        {tab === "overview" && (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Users" value={stats.users} />
              <Stat label="Sellers" value={stats.sellers} />
              <Stat label="Published / books" value={stats.products} />
              <Stat label="Orders" value={stats.orders} />
              <Stat label="Gross sales" value={money(stats.grossCents)} />
              <Stat label="UzaLink commission" value={money(stats.commissionCents)} />
              <Stat label="Seller earnings" value={money(stats.sellerNetCents)} />
              <Stat label="Payout requests" value={stats.payouts} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Panel title="Marketplace health">
                <Row label="Books in database" value={books.length} />
                <Row label="Active books" value={books.filter((b: any) => b.status === "ACTIVE").length} />
                <Row label="Paused / archived" value={books.filter((b: any) => ["PAUSED", "ARCHIVED"].includes(b.status)).length} />
                <Row label="Completed sales" value={paidOrders.length} />
                <Row label="Payouts awaiting processing" value={pendingPayouts.length} />
              </Panel>
              <Panel title="Recent activity">
                {orders.slice(0, 5).map((o: any) => (
                  <div key={o.id} className="flex items-center justify-between border-b border-forest/5 py-3 text-sm">
                    <div>
                      <p className="font-bold text-deep">{o.items?.[0]?.product?.name || "Book order"}</p>
                      <p className="text-xs text-forest/50">{o.buyer?.name || o.buyerPhone || "Reader"} · {date(o.createdAt)}</p>
                    </div>
                    <span className="font-extrabold text-brand">{money(o.amountCents)}</span>
                  </div>
                ))}
                {!orders.length && <p className="py-8 text-center text-sm text-forest/50">No orders yet.</p>}
              </Panel>
            </div>
          </>
        )}

        {tab === "orders" && (
          <Panel title={`All orders (${orders.length})`} className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead><tr className="border-b border-forest/10">
                  <Th>Order</Th><Th>Reader</Th><Th>Book</Th><Th>Seller</Th><Th>Amount</Th><Th>Status</Th><Th>Payment</Th><Th>Date</Th>
                </tr></thead>
                <tbody>{orders.map((o: any) => {
                  const item = o.items?.[0];
                  return <tr key={o.id} className="border-b border-forest/5">
                    <Td>{o.publicId}</Td><Td>{o.buyer?.name || "—"}<br /><span className="text-xs text-forest/50">{o.buyerPhone || ""}</span></Td>
                    <Td>{item?.product?.name || "—"}</Td><Td>{item?.product?.seller?.user?.name || item?.product?.seller?.handle || "—"}</Td>
                    <Td>{money(o.amountCents)}</Td><Td><Badge>{o.status}</Badge></Td><Td>{o.payments?.[0]?.receipt || o.payments?.[0]?.status || "Pending"}</Td><Td>{date(o.createdAt)}</Td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
          </Panel>
        )}

        {tab === "books" && (
          <Panel title={`Books (${books.length})`} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {books.map((book: any) => (
                <div key={book.id} className="overflow-hidden rounded-3xl border border-forest/10 bg-mint/20">
                  <div className="h-56 bg-mint">
                    {book.code ? <img src={`${API_BASE}/api/products/${encodeURIComponent(book.code)}/cover`} alt={book.name} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div><h3 className="font-extrabold text-deep">{book.name}</h3><p className="text-xs text-forest/50">{book.seller?.user?.name || book.seller?.handle || "Unknown seller"}</p></div>
                      <Badge>{book.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-forest/60 line-clamp-2">{book.description}</p>
                    <p className="mt-3 font-extrabold text-deep">{money(book.priceCents)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["ACTIVE", "PAUSED", "ARCHIVED"].map(status => (
                        <button key={status} disabled={busy === book.id || book.status === status} onClick={() => void setBookStatus(book.id, status)} className={btnClass(status === "ACTIVE" ? "gold" : "outline", "sm")}>
                          {busy === book.id ? "Saving…" : status === "ACTIVE" ? "Publish" : status[0] + status.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!books.length && <Empty text="No books in the database yet." />}
          </Panel>
        )}

        {tab === "sellers" && (
          <Panel title={`Sellers (${sellers.length})`} className="mt-6">
            <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm">
              <thead><tr className="border-b border-forest/10"><Th>Seller</Th><Th>Handle</Th><Th>Books</Th><Th>Available</Th><Th>Pending</Th><Th>Lifetime</Th><Th>Orders</Th><Th>Joined</Th></tr></thead>
              <tbody>{sellers.map((s: any) => <tr key={s.id} className="border-b border-forest/5"><Td>{s.user?.name || "—"}</Td><Td>@{s.handle}</Td><Td>{s.products?.length || 0}</Td><Td>{money(s.balanceCents)}</Td><Td>{money(s.pendingCents)}</Td><Td>{money(s.lifetimeSalesCents)}</Td><Td>{s.totalOrders || 0}</Td><Td>{date(s.createdAt)}</Td></tr>)}</tbody>
            </table></div>
          </Panel>
        )}

        {tab === "users" && (
          <Panel title={`Users (${users.length})`} className="mt-6">
            <div className="overflow-x-auto"><table className="w-full min-w-[750px] text-left text-sm">
              <thead><tr className="border-b border-forest/10"><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Joined</Th></tr></thead>
              <tbody>{users.map((u: any) => <tr key={u.id} className="border-b border-forest/5"><Td>{u.name}</Td><Td>{u.email}</Td><Td><Badge>{u.role}</Badge></Td><Td>{date(u.createdAt)}</Td></tr>)}</tbody>
            </table></div>
          </Panel>
        )}

        {tab === "payouts" && (
          <Panel title={`Payouts (${payouts.length})`} className="mt-6">
            <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
              <thead><tr className="border-b border-forest/10"><Th>Seller</Th><Th>Phone</Th><Th>Amount</Th><Th>Status</Th><Th>Reference</Th><Th>Date</Th><Th>Action</Th></tr></thead>
              <tbody>{payouts.map((p: any) => <tr key={p.id} className="border-b border-forest/5">
                <Td>{p.seller?.user?.name || p.seller?.handle || "—"}</Td><Td>{p.phone}</Td><Td>{money(p.amountCents)}</Td><Td><Badge>{p.status}</Badge></Td><Td>{p.reference || "—"}</Td><Td>{date(p.createdAt)}</Td>
                <Td>{p.status !== "PAID" ? <div className="flex items-center gap-2"><input value={busy === p.id ? reference : ""} onChange={e => setReference(e.target.value)} placeholder="M-Pesa ref" className="w-28 rounded-xl border border-forest/10 px-2 py-2 text-xs" /><button disabled={busy === p.id} onClick={() => void markPayoutPaid(p.id)} className={btnClass("gold", "sm")}>{busy === p.id ? "Saving…" : "Mark paid"}</button></div> : "Completed"}</Td>
              </tr>)}</tbody>
            </table></div>
          </Panel>
        )}
      </Container>
    </section>
  );
}

function Panel({ title, children, className = "" }: any) {
  return <div className={`rounded-3xl border border-forest/10 bg-white p-6 ${className}`}><h2 className="text-xl font-extrabold text-deep">{title}</h2>{children}</div>;
}
function Stat({ label, value }: { label: string; value: any }) {
  return <div className="rounded-3xl border border-forest/10 bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-forest/50">{label}</p><p className="mt-2 text-2xl font-extrabold text-deep">{value ?? "—"}</p></div>;
}
function Row({ label, value }: { label: string; value: any }) {
  return <div className="flex items-center justify-between border-b border-forest/5 py-3 text-sm"><span className="text-forest/60">{label}</span><span className="font-extrabold text-deep">{value}</span></div>;
}
function Th({ children }: any) { return <th className="p-3 text-xs font-extrabold uppercase tracking-wide text-forest/50">{children}</th>; }
function Td({ children }: any) { return <td className="p-3 align-top">{children}</td>; }
function Badge({ children }: any) { return <span className="inline-flex rounded-full bg-mint px-3 py-1 text-xs font-extrabold text-brand">{children}</span>; }
function Empty({ text }: { text: string }) { return <div className="py-12 text-center text-sm text-forest/50"><Icon name="book" className="mx-auto h-8 w-8" /><p className="mt-3">{text}</p></div>; }

import { useState } from "react";
import { cn } from "@/utils/cn";
import {
  DASHBOARD_NAV,
  ORDERS,
  PRODUCTS,
  SALES_SERIES,
  SELLER,
  SETTLEMENT_NOTE,
  commissionOf,
  formatKsh,
  magicLink,
  sellerOf,
  type DashboardKey,
} from "@/lib/data";
import { Link, navigate } from "@/lib/router";
import { Icon, Logo } from "@/components/Icon";
import { Badge, Container, btnClass } from "@/components/ui";
import { QrCode, ShareSheet, useCopy } from "@/components/ShareSheet";

const myProducts = PRODUCTS.filter((p) => p.seller === SELLER.name);

function StatCard({
  icon,
  label,
  value,
  sub,
  tone = "white",
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  tone?: "white" | "gold" | "deep";
}) {
  return (
    <div
      className={cn(
        "rounded-3xl p-5 shadow-[0_20px_45px_-38px_rgba(4,40,26,0.6)]",
        tone === "gold" ? "gold-gradient text-deep" : tone === "deep" ? "brand-gradient text-white" : "border border-forest/10 bg-white",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            tone === "gold" ? "bg-white/70 text-deep" : tone === "deep" ? "bg-white/15 text-gold" : "bg-mint text-brand",
          )}
        >
          <Icon name={icon} className="h-5 w-5" />
        </span>
        {sub && (
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-extrabold",
              tone === "white" ? "bg-mint text-forest" : "bg-white/20 text-white",
            )}
          >
            {sub}
          </span>
        )}
      </div>
      <p className="mt-4 text-[13px] font-bold uppercase tracking-wide opacity-65">{label}</p>
      <p className="mt-1.5 text-[26px] font-extrabold leading-none">{value}</p>
    </div>
  );
}

function Chart({ data, tone = "brand" }: { data: { day: string; value: number }[]; tone?: "brand" | "gold" }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex h-44 items-end gap-2.5 sm:gap-4">
      {data.map((d, i) => (
        <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-[10.5px] font-extrabold text-forest/55">
            {(d.value / 1000).toFixed(1)}k
          </span>
          <div
            className={cn(
              "w-full rounded-t-xl transition-all duration-500",
              tone === "gold" ? "gold-gradient" : i === data.length - 2 ? "gold-gradient" : "bg-brand/75",
            )}
            style={{ height: `${Math.max(8, (d.value / max) * 100)}%` }}
          />
          <span className="text-[11.5px] font-bold text-forest/60">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_20px_45px_-40px_rgba(4,40,26,0.6)] sm:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[18px] text-deep sm:text-[20px]">{title}</h3>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Row({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 items-center gap-3 border-b border-forest/8 px-1 py-3.5 last:border-0 sm:grid-cols-4", className)}>
      {children}
    </div>
  );
}

function LockedPaymentCard() {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-brand/25 bg-mint/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-forest/55">
            Verified Payment Number
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-2.5 text-[26px] font-extrabold text-deep">
            {SELLER.paymentNumber}
            <Icon name="lock" className="h-6 w-6 text-brand" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-deep px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-white">
              Locked
            </span>
          </p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 text-right">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-forest/50">
            M-Pesa settlements
          </p>
          <p className="mt-1 text-[14px] font-extrabold text-brand">Active</p>
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-forest/70">
        Verified on {SELLER.verifiedSince} · Ownership confirmed by SMS code. This number receives
        95% of every verified sale and is permanently locked to your store. To move settlements, a
        signed verification request is required.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge tone="card" icon="checkCircle">
          Ownership verified
        </Badge>
        <Badge tone="card" icon="shield">
          Fraud protected
        </Badge>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [tab, setTab] = useState<DashboardKey>("overview");
  const [shareLink, setShareLink] = useState<string | null>(null);
  const { copy } = useCopy();

  return (
    <div className="min-h-screen bg-mint/40 pb-20 pt-24 sm:pt-28">
      <Container className="max-w-6xl">
        {/* top bar */}
        <div className="flex flex-col gap-4 rounded-[28px] border border-forest/10 bg-white p-5 shadow-[0_20px_50px_-42px_rgba(4,40,26,0.6)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden h-9 w-px bg-forest/10 sm:block" />
            <div className="hidden sm:block">
              <p className="text-[15px] font-extrabold leading-tight text-deep">{SELLER.name}</p>
              <p className="text-[12.5px] text-forest/60">{SELLER.handle}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full gold-gradient px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-deep">
              <Icon name="sparkles" className="h-3.5 w-3.5" />
              Premium · {formatKsh(SELLER.planPrice)}/mo
            </span>
            <Link to="/sell" className={btnClass("deep", "md", "h-11! px-4! text-[13.5px]!")}>
              <Icon name="plus" className="h-4 w-4" />
              New product
            </Link>
            <Link to="/" className={btnClass("outline", "md", "h-11! px-4! text-[13.5px]!")}>
              <Icon name="logout" className="h-4 w-4" />
              Log out
            </Link>
          </div>
        </div>

        {/* mobile section chips */}
        <div className="mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar lg:hidden">
          {DASHBOARD_NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setTab(n.key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2.5 text-[13px] font-extrabold transition-all",
                tab === n.key
                  ? "border-deep bg-deep text-white"
                  : "border-forest/12 bg-white text-forest/75",
              )}
            >
              <Icon name={n.icon} className="h-4 w-4" />
              {n.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[230px_1fr]">
          {/* sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-forest/10 bg-white p-3">
              {DASHBOARD_NAV.map((n) => (
                <button
                  key={n.key}
                  onClick={() => setTab(n.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-[14px] font-bold transition-all",
                    tab === n.key ? "bg-deep text-white" : "text-forest/75 hover:bg-mint",
                  )}
                >
                  <Icon
                    name={n.icon}
                    className={cn("h-4.5 w-4.5", tab === n.key ? "text-gold" : "text-forest/50")}
                  />
                  {n.label}
                </button>
              ))}
            </div>
          </aside>

          {/* content */}
          <main className="space-y-5">
            {tab === "overview" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard icon="cart" label="Total sales" value={SELLER.totalSales.toLocaleString()} sub="+12.4%" />
                  <StatCard icon="trend" label="Revenue" value={formatKsh(SELLER.revenue)} sub="+8.1%" />
                  <StatCard icon="wallet" label="Available balance" value={formatKsh(SELLER.availableBalance)} tone="deep" />
                  <StatCard icon="bank" label="Pending settlement" value={formatKsh(SELLER.pendingSettlement)} tone="gold" />
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
                  <Panel
                    title="Sales this week"
                    action={
                      <span className="inline-flex items-center gap-1.5 text-[12.5px] font-extrabold text-brand">
                        <Icon name="trend" className="h-4 w-4" />
                        +18.6% vs last week
                      </span>
                    }
                  >
                    <Chart data={SALES_SERIES} />
                  </Panel>
                  <Panel title="Commission split">
                    <div className="space-y-2.5">
                      <div className="rounded-2xl bg-mint/70 p-4">
                        <p className="text-[12.5px] font-bold text-forest/70">Gross sales</p>
                        <p className="mt-1 text-[20px] font-extrabold text-deep">
                          {formatKsh(SELLER.revenue)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 ring-1 ring-forest/10">
                        <p className="text-[12.5px] font-bold text-forest/70">
                          UZALINK commission (5%)
                        </p>
                        <p className="mt-1 text-[20px] font-extrabold text-deep">
                          {formatKsh(SELLER.commissionPaid)}
                        </p>
                      </div>
                      <div className="brand-gradient rounded-2xl p-4 text-white">
                        <p className="text-[12.5px] font-bold text-white/75">Your 95%</p>
                        <p className="mt-1 text-[20px] font-extrabold text-gold">
                          {formatKsh(SELLER.revenue - SELLER.commissionPaid)}
                        </p>
                      </div>
                    </div>
                  </Panel>
                </div>

                <LockedPaymentCard />

                <Panel
                  title="Recent orders"
                  action={
                    <button
                      onClick={() => setTab("orders")}
                      className="text-[13px] font-extrabold text-brand hover:underline"
                    >
                      View all
                    </button>
                  }
                >
                  <div>
                    {ORDERS.slice(0, 4).map((o) => (
                      <Row key={o.ref}>
                        <span className="font-mono text-[13px] font-extrabold text-deep">{o.ref}</span>
                        <span className="truncate text-[13.5px] font-semibold text-forest/75">
                          {o.product}
                        </span>
                        <span className="text-[13.5px] font-extrabold text-deep">
                          {formatKsh(o.amount)}
                        </span>
                        <span
                          className={cn(
                            "justify-self-start rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide sm:justify-self-end",
                            o.status === "Verified"
                              ? "bg-goldsoft text-[#8a6300]"
                              : o.status === "Settled"
                                ? "bg-mint text-forest"
                                : "bg-forest/5 text-forest/60",
                          )}
                        >
                          {o.status}
                        </span>
                      </Row>
                    ))}
                  </div>
                </Panel>
              </>
            )}

            {tab === "earnings" && (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard icon="wallet" label="Available now" value={formatKsh(SELLER.availableBalance)} tone="deep" />
                  <StatCard icon="clock" label="In settlement" value={formatKsh(SELLER.pendingSettlement)} tone="gold" />
                  <StatCard icon="trend" label="Lifetime earnings" value={formatKsh(SELLER.revenue - SELLER.commissionPaid)} />
                </div>
                <Panel title="Earnings by day">
                  <Chart data={SALES_SERIES} tone="gold" />
                </Panel>
                <Panel title="How your earnings are calculated">
                  <div className="space-y-2.5">
                    {[
                      { l: "Sale price (example)", v: 1000 },
                      { l: "UZALINK commission (5%)", v: commissionOf(1000) },
                      { l: "Seller balance (95%)", v: sellerOf(1000) },
                    ].map((r, i) => (
                      <div
                        key={r.l}
                        className={cn(
                          "flex items-center justify-between rounded-2xl px-5 py-4",
                          i === 2 ? "brand-gradient text-white" : "bg-mint/60",
                        )}
                      >
                        <span className={cn("text-[13.5px] font-bold", i === 2 ? "text-white/85" : "text-forest/75")}>
                          {i === 1 ? "− " : ""}
                          {r.l}
                        </span>
                        <span className={cn("text-[18px] font-extrabold", i === 2 ? "text-gold" : "text-deep")}>
                          {formatKsh(r.v)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 flex gap-2.5 rounded-2xl bg-goldsoft/70 p-4 text-[12.5px] leading-relaxed text-[#7a5a00]">
                    <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0" />
                    {SETTLEMENT_NOTE}
                  </p>
                </Panel>
              </>
            )}

            {tab === "sales" && (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard icon="cart" label="Sales (30 days)" value="248" sub="+12.4%" />
                  <StatCard icon="tag" label="Average order" value={formatKsh(SELLER.avgOrder)} />
                  <StatCard icon="refresh" label="Repeat buyers" value="31%" tone="gold" />
                </div>
                <Panel title="Sales trend">
                  <Chart data={SALES_SERIES} />
                </Panel>
                <Panel title="Best selling days">
                  <div className="space-y-2.5">
                    {[
                      { d: "Saturday", v: "31% of weekly sales" },
                      { d: "Friday", v: "24% of weekly sales" },
                      { d: "Sunday", v: "19% of weekly sales" },
                    ].map((r) => (
                      <div key={r.d} className="flex items-center justify-between rounded-2xl bg-mint/60 px-4 py-3.5">
                        <span className="text-[14px] font-extrabold text-deep">{r.d}</span>
                        <span className="text-[13px] font-semibold text-forest/70">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </Panel>
              </>
            )}

            {tab === "products" && (
              <Panel
                title={`Products (${myProducts.length})`}
                action={
                  <Link to="/sell" className={btnClass("gold", "md", "h-10! px-4! text-[13px]!")}>
                    <Icon name="plus" className="h-4 w-4" />
                    New product
                  </Link>
                }
              >
                <div>
                  {myProducts.map((p) => (
                    <Row key={p.code}>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="h-11 w-11 rounded-xl object-cover" />
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-extrabold text-deep">{p.name}</p>
                          <p className="text-[12px] text-forest/60">{p.type}</p>
                        </div>
                      </div>
                      <span className="text-[13.5px] font-extrabold text-deep">{formatKsh(p.price)}</span>
                      <span className="text-[13px] font-semibold text-forest/70">
                        {p.sales.toLocaleString()} sold
                      </span>
                      <Link
                        to={`/magic/${p.code}`}
                        className="justify-self-start text-[13px] font-extrabold text-brand hover:underline sm:justify-self-end"
                      >
                        View page
                      </Link>
                    </Row>
                  ))}
                </div>
              </Panel>
            )}

            {tab === "magic" && (
              <Panel title="Magic Links" action={<Badge tone="mint" icon="link">Live links</Badge>}>
                <div className="space-y-3">
                  {myProducts.map((p) => (
                    <div
                      key={p.code}
                      className="rounded-2xl border border-forest/10 bg-mint/40 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[14.5px] font-extrabold text-deep">{p.name}</p>
                          <p className="mt-1 font-mono text-[12.5px] text-forest/70">
                            {magicLink(p.code)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => copy(`https://${magicLink(p.code)}`)}
                            className={btnClass("outline", "sm", "h-10! px-3.5! text-[12.5px]!")}
                          >
                            <Icon name="copy" className="h-4 w-4" />
                            Copy
                          </button>
                          <button
                            onClick={() => setShareLink(magicLink(p.code))}
                            className={btnClass("gold", "sm", "h-10! px-3.5! text-[12.5px]!")}
                          >
                            <Icon name="share" className="h-4 w-4" />
                            Share
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <QrCode value={magicLink(p.code)} size={90} />
                        <div className="space-y-1.5 text-[12.5px] font-semibold text-forest/70">
                          <p className="flex items-center gap-2">
                            <Icon name="eye" className="h-4 w-4 text-brand" /> 1,240 link views
                          </p>
                          <p className="flex items-center gap-2">
                            <Icon name="cart" className="h-4 w-4 text-brand" /> {p.sales} conversions
                          </p>
                          <p className="flex items-center gap-2">
                            <Icon name="bolt" className="h-4 w-4 text-brand" /> 18.4% conversion
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {tab === "customers" && (
              <Panel title={`Customers (${ORDERS.length})`}>
                <div>
                  {ORDERS.map((o) => (
                    <Row key={o.ref}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-[11.5px] font-extrabold text-forest">
                          {o.buyer.split(" ").map((w) => w[0]).join("")}
                        </span>
                        <span className="text-[13.5px] font-extrabold text-deep">{o.buyer}</span>
                      </div>
                      <span className="truncate text-[13px] text-forest/70">{o.product}</span>
                      <span className="text-[13.5px] font-extrabold text-deep">
                        {formatKsh(o.amount)}
                      </span>
                      <span className="text-[12.5px] text-forest/60">{o.when}</span>
                    </Row>
                  ))}
                </div>
                <p className="mt-5 rounded-2xl bg-mint/60 p-4 text-[12.5px] leading-relaxed text-forest/70">
                  Customer details come from their payment — UZALINK never asks buyers to register.
                </p>
              </Panel>
            )}

            {tab === "orders" && (
              <Panel title="Orders" action={<Badge tone="mint" icon="checkCircle">Auto-verified</Badge>}>
                <div>
                  {ORDERS.map((o) => (
                    <Row key={o.ref}>
                      <span className="font-mono text-[13px] font-extrabold text-deep">{o.ref}</span>
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-extrabold text-deep">{o.product}</p>
                        <p className="text-[12px] text-forest/60">
                          {o.buyer} · {o.when} · {o.type}
                        </p>
                      </div>
                      <span className="text-[13.5px] font-extrabold text-deep">
                        {formatKsh(o.amount)}
                      </span>
                      <span
                        className={cn(
                          "justify-self-start rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide sm:justify-self-end",
                          o.status === "Verified"
                            ? "bg-goldsoft text-[#8a6300]"
                            : o.status === "Settled"
                              ? "bg-mint text-forest"
                              : "bg-forest/5 text-forest/60",
                        )}
                      >
                        {o.status}
                      </span>
                    </Row>
                  ))}
                </div>
              </Panel>
            )}

            {tab === "downloads" && (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard icon="download" label="Total downloads" value="3,982" sub="+9.2%" />
                  <StatCard icon="file" label="Files hosted" value={String(myProducts.length * 2)} />
                  <StatCard icon="shield" label="Delivered after verification" value="100%" tone="gold" />
                </div>
                <Panel title="Digital delivery log">
                  <div>
                    {ORDERS.filter((o) => o.type === "Digital").map((o) => (
                      <Row key={o.ref}>
                        <span className="font-mono text-[13px] font-extrabold text-deep">{o.ref}</span>
                        <span className="truncate text-[13.5px] font-semibold text-forest/75">
                          {o.product}
                        </span>
                        <span className="text-[12.5px] text-forest/60">{o.when}</span>
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-brand sm:justify-self-end">
                          <Icon name="download" className="h-4 w-4" />
                          Unlocked
                        </span>
                      </Row>
                    ))}
                  </div>
                </Panel>
              </>
            )}

            {tab === "analytics" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard icon="eye" label="Link views" value={SELLER.views.toLocaleString()} />
                  <StatCard icon="trend" label="Conversion" value={`${SELLER.conversion}%`} tone="gold" />
                  <StatCard icon="tag" label="Average order" value={formatKsh(SELLER.avgOrder)} />
                  <StatCard icon="refresh" label="Repeat rate" value="31%" />
                </div>
                <Panel title="Revenue by day">
                  <Chart data={SALES_SERIES} />
                </Panel>
                <Panel title="Top products">
                  <div className="space-y-3">
                    {myProducts.map((p, i) => {
                      const pct = [72, 46, 22][i] ?? 12;
                      return (
                        <div key={p.code}>
                          <div className="flex items-center justify-between text-[13.5px]">
                            <span className="truncate font-bold text-deep">{p.name}</span>
                            <span className="ml-3 shrink-0 font-extrabold text-forest/70">
                              {pct}%
                            </span>
                          </div>
                          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-mint">
                            <span
                              className={cn("block h-full rounded-full", i === 0 ? "gold-gradient" : "bg-brand/75")}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              </>
            )}

            {tab === "settlements" && (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard icon="bank" label="Next payout" value={formatKsh(SELLER.pendingSettlement)} tone="deep" sub="Today" />
                  <StatCard icon="checkCircle" label="Settled this month" value={formatKsh(312_400)} />
                  <StatCard icon="lock" label="Payout number" value={SELLER.paymentNumber} tone="gold" />
                </div>
                <Panel title="Settlement history">
                  <div>
                    {[
                      { d: "Today, 09:12", a: SELLER.pendingSettlement, s: "Processing" },
                      { d: "Yesterday, 17:40", a: 18_900, s: "Paid" },
                      { d: "Mon, 16:05", a: 24_150, s: "Paid" },
                      { d: "Sun, 18:22", a: 12_300, s: "Paid" },
                      { d: "Sat, 15:48", a: 31_750, s: "Paid" },
                    ].map((s) => (
                      <Row key={s.d}>
                        <span className="text-[13.5px] font-extrabold text-deep">{s.d}</span>
                        <span className="text-[13px] text-forest/70">M-Pesa · {SELLER.paymentNumber}</span>
                        <span className="text-[13.5px] font-extrabold text-deep">{formatKsh(s.a)}</span>
                        <span
                          className={cn(
                            "justify-self-start rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide sm:justify-self-end",
                            s.s === "Paid" ? "bg-mint text-forest" : "bg-goldsoft text-[#8a6300]",
                          )}
                        >
                          {s.s}
                        </span>
                      </Row>
                    ))}
                  </div>
                </Panel>
                <p className="rounded-3xl border border-forest/10 bg-white p-5 text-[13px] leading-relaxed text-forest/70">
                  {SETTLEMENT_NOTE}
                </p>
              </>
            )}

            {tab === "payment" && (
              <>
                <LockedPaymentCard />
                <Panel title="Payment settings">
                  <div className="space-y-3">
                    {[
                      { icon: "lock", t: "Payment number locked", d: "Locked for security. Settlements cannot be redirected from this dashboard — UZALINK support requires identity verification first." },
                      { icon: "shield", t: "Ownership verification", d: `Verified by SMS code on ${SELLER.verifiedSince}.` },
                      { icon: "bank", t: "Settlement channel", d: "M-Pesa · 95% of every verified sale · within 6 business working hours." },
                      { icon: "receipt", t: "Settlement statement", d: "Available for every payout in your Settlements history." },
                    ].map((r) => (
                      <div
                        key={r.t}
                        className="flex items-start gap-3.5 rounded-2xl border border-forest/10 bg-white p-4"
                      >
                        <span
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                            r.icon === "lock" ? "bg-mint text-brand" : "bg-mint/70 text-forest",
                          )}
                        >
                          <Icon name={r.icon} className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-[14.5px] font-extrabold text-deep">{r.t}</p>
                          <p className="mt-1 text-[13px] leading-relaxed text-forest/70">{r.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
                <div className="rounded-3xl border-2 border-gold bg-goldsoft p-5">
                  <p className="flex items-center gap-2 text-[12.5px] font-extrabold uppercase tracking-[0.14em] text-[#8a6300]">
                    <Icon name="alert" className="h-4 w-4" />
                    Important
                  </p>
                  <p className="mt-2.5 text-[14.5px] font-bold leading-relaxed text-[#6d4f00]">
                    Payment numbers cannot be changed after setup. There is no self-service change
                    button — this protects your settlements from takeover attempts.
                  </p>
                </div>
              </>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl brand-gradient p-5 text-white sm:p-6">
              <div>
                <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-gold">
                  Keep growing
                </p>
                <p className="mt-2 text-[19px] font-extrabold">Share a Magic Link right now</p>
                <p className="mt-1.5 text-[13.5px] text-white/70">
                  Sellers who share daily sell 3× more. Your link is always live.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShareLink(magicLink(myProducts[0].code))}
                  className={btnClass("gold", "md")}
                >
                  <Icon name="share" className="h-4.5 w-4.5" />
                  Share link
                </button>
                <button
                  onClick={() => navigate("/explore")}
                  className={btnClass("white", "md")}
                >
                  <Icon name="compass" className="h-4.5 w-4.5" />
                  Explore Us
                </button>
              </div>
            </div>
          </main>
        </div>
      </Container>

      {shareLink && (
        <ShareSheet
          open={!!shareLink}
          onClose={() => setShareLink(null)}
          link={shareLink}
          message="Check out this product on UZALINK:"
        />
      )}
    </div>
  );
}

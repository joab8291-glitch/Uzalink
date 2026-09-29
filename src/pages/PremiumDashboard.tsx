import { useEffect, useMemo, useState } from "react";
import { Container, btnClass } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { api, API_BASE } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { navigate } from "@/lib/router";

const money = (cents = 0) => `KSh ${(Number(cents) / 100).toLocaleString("en-KE")}`;

const NAV = [
  ["overview", "Overview", "grid"],
  ["earnings", "Earnings", "wallet"],
  ["sales", "Sales", "shoppingBag"],
  ["products", "Products", "package"],
  ["magic", "Magic Links", "link"],
  ["customers", "Customers", "users"],
  ["orders", "Orders", "shoppingBag"],
  ["downloads", "Downloads", "download"],
  ["analytics", "Analytics", "chart"],
  ["settlements", "Settlements", "wallet"],
  ["settings", "Payment Settings", "settings"],
];

export function PremiumDashboard() {
  const { user, loading, logout } = useAuth();
  const [data, setData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [tab, setTab] = useState("overview");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const result = await api.sellerDashboard();
      setData(result);
      setAnalytics(await api.sellerAnalytics().catch(() => null));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load Premium dashboard.");
    }
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== "SELLER" || !user.premium)) {
      navigate("/premium-login");
      return;
    }
    if (user?.role === "SELLER" && user.premium) void load();
  }, [loading, user]);

  if (loading || !user) return <div className="min-h-screen pt-32 text-center">Loading Premium dashboard…</div>;
  if (user.role !== "SELLER" || !user.premium) return null;

  const seller = data?.seller;
  const orders = data?.orders || [];
  const products = seller?.products || data?.products || [];
  const gross = Number(seller?.lifetimeSalesCents || 0);
  const commission = Math.round(gross * .05);
  const net = gross - commission;

  const weekly = useMemo(() => {
    const r: Record<string, number> = {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0};
    for (const o of orders) {
      if (!["PAID","FULFILLED"].includes(o.status)) continue;
      const d = new Date(o.createdAt).toLocaleDateString("en-US",{weekday:"short"});
      if (d in r) r[d] += Number(o.amountCents || 0);
    }
    return r;
  }, [orders]);

  const max = Math.max(...Object.values(weekly), 1);

  return (
    <section className="min-h-screen bg-[#f5faf7] pb-20 pt-24">
      <Container className="max-w-[1400px]">
        <header className="rounded-[28px] border border-forest/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src="/uzalink-logo.svg" alt="UzaLink Kenya" className="h-12 w-auto shrink-0 object-contain" />
              <div>
                <p className="text-lg font-black text-deep">UZALINK Kenya</p>
                <p className="text-sm font-semibold text-forest/55">{user.name} · @{seller?.handle || "premium-seller"}</p>
              </div>
              <span className="rounded-full bg-goldsoft px-3 py-1 text-xs font-black text-deep">Premium · KSh 1,000/mo</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => void load()} className={btnClass("outline","md")}>Refresh</button>
              <button onClick={async()=>{await logout();navigate("/")}} className={btnClass("outline","md")}>Log out</button>
            </div>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto border-t border-forest/10 pt-4">
            {NAV.map(([key,label,icon]) => (
              <button key={key} onClick={()=>setTab(key)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-extrabold ${tab===key?"bg-deep text-white":"bg-mint text-forest"}`}>
                <Icon name={icon} className="h-4 w-4" />{label}
              </button>
            ))}
          </div>
        </header>

        {error && <div className="mt-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-700">{error}</div>}

        {tab === "overview" && <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Total sales" value={seller?.totalOrders || 0} change="+12.4%" icon="shoppingBag"/>
            <Metric label="Revenue" value={money(gross)} change="+8.1%" icon="chart"/>
            <Metric label="Available balance" value={money(seller?.balanceCents || 0)} icon="wallet"/>
            <Metric label="Pending settlement" value={money(seller?.pendingCents || 0)} icon="clock"/>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
            <div className="rounded-[28px] border border-forest/10 bg-white p-6">
              <p className="text-xs font-black uppercase tracking-[.16em] text-brand">Sales this week</p>
              <div className="mt-8 flex h-56 items-end justify-between gap-2">
                {Object.entries(weekly).map(([day,value])=>(
                  <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="text-[10px] font-bold text-forest/50">{Number(value/100).toLocaleString("en-KE")}</span>
                    <div className="flex h-40 w-full items-end justify-center rounded-xl bg-mint/60">
                      <div className="w-2/3 rounded-t-xl bg-brand" style={{height:`${Math.max(5,(value/max)*100)}%`}}/>
                    </div>
                    <span className="text-xs font-bold text-forest/55">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-forest/10 bg-white p-6">
              <p className="text-xs font-black uppercase tracking-[.16em] text-brand">Commission split</p>
              <h2 className="mt-2 text-2xl font-black text-deep">Your sales, clearly split</h2>
              <div className="mt-6 space-y-4">
                <Split label="Gross sales" value={money(gross)}/>
                <Split label="UZALINK commission (5%)" value={money(commission)}/>
                <Split label="Your 95%" value={money(net)} strong/>
              </div>
              <div className="mt-6 rounded-2xl bg-mint p-4">
                <p className="text-xs font-black uppercase text-brand">Verified Payment Number</p>
                <p className="mt-2 text-lg font-black">{seller?.paymentNumber || "Not set"}</p>
                <p className="mt-2 text-xs font-semibold text-forest/55">{seller?.paymentVerifiedAt ? "Ownership verified by SMS code." : "Payment number verification pending."}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-forest/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-black uppercase tracking-[.16em] text-brand">Recent orders</p><h2 className="mt-1 text-2xl font-black">Latest sales activity</h2></div>
              <button onClick={()=>setTab("orders")} className="text-sm font-black text-brand">View all</button>
            </div>
            <OrdersTable orders={orders.slice(0,6)}/>
          </div>
        </>}

        {tab === "earnings" && <Panel title="Earnings" text="Track available balance, pending settlement and lifetime seller earnings."><div className="grid gap-4 sm:grid-cols-3"><Metric label="Available" value={money(seller?.balanceCents||0)} icon="wallet"/><Metric label="Pending" value={money(seller?.pendingCents||0)} icon="clock"/><Metric label="Lifetime" value={money(seller?.lifetimeSalesCents||0)} icon="chart"/></div></Panel>}
        {tab === "sales" && <Panel title="Sales" text="Your completed and paid seller orders."><OrdersTable orders={orders}/></Panel>}
        {tab === "orders" && <Panel title="Orders" text="Every order associated with your products."><OrdersTable orders={orders}/></Panel>}
        {tab === "products" && <Panel title={`Products (${products.length})`} text="Manage products connected to your Premium seller account."><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map((p:any)=><div key={p.id} className="overflow-hidden rounded-2xl border border-forest/10 bg-mint/30"><div className="h-40 bg-mint">{p.code&&<img src={`${API_BASE}/api/products/${encodeURIComponent(p.code)}/cover`} alt={p.name} className="h-full w-full object-cover" onError={e=>e.currentTarget.style.display="none"}/>}</div><div className="p-4"><h3 className="font-black">{p.name}</h3><p className="mt-1 text-xs font-bold text-brand">{p.category}</p><p className="mt-3 font-black">{money(p.priceCents)}</p>{p.code&&<button onClick={()=>navigate(`/magic/${p.code}`)} className={btnClass("deep","sm","mt-4 w-full")}>Open Magic Link</button>}</div></div>)}</div></Panel>}
        {tab === "magic" && <Panel title="Magic Links" text="Share one live link for every active offer."><div className="space-y-3">{products.map((p:any)=>{const link=`${window.location.origin}/#/magic/${p.code}`;return <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-mint/50 p-4"><div><p className="font-black">{p.name}</p><p className="break-all text-xs text-forest/50">{link}</p></div><button onClick={()=>navigator.clipboard.writeText(link)} className={btnClass("outline","sm")}>Copy Link</button></div>})}</div></Panel>}
        {tab === "customers" && <Panel title="Customers" text="Customers who purchased your products."><div className="grid gap-3 sm:grid-cols-2">{orders.map((o:any)=><div key={o.id} className="rounded-2xl bg-mint/50 p-4"><p className="font-black">{o.buyerName||"Customer"}</p><p className="text-sm text-forest/55">{o.buyerPhone}</p><p className="mt-2 text-xs font-bold text-brand">{o.publicId}</p></div>)}</div></Panel>}
        {tab === "downloads" && <Panel title="Downloads" text="Secure digital delivery and download tracking for purchased files."><p className="text-sm text-forest/60">Download activity is linked to verified digital orders and secure temporary download grants.</p></Panel>}
        {tab === "analytics" && <Panel title="Analytics" text="Performance from the last 30 days.">{analytics?<div className="grid gap-4 sm:grid-cols-3"><Metric label="30-day revenue" value={money(analytics.revenueCents||0)} icon="chart"/><Metric label="Paid orders" value={analytics.orderCount||0} icon="shoppingBag"/><Metric label="Top product" value={analytics.products?.[0]?.name||"—"} icon="package"/></div>:<p className="text-sm text-forest/55">No analytics available yet.</p>}</Panel>}
        {tab === "settlements" && <Panel title="Settlements" text="Your M-Pesa settlement account and balances."><div className="rounded-2xl bg-mint p-5"><p className="text-xs font-black uppercase text-forest/50">Settlement number</p><p className="mt-2 text-xl font-black">{seller?.paymentNumber||"Not set"}</p><p className="mt-2 text-sm text-forest/60">Available balance: {money(seller?.balanceCents||0)}</p></div></Panel>}
        {tab === "settings" && <Panel title="Payment Settings" text="Your verified settlement number receives your seller earnings."><div className="rounded-2xl bg-mint p-5"><p className="text-xs font-black uppercase text-forest/50">Verified Payment Number</p><p className="mt-2 text-xl font-black">{seller?.paymentNumber||"Not set"}</p><p className="mt-2 text-sm text-forest/60">{seller?.paymentVerifiedAt?"Ownership verified by SMS.":"Verification required."}</p></div></Panel>}

        <div className="mt-6 overflow-hidden rounded-[28px] bg-deep p-7 text-white">
          <p className="text-xs font-black uppercase tracking-[.16em] text-gold">Keep growing</p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">Share a Magic Link right now</h2>
          <p className="mt-2 max-w-xl text-sm text-white/65">Your link is always live while the product is active. Share it through WhatsApp, SMS or social media.</p>
          <button onClick={()=>setTab("magic")} className={btnClass("gold","lg","mt-5")}>Open Magic Links</button>
        </div>
      </Container>
    </section>
  );
}

function Metric({label,value,change,icon}:{label:string;value:any;change?:string;icon:string}) {
  return <div className="rounded-2xl border border-forest/10 bg-white p-5"><div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-brand"><Icon name={icon} className="h-5 w-5"/></span>{change&&<span className="rounded-full bg-mint px-2 py-1 text-xs font-black text-brand">{change}</span>}</div><p className="mt-4 text-xs font-black uppercase tracking-wide text-forest/45">{label}</p><p className="mt-1 text-2xl font-black text-deep">{value}</p></div>;
}
function Split({label,value,strong}:{label:string;value:string;strong?:boolean}) { return <div className="flex items-center justify-between border-b border-forest/5 pb-3"><span className="text-sm text-forest/60">{label}</span><span className={strong?"font-black text-brand":"font-bold text-deep"}>{value}</span></div>; }
function OrdersTable({orders}:{orders:any[]}) { return <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead><tr className="border-b border-forest/10">{["Order","Product","Amount","Status"].map(h=><th key={h} className="px-3 py-3 text-xs uppercase text-forest/45">{h}</th>)}</tr></thead><tbody>{orders.map((o:any)=><tr key={o.id} className="border-b border-forest/5"><td className="px-3 py-3 font-black">{o.publicId}</td><td className="px-3 py-3">{o.items?.[0]?.product?.name||"Product"}</td><td className="px-3 py-3 font-bold">{money(o.amountCents)}</td><td className="px-3 py-3"><span className="rounded-full bg-mint px-3 py-1 text-xs font-black text-brand">{o.status}</span></td></tr>)}</tbody></table>{!orders.length&&<p className="py-10 text-center text-sm text-forest/50">No orders yet.</p>}</div>; }
function Panel({title,text,children}:{title:string;text:string;children:React.ReactNode}) { return <div className="mt-6 rounded-[28px] border border-forest/10 bg-white p-6"><p className="text-xs font-black uppercase tracking-[.16em] text-brand">Premium seller workspace</p><h1 className="mt-2 text-3xl font-black text-deep">{title}</h1><p className="mt-2 text-sm text-forest/60">{text}</p><div className="mt-6">{children}</div></div>; }

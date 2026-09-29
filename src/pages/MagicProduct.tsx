import { useEffect, useState } from "react";
import { formatKsh, type Product } from "@/lib/data";
import { api } from "@/lib/api";
import { Link } from "@/lib/router";
import { Icon } from "@/components/Icon";
import { Badge, Container, Reveal, btnClass } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { ShareChannels } from "@/components/ShareSheet";
import { MarketplaceEngagement } from "@/components/MarketplaceEngagement";

function mapProduct(item: any): Product {
  const seller = item?.seller?.user?.name || item?.seller?.handle || "UzaLink Seller";
  return {
    code: item.code,
    name: item.name,
    seller,
    handle: item?.seller?.handle || "",
    sellerAvatarSeed: seller.split(/\s+/).filter(Boolean).map((x: string) => x[0]).join("").slice(0, 2).toUpperCase() || "US",
    type: item.kind || "Digital Product",
    category: item.category || "Other",
    description: item.description || "UzaLink offer",
    longDescription: item.description || "UzaLink offer",
    price: Number(item.priceCents || 0) / 100,
    image: `${(import.meta.env.VITE_UZALINK_API || "https://uzalink-backend.onrender.com").replace(/\/$/, "")}/api/products/${encodeURIComponent(item.code)}/cover`,
    delivery: item.deliveryText || "Delivered through UzaLink",
    rating: Number(item.rating || 0),
    sales: Number(item.salesCount || 0),
    instant: Boolean(item.instant),
  };
}

export function MagicProduct({ code }: { code: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const result = await api.product(code);
        if (result?.product && !cancelled) setProduct(mapProduct(result.product));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    const loadRelated = async () => {
      try {
        const result = await api.products();
        const items = Array.isArray(result?.products) ? result.products : [];
        if (!cancelled) setRelated(items.filter((item: any) => item.code !== code).slice(0, 3).map(mapProduct));
      } catch {
        if (!cancelled) setRelated([]);
      }
    };
    void load();
    void loadRelated();
    return () => { cancelled = true; };
  }, [code]);

  if (!product) {
    return <section className="min-h-screen bg-mint/40 pt-32"><Container className="max-w-2xl text-center"><h1 className="text-3xl text-deep">{loading ? "Loading product…" : "Product not found"}</h1><p className="mt-3 text-forest/65">{loading ? "Fetching the published offer from UzaLink." : "This product link is no longer available."}</p><Link to="/explore" className={btnClass("gold", "lg", "mt-6")}>Discover Products</Link></Container></section>;
  }

  return <>
    <section className="relative overflow-hidden bg-mint/60 pb-14 pt-28 sm:pt-32">
      <Container className="relative">
        <div className="flex flex-wrap items-center gap-3 text-[13px] font-semibold text-forest/60"><Link to="/" className="inline-flex items-center gap-1.5 hover:text-brand"><Icon name="home" className="h-4 w-4" />UZALINK</Link><Icon name="chevronRight" className="h-4 w-4 text-forest/30" /><Link to="/explore" className="hover:text-brand">Explore Marketplace</Link><Icon name="chevronRight" className="h-4 w-4 text-forest/30" /><span className="font-mono font-bold text-deep">/{product.code}</span></div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <Reveal><div className="overflow-hidden rounded-[32px] border border-forest/10 bg-white shadow-[0_30px_70px_-45px_rgba(4,40,26,0.5)]"><div className="relative aspect-[4/3] bg-mint"><img src={product.image} alt={`${product.name} product image`} className="h-full w-full object-cover" /><span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-forest shadow"><Icon name="product" className="h-3.5 w-3.5" />{product.type}</span>{product.instant && <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full gold-gradient px-3 py-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-deep shadow"><Icon name="bolt" className="h-3.5 w-3.5" strokeWidth={0} />Instant access</span>}</div><div className="grid grid-cols-3 divide-x divide-forest/10 border-t border-forest/10">{[{icon:"shield",label:"Verified payment"},{icon:"receipt",label:"Digital receipt"},{icon:"download",label:"Secure delivery"}].map(item=><div key={item.label} className="flex flex-col items-center gap-1.5 py-4 text-center"><Icon name={item.icon} className="h-5 w-5 text-brand" /><span className="px-1 text-[11px] font-bold leading-tight text-forest/70">{item.label}</span></div>)}</div></div></Reveal>
          <Reveal delay={90}><div className="flex h-full flex-col"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full gold-gradient text-[14px] font-extrabold text-deep">{product.sellerAvatarSeed}</span><div className="leading-tight"><p className="text-[15px] font-extrabold text-deep">{product.seller}</p><p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-forest/60"><Icon name="checkCircle" className="h-3.5 w-3.5 text-brand" />Seller on UZALINK · {product.handle}</p></div></div><h1 className="mt-5 text-[30px] leading-[1.08] text-deep sm:text-[40px]">{product.name}</h1><div className="mt-4 flex flex-wrap items-center gap-3"><span className="text-[34px] font-extrabold leading-none text-deep">{formatKsh(product.price)}</span><span className="rounded-full bg-mint px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-forest">{product.category}</span>{product.rating > 0 && <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-forest/70"><Icon name="star" className="h-4 w-4 text-gold" strokeWidth={0} />{product.rating.toFixed(1)} rating</span>}</div><div className="mt-6"><p className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-forest/45">About this offer</p><p className="mt-2 text-[16px] leading-relaxed text-forest/80">{product.longDescription || product.description}</p></div><div className="mt-6 space-y-2.5">{[{icon:"download",label:product.delivery || "Delivered securely through UzaLink"},{icon:"phone",label:"Pay with M-Pesa — simple Kenya-first checkout"},{icon:"lock",label:"Payment is verified before fulfillment"}].map(item=><div key={item.label} className="flex items-center gap-3 rounded-2xl border border-forest/10 bg-white px-4 py-3.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint text-brand"><Icon name={item.icon} className="h-4.5 w-4.5" /></span><span className="text-[13.5px] font-semibold leading-snug text-forest/80">{item.label}</span></div>)}</div><div className="mt-7 rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(4,40,26,0.6)]"><Link to={`/magic/${product.code}/checkout`} className={btnClass("gold", "xl", "w-full")}><Icon name="bolt" className="h-5.5 w-5.5" strokeWidth={0} />Buy Now · {formatKsh(product.price)}</Link><p className="mt-3 flex items-center justify-center gap-2 text-center text-[12.5px] font-semibold text-forest/65"><Icon name="checkCircle" className="h-4 w-4 shrink-0 text-brand" />No customer account required — pay and get secure access</p><div className="mt-5 border-t border-forest/10 pt-4"><p className="mb-3 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-forest/50">Share this offer</p><ShareChannels compact link={`uzalink.co.ke/magic/${product.code}`} message={`${product.name} — ${formatKsh(product.price)} on UZALINK:`} /></div></div><MarketplaceEngagement code={product.code} sellerId={(product as any).sellerId} priceCents={Math.round(product.price * 100)} /><div className="mt-5 flex flex-wrap gap-2"><Badge tone="card" icon="lock">Secure checkout</Badge><Badge tone="card" icon="download">Digital delivery</Badge><Badge tone="card" icon="refresh">95% goes to the seller</Badge></div></div></Reveal>
        </div>
      </Container>
    </section>
    <section className="border-y border-forest/10 bg-white py-12 sm:py-16"><Container><div className="mx-auto max-w-3xl text-center"><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand">Simple customer experience</p><h2 className="mt-3 text-[27px] leading-tight text-deep sm:text-[34px]">Buy this offer in a few simple steps</h2><p className="mt-3 text-[15px] leading-relaxed text-forest/70">No account creation and no complicated checkout. Fulfillment starts after payment is confirmed.</p></div><div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">{[{number:"01",icon:"phone",title:"Enter your details",text:"Provide the information needed to complete your purchase."},{number:"02",icon:"checkCircle",title:"Pay with M-Pesa",text:"Complete the payment securely from your phone."},{number:"03",icon:"download",title:"Get your offer",text:"Once payment is verified, receive secure access or fulfillment details."}].map(step=><div key={step.number} className="relative rounded-3xl border border-forest/10 bg-mint/40 p-6"><span className="absolute right-5 top-5 text-[11px] font-extrabold tracking-[0.14em] text-brand/50">{step.number}</span><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-sm"><Icon name={step.icon} className="h-6 w-6" /></span><h3 className="mt-5 text-[18px] text-deep">{step.title}</h3><p className="mt-2 text-[14px] leading-relaxed text-forest/70">{step.text}</p></div>)}</div></Container></section>
    <section className="py-14 sm:py-18"><Container><div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-brand">Keep exploring</p><h2 className="mt-2 text-[24px] text-deep sm:text-[30px]">More products to discover</h2></div><Link to="/explore" className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-extrabold text-brand hover:underline">Discover Products<Icon name="arrowRight" className="h-4 w-4" /></Link></div><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map(item=><Reveal key={item.code}><ProductCard product={item} className="h-full" /></Reveal>)}</div></Container></section>
    <section className="bg-mint/60 py-14 sm:py-18"><Container><div className="overflow-hidden rounded-[32px] brand-gradient p-7 text-white sm:p-10"><div className="flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center"><div><p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-gold">For sellers</p><h2 className="mt-3 max-w-2xl text-[28px] leading-tight sm:text-[36px]">Turn your offer into a digital business.</h2><p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">Publish your product or service on UZALINK, set your price and share your unique link. Keep 95% of every sale.</p></div><Link to="/sell" className={btnClass("gold", "xl", "w-full shrink-0 lg:w-auto")}>Sell Today<Icon name="arrowRight" className="h-5 w-5" /></Link></div></div></Container></section>
  </>;
}

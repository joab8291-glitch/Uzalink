import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { BUYER_FLOW, PRODUCTS, PRODUCT_TYPES, formatKsh, type ProductType } from "@/lib/data";
import { Link } from "@/lib/router";
import { Icon } from "@/components/Icon";
import {
  Badge,
  Container,
  Eyebrow,
  Reveal,
  SectionHeading,
  btnClass,
  inputClass,
} from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";

type Filter = "All" | ProductType;
type Sort = "popular" | "low" | "high" | "rating";

const SORTS: { key: Sort; label: string }[] = [
  { key: "popular", label: "Most popular" },
  { key: "low", label: "Price: low to high" },
  { key: "high", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
];

export function Explore() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("popular");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      const matchesFilter = filter === "All" || p.type === filter;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
    list = [...list].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return b.sales - a.sales;
    });
    return list;
  }, [filter, query, sort]);

  const chips: Filter[] = ["All", ...PRODUCT_TYPES.map((t) => t.type)];

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-mint/70 pb-14 pt-28 sm:pb-16 sm:pt-32">
        <div className="pointer-events-none absolute -right-20 top-4 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brandlight/20 blur-3xl" />
        <Container className="relative">
          <div className="max-w-3xl">
            <Eyebrow icon="compass">Explore Us · Buyer experience</Eyebrow>
            <h1 className="mt-5 text-[38px] leading-[1.02] text-deep sm:text-[54px]">
              Discover Products{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand">From Sellers.</span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-full bg-gold/40 sm:bottom-1.5" />
              </span>
            </h1>
            <p className="mt-6 text-[16.5px] leading-relaxed text-forest/80 sm:text-[18px]">
              Buyers don't need to create an account. Sellers share their UZALINK Magic Links
              through WhatsApp, Facebook, TikTok, Instagram, SMS, QR codes, websites and other
              channels. Simply open the link, view the product, pay and receive your product.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "No buyer account",
                "M-Pesa checkout",
                "Verified payments",
                "Digital receipt",
              ].map((t) => (
                <Badge key={t} tone="card" icon="checkCircle">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {/* buyer flow */}
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BUYER_FLOW.map((s, i) => (
              <Reveal key={s.title} delay={i * 55}>
                <div className="flex h-full items-start gap-3 rounded-3xl border border-forest/10 bg-white/90 p-4 backdrop-blur">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gold-gradient text-deep">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-forest/45">
                      Step {i + 1}
                    </p>
                    <p className="mt-1 text-[14.5px] font-extrabold leading-tight text-deep">
                      {s.title}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-snug text-forest/65">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={400}>
              <div className="flex h-full items-center rounded-3xl border-2 border-dashed border-brand/30 bg-white/70 p-4">
                <p className="text-[13px] font-bold leading-snug text-forest">
                  <span className="block text-brand">No sign up screen anywhere.</span>
                  Link → product → pay → receive.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============ DISCOVERY ============ */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-col gap-4 rounded-3xl border border-forest/10 bg-white p-4 shadow-[0_20px_45px_-35px_rgba(4,40,26,0.5)] sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Icon
                  name="search"
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest/40"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, sellers or categories…"
                  className={cn(inputClass, "pl-12")}
                  aria-label="Search products"
                />
              </div>
              <div className="relative sm:w-56">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className={cn(inputClass, "appearance-none pr-11")}
                  aria-label="Sort products"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevronDown"
                  className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest/45"
                />
              </div>
            </div>

            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    "shrink-0 rounded-full border-2 px-4 py-2.5 text-[13px] font-extrabold transition-all",
                    filter === c
                      ? "border-deep bg-deep text-white"
                      : "border-forest/12 bg-white text-forest/75 hover:border-brand/40 hover:text-brand",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <p className="px-1 text-[13px] font-semibold text-forest/60">
              Showing <span className="text-deep">{results.length}</span>{" "}
              {results.length === 1 ? "product" : "products"}
              {filter !== "All" && <> in {filter}</>}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="mt-12 rounded-3xl border-2 border-dashed border-forest/15 bg-mint/50 p-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-forest/50">
                <Icon name="search" className="h-7 w-7" />
              </span>
              <p className="mt-4 text-[19px] font-extrabold text-deep">No products found</p>
              <p className="mt-2 text-[14.5px] text-forest/70">
                Try another search term or pick a different product type.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setFilter("All");
                }}
                className={btnClass("deep", "md", "mt-6")}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p, i) => (
                <Reveal key={p.code} delay={Math.min(i, 6) * 60}>
                  <ProductCard product={p} className="h-full" />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ============ BUYER TRUST ============ */}
      <section className="bg-mint/60 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Buyer protection"
              title="Pay with confidence"
              text="Every purchase is verified before anything is released, and you always get proof of payment."
            />
          </Reveal>
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "phone",
                title: "M-Pesa checkout",
                text: "Pay from your phone with an STK push or paybill prompt. No card needed.",
              },
              {
                icon: "shield",
                title: "Verified before delivery",
                text: "UZALINK confirms the payment server-side before your product unlocks.",
              },
              {
                icon: "receipt",
                title: "Instant receipt",
                text: "Order reference and digital receipt, saved and shareable.",
              },
              {
                icon: "eye",
                title: "See before you buy",
                text: "Full product page with images, description, delivery info and seller details.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-forest/10 bg-white p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-brand">
                    <Icon name={c.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-[18px] text-deep">{c.title}</h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-forest/70">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <div className="mt-12 overflow-hidden rounded-[32px] brand-gradient p-7 text-white sm:p-10">
              <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                  <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-gold">
                    Sellers welcome
                  </p>
                  <h3 className="mt-3 text-[28px] leading-tight sm:text-[34px]">
                    Have something to sell? It takes 2 minutes.
                  </h3>
                  <p className="mt-3 max-w-xl text-[15px] text-white/75">
                    Create your product, set your price and payment number, get your Magic Link and
                    keep 95% of every sale. Products start from as little as {formatKsh(300)}.
                  </p>
                </div>
                <Link to="/sell" className={btnClass("gold", "xl", "w-full shrink-0 lg:w-auto")}>
                  Sell Today
                  <Icon name="arrowRight" className="h-5 w-5" strokeWidth={2.4} />
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

import { PRODUCTS, productByCode, formatKsh, type Product } from "@/lib/data";
import { findAnyProduct } from "@/lib/store";
import { Link } from "@/lib/router";
import { Icon } from "@/components/Icon";
import { Badge, Container, Reveal, btnClass } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { ShareChannels } from "@/components/ShareSheet";

const FALLBACK = PRODUCTS[0];

export function MagicProduct({ code }: { code: string }) {
  const product: Product = productByCode(code) ?? findAnyProduct(code) ?? FALLBACK;
  const related = PRODUCTS.filter((p) => p.code !== product.code).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-mint/60 pb-14 pt-28 sm:pt-32">
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
        <Container className="relative">
          <div className="flex flex-wrap items-center gap-3 text-[13px] font-semibold text-forest/60">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-brand">
              <Icon name="home" className="h-4 w-4" /> UZALINK
            </Link>
            <Icon name="chevronRight" className="h-4 w-4 text-forest/30" />
            <span className="text-forest/45">Magic Link</span>
            <Icon name="chevronRight" className="h-4 w-4 text-forest/30" />
            <span className="font-mono font-bold text-deep">/{product.code}</span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <div className="overflow-hidden rounded-[32px] border border-forest/10 bg-white shadow-[0_30px_70px_-45px_rgba(4,40,26,0.5)]">
                <div className="relative aspect-[4/3] bg-mint">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-forest shadow">
                    <Icon name="tag" className="h-3.5 w-3.5" />
                    {product.type}
                  </span>
                  {product.instant && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full gold-gradient px-3 py-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-deep shadow">
                      <Icon name="bolt" className="h-3.5 w-3.5" strokeWidth={0} />
                      Instant delivery
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 divide-x divide-forest/10 border-t border-forest/10">
                  {[
                    { icon: "shield", label: "Verified payment" },
                    { icon: "receipt", label: "Digital receipt" },
                    { icon: "users", label: `${product.sales.toLocaleString()} sold` },
                  ].map((b) => (
                    <div key={b.label} className="flex flex-col items-center gap-1.5 py-4 text-center">
                      <Icon name={b.icon} className="h-5 w-5 text-brand" />
                      <span className="px-1 text-[11px] font-bold leading-tight text-forest/70">
                        {b.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full gold-gradient text-[14px] font-extrabold text-deep">
                    {product.sellerAvatarSeed}
                  </span>
                  <div className="leading-tight">
                    <p className="text-[15px] font-extrabold text-deep">{product.seller}</p>
                    <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-forest/60">
                      <Icon name="checkCircle" className="h-3.5 w-3.5 text-brand" />
                      Verified UZALINK seller · {product.handle}
                    </p>
                  </div>
                </div>

                <h1 className="mt-5 text-[30px] leading-[1.08] text-deep sm:text-[40px]">
                  {product.name}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-[34px] font-extrabold leading-none text-deep">
                    {formatKsh(product.price)}
                  </span>
                  <span className="rounded-full bg-mint px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-forest">
                    {product.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-forest/70">
                    <Icon name="star" className="h-4 w-4 text-gold" strokeWidth={0} />
                    {product.rating.toFixed(1)} rating
                  </span>
                </div>

                <p className="mt-5 text-[16px] leading-relaxed text-forest/80">
                  {product.longDescription || product.description}
                </p>

                <div className="mt-6 space-y-2.5">
                  {[
                    { icon: "download", label: product.delivery },
                    { icon: "phone", label: "Pay with M-Pesa — no card, no account" },
                    { icon: "lock", label: "Payment verified before delivery" },
                  ].map((r) => (
                    <div
                      key={r.label}
                      className="flex items-center gap-3 rounded-2xl border border-forest/10 bg-white px-4 py-3.5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint text-brand">
                        <Icon name={r.icon} className="h-4.5 w-4.5" />
                      </span>
                      <span className="text-[13.5px] font-semibold leading-snug text-forest/80">
                        {r.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(4,40,26,0.6)]">
                  <Link
                    to={`/magic/${product.code}/checkout`}
                    className={btnClass("gold", "xl", "w-full")}
                  >
                    <Icon name="bolt" className="h-5.5 w-5.5" strokeWidth={0} />
                    Buy Now · {formatKsh(product.price)}
                  </Link>
                  <p className="mt-3 flex items-center justify-center gap-2 text-[12.5px] font-semibold text-forest/65">
                    <Icon name="checkCircle" className="h-4 w-4 text-brand" />
                    No buyer account required — pay and receive instantly
                  </p>

                  <div className="mt-5 border-t border-forest/10 pt-4">
                    <p className="mb-3 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-forest/50">
                      Share this product
                    </p>
                    <ShareChannels
                      compact
                      link={`uzalink.co.ke/magic/${product.code}`}
                      message={`${product.name} — ${formatKsh(product.price)} on UZALINK:`}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge tone="card" icon="lock">
                    Secure checkout
                  </Badge>
                  <Badge tone="card" icon="refresh">
                    95% goes to the seller
                  </Badge>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-18">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[24px] text-deep sm:text-[30px]">More from UZALINK sellers</h2>
            <Link
              to="/explore"
              className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-extrabold text-brand hover:underline"
            >
              Explore Us
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.code} delay={i * 70}>
                <ProductCard product={p} className="h-full" />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

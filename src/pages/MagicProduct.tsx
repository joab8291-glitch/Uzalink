import { useEffect, useState } from "react";
import { formatKsh, type Product } from "@/lib/data";
import { api } from "@/lib/api";
import { Link } from "@/lib/router";
import { Icon } from "@/components/Icon";
import { Badge, Container, Reveal, btnClass } from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";
import { ShareChannels } from "@/components/ShareSheet";

export function MagicProduct({ code }: { code: string }) {
  const [book, setBook] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadBook = async () => {
      try {
        const result = await api.product(code);
        const product = result?.product;
        if (!product || cancelled) return;

        const sellerName =
          product?.seller?.user?.name ||
          product?.seller?.handle ||
          "UzaLink Author";
        const initials = sellerName
          .split(/\\s+/)
          .filter(Boolean)
          .map((part: string) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        setBook({
          code: product.code,
          name: product.name,
          seller: sellerName,
          handle: product?.seller?.handle || "",
          sellerAvatarSeed: initials || "AU",
          type: "Digital Product",
          category: product.category,
          description: product.description,
          longDescription: product.description,
          price: Number(product.priceCents || 0) / 100,
          image: (import.meta.env.VITE_UZALINK_API || "https://uzalink-backend.onrender.com") + "/api/products/" + encodeURIComponent(product.code) + "/cover",
          delivery: product.deliveryText || "Digital book",
          rating: Number(product.rating || 0),
          sales: Number(product.salesCount || 0),
          instant: Boolean(product.instant),
        });
      } catch {
        // Do not display demo content when the real book cannot be loaded.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadBook();
    return () => { cancelled = true; };
  }, [code]);

  if (!book) {
    return (
      <section className="min-h-screen bg-mint/40 pt-32">
        <Container className="max-w-2xl text-center">
          <h1 className="text-3xl text-deep">{loading ? "Loading book…" : "Book not found"}</h1>
          <p className="mt-3 text-forest/65">
            {loading ? "Fetching the published book from UzaLink." : "This book link is no longer available."}
          </p>
          <Link to="/explore" className={btnClass("gold", "lg", "mt-6")}>Discover Books</Link>
        </Container>
      </section>
    );
  }

  const [related, setRelated] = useState<Product[]>([]);

  return (
    <>
      {/* =========================================================
          BOOK DETAIL HERO
      ========================================================== */}
      <section className="relative overflow-hidden bg-mint/60 pb-14 pt-28 sm:pt-32">
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brandlight/15 blur-3xl" />

        <Container className="relative">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-3 text-[13px] font-semibold text-forest/60">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 hover:text-brand"
            >
              <Icon name="home" className="h-4 w-4" />
              UZALINK
            </Link>

            <Icon
              name="chevronRight"
              className="h-4 w-4 text-forest/30"
            />

            <Link
              to="/explore"
              className="hover:text-brand"
            >
              Discover Books
            </Link>

            <Icon
              name="chevronRight"
              className="h-4 w-4 text-forest/30"
            />

            <span className="font-mono font-bold text-deep">
              /{book.code}
            </span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* =====================================================
                BOOK COVER
            ====================================================== */}
            <Reveal>
              <div className="overflow-hidden rounded-[32px] border border-forest/10 bg-white shadow-[0_30px_70px_-45px_rgba(4,40,26,0.5)]">
                <div className="relative aspect-[4/3] bg-mint">
                  <img
                    src={book.image}
                    alt={`${book.name} book cover`}
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-forest shadow">
                    <Icon
                      name="book"
                      className="h-3.5 w-3.5"
                    />
                    Digital Book
                  </span>

                  {book.instant && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full gold-gradient px-3 py-1.5 text-[11.5px] font-extrabold uppercase tracking-wide text-deep shadow">
                      <Icon
                        name="bolt"
                        className="h-3.5 w-3.5"
                        strokeWidth={0}
                      />
                      Instant access
                    </span>
                  )}
                </div>

                {/* Book trust indicators */}
                <div className="grid grid-cols-3 divide-x divide-forest/10 border-t border-forest/10">
                  {[
                    {
                      icon: "shield",
                      label: "Verified payment",
                    },
                    {
                      icon: "receipt",
                      label: "Digital receipt",
                    },
                    {
                      icon: "download",
                      label: "Secure delivery",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col items-center gap-1.5 py-4 text-center"
                    >
                      <Icon
                        name={item.icon}
                        className="h-5 w-5 text-brand"
                      />

                      <span className="px-1 text-[11px] font-bold leading-tight text-forest/70">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* =====================================================
                BOOK INFORMATION
            ====================================================== */}
            <Reveal delay={90}>
              <div className="flex h-full flex-col">
                {/* Author */}
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full gold-gradient text-[14px] font-extrabold text-deep">
                    {book.sellerAvatarSeed}
                  </span>

                  <div className="leading-tight">
                    <p className="text-[15px] font-extrabold text-deep">
                      {book.seller}
                    </p>

                    <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-forest/60">
                      <Icon
                        name="checkCircle"
                        className="h-3.5 w-3.5 text-brand"
                      />
                      Author on UZALINK · {book.handle}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h1 className="mt-5 text-[30px] leading-[1.08] text-deep sm:text-[40px]">
                  {book.name}
                </h1>

                {/* Price / category / rating */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-[34px] font-extrabold leading-none text-deep">
                    {formatKsh(book.price)}
                  </span>

                  <span className="rounded-full bg-mint px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-forest">
                    {book.category}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-forest/70">
                    <Icon
                      name="star"
                      className="h-4 w-4 text-gold"
                      strokeWidth={0}
                    />
                    {book.rating.toFixed(1)} rating
                  </span>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <p className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-forest/45">
                    About this book
                  </p>

                  <p className="mt-2 text-[16px] leading-relaxed text-forest/80">
                    {book.longDescription || book.description}
                  </p>
                </div>

                {/* Purchase benefits */}
                <div className="mt-6 space-y-2.5">
                  {[
                    {
                      icon: "download",
                      label:
                        book.delivery ||
                        "Digital book delivered securely after payment",
                    },
                    {
                      icon: "phone",
                      label:
                        "Pay with M-Pesa — no card or reader account required",
                    },
                    {
                      icon: "lock",
                      label:
                        "Payment is verified before your book is released",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl border border-forest/10 bg-white px-4 py-3.5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint text-brand">
                        <Icon
                          name={item.icon}
                          className="h-4.5 w-4.5"
                        />
                      </span>

                      <span className="text-[13.5px] font-semibold leading-snug text-forest/80">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Checkout */}
                <div className="mt-7 rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(4,40,26,0.6)]">
                  <Link
                    to={`/magic/${book.code}/checkout`}
                    className={btnClass("gold", "xl", "w-full")}
                  >
                    <Icon
                      name="bolt"
                      className="h-5.5 w-5.5"
                      strokeWidth={0}
                    />

                    Buy Book · {formatKsh(book.price)}
                  </Link>

                  <p className="mt-3 flex items-center justify-center gap-2 text-center text-[12.5px] font-semibold text-forest/65">
                    <Icon
                      name="checkCircle"
                      className="h-4 w-4 shrink-0 text-brand"
                    />
                    No reader account required — pay and get secure access
                  </p>

                  {/* Share */}
                  <div className="mt-5 border-t border-forest/10 pt-4">
                    <p className="mb-3 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-forest/50">
                      Share this book
                    </p>

                    <ShareChannels
                      compact
                      link={`uzalink.co.ke/magic/${book.code}`}
                      message={`${book.name} — ${formatKsh(
                        book.price,
                      )} on UZALINK:`}
                    />
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge tone="card" icon="lock">
                    Secure checkout
                  </Badge>

                  <Badge tone="card" icon="download">
                    Digital delivery
                  </Badge>

                  <Badge tone="card" icon="refresh">
                    95% goes to the author
                  </Badge>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* =========================================================
          HOW PURCHASE WORKS
      ========================================================== */}
      <section className="border-y border-forest/10 bg-white py-12 sm:py-16">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand">
                Simple reader experience
              </p>

              <h2 className="mt-3 text-[27px] leading-tight text-deep sm:text-[34px]">
                Buy this book in a few simple steps
              </h2>

              <p className="mt-3 text-[15px] leading-relaxed text-forest/70">
                No account creation and no complicated checkout. Your
                book is made available after your payment is confirmed.
              </p>
            </div>
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              {
                number: "01",
                icon: "phone",
                title: "Enter your details",
                text: "Provide the information needed to complete your purchase.",
              },
              {
                number: "02",
                icon: "checkCircle",
                title: "Pay with M-Pesa",
                text: "Complete the payment securely from your phone.",
              },
              {
                number: "03",
                icon: "download",
                title: "Access your book",
                text: "Once payment is verified, receive secure digital access.",
              },
            ].map((step, index) => (
              <Reveal key={step.number} delay={index * 80}>
                <div className="relative h-full rounded-3xl border border-forest/10 bg-mint/40 p-6">
                  <span className="absolute right-5 top-5 text-[11px] font-extrabold tracking-[0.14em] text-brand/50">
                    {step.number}
                  </span>

                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-sm">
                    <Icon
                      name={step.icon}
                      className="h-6 w-6"
                    />
                  </span>

                  <h3 className="mt-5 text-[18px] text-deep">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-[14px] leading-relaxed text-forest/70">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* =========================================================
          RELATED BOOKS
      ========================================================== */}
      <section className="py-14 sm:py-18">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-brand">
                Keep exploring
              </p>

              <h2 className="mt-2 text-[24px] text-deep sm:text-[30px]">
                More books to discover
              </h2>
            </div>

            <Link
              to="/explore"
              className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-extrabold text-brand hover:underline"
            >
              Discover Books
              <Icon
                name="arrowRight"
                className="h-4 w-4"
              />
            </Link>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <Reveal
                key={item.code}
                delay={index * 70}
              >
                <ProductCard
                  product={item}
                  className="h-full"
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* =========================================================
          AUTHOR CTA
      ========================================================== */}
      <section className="bg-mint/60 py-14 sm:py-18">
        <Container>
          <Reveal>
            <div className="overflow-hidden rounded-[32px] brand-gradient p-7 text-white sm:p-10">
              <div className="flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
                <div>
                  <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-gold">
                    Are you an author?
                  </p>

                  <h2 className="mt-3 max-w-2xl text-[28px] leading-tight sm:text-[36px]">
                    Turn your book into a digital business.
                  </h2>

                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
                    Publish your digital book on UZALINK, set your own
                    price and share your unique book link with readers.
                    Keep 95% of every sale.
                  </p>
                </div>

                <Link
                  to="/sell"
                  className={btnClass(
                    "gold",
                    "xl",
                    "w-full shrink-0 lg:w-auto",
                  )}
                >
                  Sell Your Book
                  <Icon
                    name="arrowRight"
                    className="h-5 w-5"
                    strokeWidth={2.4}
                  />
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

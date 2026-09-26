import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import {
  BUYER_FLOW,
  type Product,
} from "@/lib/data";
import { api } from "@/lib/api";
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

type Sort = "popular" | "low" | "high" | "rating";

const SORTS: { key: Sort; label: string }[] = [
  { key: "popular", label: "Most popular" },
  { key: "low", label: "Price: low to high" },
  { key: "high", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
];

export function Explore() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("popular");
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadBooks = async () => {
      try {
        const result = await api.products();
        const products = Array.isArray(result?.products)
          ? result.products
          : [];

        const mapped: Product[] = products.map((product: any) => {
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

          return {
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
            image: `${import.meta.env.VITE_UZALINK_API || "https://uzalink-backend.onrender.com"}/api/products/${encodeURIComponent(product.code)}/cover`,
            delivery: product.deliveryText || "Digital book",
            rating: Number(product.rating || 0),
            sales: Number(product.salesCount || 0),
            instant: Boolean(product.instant),
          };
        });

        if (!cancelled) setLiveProducts(mapped);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Could not load books.");
        }
      } finally {
        if (!cancelled) setLoadingBooks(false);
      }
    };

    void loadBooks();
    return () => { cancelled = true; };
  }, []);

  const allBooks = liveProducts;

  const categories = useMemo(() => {
    const values = allBooks.map((p) => p.category).filter(Boolean);

    return [
      "All",
      ...Array.from(new Set(values)).sort((a, b) => a.localeCompare(b)),
    ];
  }, [allBooks]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = allBooks.filter((book) => {
      const matchesCategory =
        category === "All" || book.category === category;

      const matchesQuery =
        !q ||
        book.name.toLowerCase().includes(q) ||
        book.description.toLowerCase().includes(q) ||
        book.seller.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });

    list = [...list].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;

      return b.sales - a.sales;
    });

    return list;
  }, [allBooks, category, query, sort]);

  return (
    <>
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden bg-mint/70 pb-14 pt-28 sm:pb-16 sm:pt-32">
        <div className="pointer-events-none absolute -right-20 top-4 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brandlight/20 blur-3xl" />

        <Container className="relative">
          <div className="max-w-3xl">
            <Eyebrow icon="compass">
              Explore Books · Reader experience
            </Eyebrow>

            <h1 className="mt-5 text-[38px] leading-[1.02] text-deep sm:text-[54px]">
              Discover Your Next{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-brand">
                  Great Book.
                </span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-full bg-gold/40 sm:bottom-1.5" />
              </span>
            </h1>

            <p className="mt-6 text-[16.5px] leading-relaxed text-forest/80 sm:text-[18px]">
              Explore digital books from independent authors and discover
              stories, knowledge and ideas you can buy directly online.
              No reader account is required — choose a book, pay with
              M-Pesa and get secure access.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "No reader account",
                "M-Pesa checkout",
                "Secure access",
                "Instant digital delivery",
              ].map((text) => (
                <Badge key={text} tone="card" icon="checkCircle">
                  {text}
                </Badge>
              ))}
            </div>
          </div>

          {/* Reader flow */}
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BUYER_FLOW.map((step, index) => (
              <Reveal key={step.title} delay={index * 55}>
                <div className="flex h-full items-start gap-3 rounded-3xl border border-forest/10 bg-white/90 p-4 backdrop-blur">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gold-gradient text-deep">
                    <Icon name={step.icon} className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-forest/45">
                      Step {index + 1}
                    </p>

                    <p className="mt-1 text-[14.5px] font-extrabold leading-tight text-deep">
                      {step.title}
                    </p>

                    <p className="mt-1 text-[12.5px] leading-snug text-forest/65">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={220}>
              <div className="flex h-full items-center rounded-3xl border-2 border-dashed border-brand/30 bg-white/70 p-4">
                <p className="text-[13px] font-bold leading-snug text-forest">
                  <span className="block text-brand">
                    No reader account required.
                  </span>
                  Choose → pay → read.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* =========================================================
          BOOK DISCOVERY
      ========================================================== */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-col gap-4 rounded-3xl border border-forest/10 bg-white p-4 shadow-[0_20px_45px_-35px_rgba(4,40,26,0.5)] sm:p-5">
            {/* Search + sort */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Icon
                  name="search"
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest/40"
                />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search books, authors or categories…"
                  className={cn(inputClass, "pl-12")}
                  aria-label="Search books"
                />
              </div>

              <div className="relative sm:w-56">
                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value as Sort)
                  }
                  className={cn(inputClass, "appearance-none pr-11")}
                  aria-label="Sort books"
                >
                  {SORTS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <Icon
                  name="chevronDown"
                  className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest/45"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "shrink-0 rounded-full border-2 px-4 py-2.5 text-[13px] font-extrabold transition-all",
                    category === item
                      ? "border-deep bg-deep text-white"
                      : "border-forest/12 bg-white text-forest/75 hover:border-brand/40 hover:text-brand",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Results count */}
            {loadingBooks && (
              <p className="px-1 text-[13px] font-semibold text-brand">Loading published books…</p>
            )}
            {loadError && (
              <p className="px-1 text-[13px] font-semibold text-red-600">{loadError}</p>
            )}
            <p className="px-1 text-[13px] font-semibold text-forest/60">
              Showing{" "}
              <span className="text-deep">{results.length}</span>{" "}
              {results.length === 1 ? "book" : "books"}
              {category !== "All" && <> in {category}</>}
            </p>
          </div>

          {/* Results */}
          {results.length === 0 ? (
            <div className="mt-12 rounded-3xl border-2 border-dashed border-forest/15 bg-mint/50 p-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-forest/50">
                <Icon name="search" className="h-7 w-7" />
              </span>

              <p className="mt-4 text-[19px] font-extrabold text-deep">
                No books found
              </p>

              <p className="mt-2 text-[14.5px] text-forest/70">
                Try another title, author or category.
              </p>

              <button
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
                className={btnClass("deep", "md", "mt-6")}
              >
                Reset search
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((book, index) => (
                <Reveal
                  key={book.code}
                  delay={Math.min(index, 6) * 60}
                >
                  <div className="relative h-full">
                    <ProductCard
                      product={book}
                      className="h-full"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* =========================================================
          READER TRUST
      ========================================================== */}
      <section className="bg-mint/60 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="For readers"
              title="A simple way to buy digital books"
              text="Choose a book, complete your M-Pesa payment and receive secure access without creating a reader account."
            />
          </Reveal>

          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "phone",
                title: "M-Pesa checkout",
                text: "Pay from your phone using a simple M-Pesa checkout. No card required.",
              },
              {
                icon: "shield",
                title: "Payment verified",
                text: "Your payment is verified before access to the purchased book is released.",
              },
              {
                icon: "receipt",
                title: "Digital receipt",
                text: "Keep your order reference and payment confirmation as proof of purchase.",
              },
              {
                icon: "eye",
                title: "Book details first",
                text: "View the book title, description, category, price and author information before buying.",
              },
            ].map((card, index) => (
              <Reveal key={card.title} delay={index * 80}>
                <div className="h-full rounded-3xl border border-forest/10 bg-white p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-brand">
                    <Icon name={card.icon} className="h-6 w-6" />
                  </span>

                  <h3 className="mt-5 text-[18px] text-deep">
                    {card.title}
                  </h3>

                  <p className="mt-2.5 text-[14px] leading-relaxed text-forest/70">
                    {card.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Author CTA */}
          <Reveal delay={100}>
            <div className="mt-12 overflow-hidden rounded-[32px] brand-gradient p-7 text-white sm:p-10">
              <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                  <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-gold">
                    For authors
                  </p>

                  <h3 className="mt-3 text-[28px] leading-tight sm:text-[34px]">
                    Have a book to sell?
                  </h3>

                  <p className="mt-3 max-w-xl text-[15px] text-white/75">
                    Create your author account, publish your digital book,
                    set your price and share your unique link with readers.
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

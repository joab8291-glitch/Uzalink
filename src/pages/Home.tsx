import { useState } from "react";
import { cn } from "@/utils/cn";
import { BUYER_FLOW, PRODUCTS, PRODUCT_TYPES, formatKsh, sellerOf } from "@/lib/data";
import { Link } from "@/lib/router";
import { Icon } from "@/components/Icon";
import {
  Badge,
  Container,
  Eyebrow,
  Reveal,
  SectionHeading,
  btnClass,
} from "@/components/ui";
import { HeroVisual, PhoneFrame, HeroScreen } from "@/components/PhoneMock";
import { ProductCard } from "@/components/ProductCard";
import { CommissionCalculator } from "@/components/Commission";
import { QrCode } from "@/components/ShareSheet";

const BENEFITS = [
  { label: "No Sign Up Required", icon: "checkCircle" },
  { label: "M-Pesa Payments", icon: "phone" },
  { label: "Secure Digital Delivery", icon: "shield" },
  { label: "5% Commission", icon: "tag" },
  { label: "95% to Seller", icon: "wallet" },
];

const CHANNEL_MARQUEE = [
  "WhatsApp",
  "Facebook",
  "TikTok",
  "Instagram",
  "SMS",
  "QR Codes",
  "Websites",
  "Telegram",
  "X / Twitter",
  "Email",
];

const STEPS = [
  {
    n: "01",
    title: "Create your product",
    text: "Pick a product type, add details and an image. Takes about two minutes on a phone.",
    icon: "grid",
  },
  {
    n: "02",
    title: "Set price & payment number",
    text: "Enter your KSh price and the M-Pesa number that receives your settlements. Locked for your safety.",
    icon: "lock",
  },
  {
    n: "03",
    title: "Share your Magic Link",
    text: "One link for one product. Post it anywhere, buyers pay and you keep 95%.",
    icon: "link",
  },
];

const TESTIMONIALS = [
  {
    name: "Mama Njeri",
    role: "Food vendor · Ruiru",
    quote:
      "I posted my Sunday chapati link on WhatsApp status and sold out before 10am. I never opened a shop website.",
    seed: "MN",
  },
  {
    name: "Brian Otieno",
    role: "Consultant · Kisumu",
    quote:
      "No sign up was the selling point for me. I made the link in a boda ride and my first client paid the same hour.",
    seed: "BO",
  },
  {
    name: "Naserian",
    role: "Beadwork artisan · Kajiado",
    quote:
      "Customers scan my QR at the market, pay by M-Pesa and I get 95%. The receipt makes people trust me.",
    seed: "NC",
  },
];

const FAQS = [
  {
    q: "Do I need an account to start selling?",
    a: "No. Tap Sell Today, create your product, set your price and payment number, and UZALINK gives you a Magic Link instantly. No sign up, no email, no password.",
  },
  {
    q: "Do buyers need an account to purchase?",
    a: "Never. Buyers open the seller's Magic Link, view the product, tap Buy Now, pay by M-Pesa and receive the product or booking confirmation.",
  },
  {
    q: "Why does my payment number lock after setup?",
    a: "Your settlement number is where your money goes, so UZALINK locks it to protect your earnings from fraud. It is verified at setup and shown as Locked in your dashboard.",
  },
  {
    q: "How much does UZALINK take?",
    a: "5% commission. On a KSh 1,000 sale, UZALINK keeps KSh 50 and KSh 950 goes to your seller balance.",
  },
  {
    q: "What is the Premium dashboard for?",
    a: "Optional seller management for growing businesses at KSh 1,000/month. Access it with a passwordless Seller Magic Login — your public selling flow stays account-free.",
  },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-3">
      {FAQS.map((f, i) => {
        const active = open === i;
        return (
          <div
            key={f.q}
            className={cn(
              "overflow-hidden rounded-3xl border transition-all duration-300",
              active ? "border-brand/25 bg-mint/60" : "border-forest/10 bg-white",
            )}
          >
            <button
              onClick={() => setOpen(active ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
            >
              <span className="text-[15.5px] font-extrabold text-deep">{f.q}</span>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                  active ? "rotate-180 bg-deep text-white" : "bg-mint text-forest",
                )}
              >
                <Icon name="chevronDown" className="h-4 w-4" strokeWidth={2.4} />
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: active ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[14.5px] leading-relaxed text-forest/75 sm:px-6">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden brand-gradient pb-16 pt-28 text-white sm:pb-20 sm:pt-32 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-70" />
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-brandlight/25 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-gold/20 blur-[110px]" />

        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            <div className="animate-fade-up">
              <Eyebrow tone="light" icon="bolt">
                Kenya-first · Mobile-first · M-Pesa-first
              </Eyebrow>

              <h1 className="mt-6 text-[42px] leading-[0.98] sm:text-[60px] lg:text-[68px]">
                One Link.
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-gold">Everything</span>
                  <span className="absolute inset-x-0 bottom-1.5 z-0 h-3 rounded-full bg-gold/25 sm:bottom-2 sm:h-4" />
                </span>{" "}
                You Sell.
              </h1>

              <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-white/75 sm:text-[18.5px]">
                Create your product, set your price, add your payment number, get your unique Magic
                Link and start selling.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/sell" className={btnClass("gold", "xl", "w-full sm:w-auto animate-ring")}>
                  Sell Today
                  <Icon name="arrowRight" className="h-5 w-5" strokeWidth={2.4} />
                </Link>
                <Link
                  to="/explore"
                  className={btnClass(
                    "white",
                    "xl",
                    "w-full border-2 border-white/25 sm:w-auto",
                  )}
                >
                  Explore Us
                  <Icon name="compass" className="h-5 w-5" />
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap gap-2">
                {BENEFITS.map((b) => (
                  <span
                    key={b.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-2 text-[12.5px] font-bold text-white/90 backdrop-blur transition-colors hover:bg-white/15"
                  >
                    <Icon name={b.icon} className="h-4 w-4 text-gold" />
                    {b.label}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="flex -space-x-2.5">
                  {["MN", "BO", "NC", "AD"].map((s) => (
                    <span
                      key={s}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-deep gold-gradient text-[11px] font-extrabold text-deep"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-[13.5px] leading-tight text-white/70">
                  <span className="font-extrabold text-white">2,400+</span> Kenyan sellers already
                  sharing Magic Links.
                </p>
              </div>
            </div>

            <HeroVisual />
          </div>
        </Container>
      </section>

      {/* ============ CHANNEL MARQUEE ============ */}
      <section className="border-b border-forest/10 bg-mint/60 py-6">
        <div className="relative flex overflow-hidden">
          <div className="flex min-w-full shrink-0 animate-marquee items-center gap-10 pr-10">
            {[...CHANNEL_MARQUEE, ...CHANNEL_MARQUEE].map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="flex shrink-0 items-center gap-2.5 text-[13.5px] font-extrabold uppercase tracking-[0.12em] text-forest/55"
              >
                <Icon name="link" className="h-4 w-4 text-brand" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TWO JOURNEYS ============ */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Two clear journeys"
              title={<>Want to sell, or looking for products?</>}
              text="UZALINK keeps sellers and buyers on separate paths so nobody gets lost. No sign up screens in the way."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Reveal delay={80}>
              <div className="group relative h-full overflow-hidden rounded-[32px] brand-gradient p-7 text-white shadow-[0_30px_70px_-40px_rgba(4,40,26,0.9)] sm:p-9">
                <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
                <Badge tone="gold" icon="bolt">
                  For sellers
                </Badge>
                <h3 className="mt-5 text-[30px] leading-tight sm:text-[36px]">
                  Want to sell?
                  <br />
                  <span className="text-gold">Sell Today.</span>
                </h3>
                <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-white/75">
                  Create your product, set your price, add your M-Pesa payment number and generate
                  your Magic Link — all without creating an account.
                </p>

                <ul className="mt-6 space-y-2.5">
                  {[
                    "No account, no email, no password",
                    "5% commission · 95% to you",
                    "Payment number verified & locked",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-[14.5px] text-white/85">
                      <Icon name="checkCircle" className="h-5 w-5 shrink-0 text-gold" />
                      {t}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/sell"
                  className={btnClass("gold", "lg", "mt-8 w-full sm:w-auto")}
                >
                  SELL TODAY
                  <Icon name="arrowRight" className="h-5 w-5" strokeWidth={2.4} />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="group relative h-full overflow-hidden rounded-[32px] border border-forest/10 bg-mint/70 p-7 shadow-[0_30px_70px_-45px_rgba(4,40,26,0.5)] sm:p-9">
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-gold/25 blur-3xl" />
                <Badge tone="deep" icon="compass">
                  For buyers
                </Badge>
                <h3 className="mt-5 text-[30px] leading-tight text-deep sm:text-[36px]">
                  Looking for products?
                  <br />
                  <span className="text-brand">Explore Us.</span>
                </h3>
                <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-forest/75">
                  Discover real products from Kenyan sellers. Open a link, view the product, pay and
                  receive — no buyer account, ever.
                </p>

                <ul className="mt-6 space-y-2.5">
                  {[
                    "Browse without registering",
                    "Pay with M-Pesa in seconds",
                    "Digital receipt for every order",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-[14.5px] text-forest/85">
                      <Icon name="checkCircle" className="h-5 w-5 shrink-0 text-brand" />
                      {t}
                    </li>
                  ))}
                </ul>

                <Link to="/explore" className={btnClass("deep", "lg", "mt-8 w-full sm:w-auto")}>
                  EXPLORE US
                  <Icon name="compass" className="h-5 w-5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============ 3 STEPS ============ */}
      <section className="relative overflow-hidden bg-deep py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60" />
        <Container className="relative">
          <Reveal>
            <SectionHeading
              tone="light"
              eyebrow="Sell in 3 moves"
              title="From product idea to your first M-Pesa sale"
              text="The whole seller flow happens on one screen-friendly wizard. Nothing to configure, nothing to install."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="relative h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:border-gold/40">
                  <span className="absolute right-5 top-5 text-[42px] font-extrabold leading-none text-white/8">
                    {s.n}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl gold-gradient text-deep">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-[19px] text-white">{s.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-white/65">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:p-6">
              <p className="text-center text-[14.5px] text-white/70 sm:text-left">
                Want the full step-by-step, including the buyer side?
              </p>
              <Link to="/how-it-works" className={btnClass("white", "md", "shrink-0")}>
                See How It Works
                <Icon name="arrowRight" className="h-4.5 w-4.5" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ============ PRODUCT TYPES ============ */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Sell anything"
              title="Eight product types. One Magic Link each."
              text="Whatever you sell in Kenya, there is a UZALINK product type for it."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
            {PRODUCT_TYPES.map((t, i) => (
              <Reveal key={t.type} delay={i * 50}>
                <Link
                  to="/sell"
                  className="group flex h-full flex-col rounded-3xl border border-forest/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_25px_50px_-30px_rgba(4,40,26,0.45)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-[22px] transition-colors group-hover:bg-goldsoft">
                    {t.emoji}
                  </span>
                  <p className="mt-4 text-[15.5px] font-extrabold leading-tight text-deep">
                    {t.type}
                  </p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-forest/65">{t.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-extrabold text-brand">
                    Sell this
                    <Icon name="arrowRight" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="bg-mint/60 py-16 sm:py-20 lg:py-24">
        <Container>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
              <SectionHeading
                align="left"
                eyebrow="Explore Us"
                title="Discover products from sellers."
                text="Buyers never need an account. Open a link, view the product, pay and receive."
              />
              <Link to="/explore" className={btnClass("deep", "lg", "shrink-0")}>
                Explore all products
                <Icon name="arrowRight" className="h-5 w-5" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.slice(0, 6).map((p, i) => (
              <Reveal key={p.code} delay={i * 70}>
                <ProductCard product={p} className="h-full" />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ MAGIC LINK EXPLAINER ============ */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <Eyebrow icon="link">The Magic Link</Eyebrow>
              <h2 className="mt-5 text-[32px] leading-[1.06] text-deep sm:text-[42px]">
                Your link is your shopfront.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-forest/75">
                Every product gets its own public UZALINK page. Share it on WhatsApp status, pin it
                in your TikTok bio, print it as a QR code for your stall — the link does the
                selling, the payment and the delivery.
              </p>

              <div className="mt-7 rounded-3xl border border-forest/10 bg-mint/60 p-5">
                <p className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-forest/55">
                  Example Magic Link
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[14px] font-bold sm:text-[15px]">
                  <span className="text-forest/45">uzalink.co.ke</span>
                  <span className="text-brand">/magic/</span>
                  <span className="rounded-lg bg-deep px-2 py-1 text-white">abc123</span>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <QrCode value="uzalink.co.ke/magic/abc123" size={110} />
                  <ul className="space-y-2.5">
                    {[
                      "No buyer account required",
                      "Works on any phone browser",
                      "Payment + delivery in one page",
                    ].map((t) => (
                      <li key={t} className="flex items-center gap-2 text-[13.5px] font-semibold text-forest/80">
                        <Icon name="checkCircle" className="h-4.5 w-4.5 shrink-0 text-brand" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link to="/sell" className={btnClass("gold", "lg", "mt-8 w-full sm:w-auto")}>
                Generate my Magic Link
                <Icon name="arrowRight" className="h-5 w-5" />
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <div className="flex justify-center">
                <PhoneFrame className="animate-float-slow">
                  <HeroScreen />
                </PhoneFrame>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============ BUYER FLOW STRIP ============ */}
      <section className="relative overflow-hidden bg-mint/70 py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Buyer journey"
              title="Seven taps from link to product in hand"
              text="Buyers don't need to create an account. Sellers share their UZALINK Magic Links through WhatsApp, Facebook, TikTok, Instagram, SMS, QR codes, websites and other channels."
            />
          </Reveal>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BUYER_FLOW.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <div className="relative h-full rounded-3xl border border-forest/10 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep text-gold">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </span>
                    <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-forest/45">
                      Step {i + 1}
                    </span>
                  </div>
                  <p className="mt-4 text-[15.5px] font-extrabold leading-tight text-deep">
                    {s.title}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-forest/65">{s.text}</p>
                  {i < BUYER_FLOW.length - 1 && (
                    <Icon
                      name="arrowRight"
                      className="absolute -right-2.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-brand/40 lg:block"
                    />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ COMMISSION ============ */}
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <Reveal>
              <Eyebrow icon="wallet">Transparent pricing</Eyebrow>
              <h2 className="mt-5 text-[32px] leading-[1.06] text-deep sm:text-[42px]">
                5% UZALINK Commission.
                <br />
                <span className="text-brand">95% Goes to the Seller.</span>
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-forest/75">
                No listing fees, no monthly minimums, no hidden charges on the free seller flow. You
                always see the split before you share your link.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  { label: "Product price", value: 1000 },
                  { label: "UZALINK commission", value: 50 },
                  { label: "Seller balance", value: sellerOf(1000) },
                ].map((r, i) => (
                  <div
                    key={r.label}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-5 py-4",
                      i === 2 ? "brand-gradient text-white" : "border border-forest/10 bg-white",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[14px] font-bold",
                        i === 2 ? "text-white/85" : "text-forest/70",
                      )}
                    >
                      {i === 1 ? "− " : ""}
                      {r.label}
                    </span>
                    <span
                      className={cn(
                        "text-[19px] font-extrabold",
                        i === 2 ? "text-gold" : "text-deep",
                      )}
                    >
                      {formatKsh(r.value)}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-[13.5px] leading-relaxed text-forest/70">
                95% seller balance is sent within 6 business working hours of the same day, subject
                to successful payment verification and applicable payment processing.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <CommissionCalculator />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============ TRUST / LOCK ============ */}
      <section className="relative overflow-hidden bg-deep py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60" />
        <Container className="relative">
          <Reveal>
            <SectionHeading
              tone="light"
              eyebrow="Built on trust"
              title="Your money details are protected"
              text="UZALINK verifies payments server-side and locks settlement numbers so earnings always land with the right seller."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: "shield",
                title: "Server-side verification",
                text: "Every M-Pesa payment is confirmed against the transaction before a product unlocks or a seller is credited.",
              },
              {
                icon: "lock",
                title: "Locked payment number",
                text: "Set it once, verify ownership, and it locks. This stops fraudsters from redirecting seller settlements.",
              },
              {
                icon: "receipt",
                title: "Digital receipts",
                text: "Buyers get an order reference and receipt instantly. Sellers get a matching record in their dashboard.",
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-deep">
                    <Icon name={c.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-[19px] text-white">{c.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-white/65">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Kenyan sellers"
              title="Hustles growing with one link"
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <div className="flex h-full flex-col rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_20px_45px_-35px_rgba(4,40,26,0.45)]">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Icon key={s} name="star" className="h-4 w-4 text-gold" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-forest/85">
                    “{t.quote}”
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-forest/10 pt-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mint text-[13px] font-extrabold text-forest">
                      {t.seed}
                    </span>
                    <div className="leading-tight">
                      <p className="text-[14px] font-extrabold text-deep">{t.name}</p>
                      <p className="text-[12.5px] text-forest/60">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ PREMIUM TEASER ============ */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] border border-forest/10 bg-mint/70 p-7 sm:p-10">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/30 blur-3xl" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <Eyebrow icon="trend">Optional · For growing sellers</Eyebrow>
                  <h2 className="mt-5 text-[30px] leading-[1.08] text-deep sm:text-[38px]">
                    Premium seller dashboard
                    <br />
                    <span className="text-brand">{formatKsh(1000)}/month</span>
                  </h2>
                  <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-forest/75">
                    Selling stays account-free. When you are ready to manage everything in one
                    place, unlock the Premium dashboard with a passwordless Seller Magic Login.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {[
                      "Earnings",
                      "Sales",
                      "Products",
                      "Magic Links",
                      "Customers",
                      "Orders",
                      "Downloads",
                      "Analytics",
                      "Settlements",
                    ].map((s) => (
                      <span
                        key={s}
                        className="rounded-2xl border border-forest/10 bg-white px-3.5 py-2.5 text-[13px] font-bold text-forest"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link to="/seller-login" className={btnClass("deep", "lg")}>
                      Seller Magic Login
                      <Icon name="key" className="h-5 w-5" />
                    </Link>
                    <Link to="/sell" className={btnClass("outline", "lg")}>
                      Keep selling free
                      <Icon name="arrowRight" className="h-5 w-5" />
                    </Link>
                  </div>
                </div>

                <div className="rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_25px_60px_-40px_rgba(4,40,26,0.5)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-forest/50">
                        Verified Payment Number
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-[22px] font-extrabold text-deep">
                        07XX XXX XXX
                        <Icon name="lock" className="h-5 w-5 text-brand" />
                      </p>
                    </div>
                    <span className="rounded-full bg-mint px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-forest">
                      Locked
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-mint/70 p-4">
                      <p className="text-[11.5px] font-bold uppercase tracking-wide text-forest/55">
                        Total sales
                      </p>
                      <p className="mt-1.5 text-[22px] font-extrabold text-deep">1,284</p>
                    </div>
                    <div className="rounded-2xl bg-goldsoft/70 p-4">
                      <p className="text-[11.5px] font-bold uppercase tracking-wide text-forest/55">
                        Available
                      </p>
                      <p className="mt-1.5 text-[22px] font-extrabold text-deep">
                        {formatKsh(84650)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-end gap-1.5 rounded-2xl border border-forest/10 p-4">
                    {[35, 52, 44, 68, 80, 96, 72].map((h, i) => (
                      <span
                        key={i}
                        className={cn(
                          "flex-1 rounded-t-md",
                          i === 5 ? "gold-gradient" : "bg-brand/70",
                        )}
                        style={{ height: `${h * 0.7}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ============ FAQ ============ */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Questions" title="Everything you might ask" />
          </Reveal>
          <Faq />
        </Container>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="pb-24 sm:pb-28">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] brand-gradient p-8 text-center text-white sm:p-14">
              <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60" />
              <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-gold/25 blur-3xl" />
              <div className="relative">
                <Eyebrow tone="light" icon="bolt">
                  Ready when you are
                </Eyebrow>
                <h2 className="mx-auto mt-6 max-w-2xl text-[34px] leading-[1.05] sm:text-[46px]">
                  One Link. Everything You Sell.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-[16px] text-white/75">
                  Pick your path — sellers go right, buyers go left. Nobody has to create an account
                  to get started.
                </p>
                <div className="mx-auto mt-9 grid max-w-2xl gap-3 sm:grid-cols-2">
                  <Link to="/sell" className={btnClass("gold", "xl")}>
                    SELL TODAY
                    <Icon name="arrowRight" className="h-5 w-5" strokeWidth={2.4} />
                  </Link>
                  <Link
                    to="/explore"
                    className={btnClass("white", "xl", "border-2 border-white/25")}
                  >
                    EXPLORE US
                    <Icon name="compass" className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

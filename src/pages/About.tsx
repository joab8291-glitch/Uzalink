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

const VALUES = [
  {
    icon: "sparkles",
    title: "Simplicity",
    text: "One link, one screen, one payment. If it needs a manual, we rebuild it.",
  },
  {
    icon: "globe",
    title: "Accessibility",
    text: "Any phone, any network, any hustle. No laptop, no developer, no monthly contract.",
  },
  {
    icon: "phone",
    title: "Mobile-first commerce",
    text: "Designed thumb-first for Android and iPhone users on Kenyan data bundles.",
  },
  {
    icon: "mpesa",
    title: "M-Pesa-first payments",
    text: "M-Pesa is the default rail, with settlements to your verified number.",
  },
  {
    icon: "share",
    title: "Easy sharing",
    text: "Your link works everywhere Kenyans already are: WhatsApp, TikTok, Instagram, SMS.",
  },
  {
    icon: "shield",
    title: "Secure digital delivery",
    text: "Payments are verified server-side before anything is released or settled.",
  },
  {
    icon: "trend",
    title: "Seller growth",
    text: "Start free and accountless. Grow into Premium dashboards, analytics and settlements.",
  },
];

const STATS = [
  { k: "2,400+", v: "Sellers sharing links" },
  { k: "5%", v: "Flat commission" },
  { k: "95%", v: "To the seller" },
  { k: "6 hrs", v: "Settlement window" },
];

export function About() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-mint/60 pb-14 pt-28 sm:pb-16 sm:pt-32">
        <div className="pointer-events-none absolute -left-24 top-6 h-80 w-80 rounded-full bg-brandlight/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
        <Container className="relative">
          <div className="max-w-3xl">
            <Eyebrow icon="info">About UZALINK</Eyebrow>
            <h1 className="mt-5 text-[38px] leading-[1.02] text-deep sm:text-[54px]">
              Selling online should be as simple as{" "}
              <span className="text-brand">sharing a link.</span>
            </h1>
            <p className="mt-6 text-[17px] leading-relaxed text-forest/80 sm:text-[18.5px]">
              UZALINK makes it simple for anyone to sell products and services online without
              complicated account setup.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/sell" className={btnClass("gold", "lg")}>
                Sell Today
                <Icon name="arrowRight" className="h-5 w-5" />
              </Link>
              <Link to="/explore" className={btnClass("outline", "lg")}>
                Explore Us
                <Icon name="compass" className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.v} delay={i * 70}>
                <div className="rounded-3xl border border-forest/10 bg-white p-5">
                  <p className="text-[30px] font-extrabold leading-none text-deep">{s.k}</p>
                  <p className="mt-2 text-[13px] font-semibold uppercase tracking-wide text-forest/55">
                    {s.v}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* MISSION */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] brand-gradient p-8 text-white sm:p-12">
              <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60" />
              <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-gold/25 blur-3xl" />
              <div className="relative max-w-3xl">
                <Eyebrow tone="light" icon="bolt">
                  Our mission
                </Eyebrow>
                <p className="mt-6 text-[28px] font-extrabold leading-[1.15] sm:text-[40px]">
                  “To make online selling as simple as sharing a link.”
                </p>
                <p className="mt-6 text-[16px] leading-relaxed text-white/75">
                  Millions of Kenyans already sell every day — from a stall, a salon chair, a
                  kitchen table or a group chat. What they lack is not talent or products, it is the
                  paperwork that sits between them and a payment. UZALINK removes that paperwork and
                  replaces it with one Magic Link.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* STORY */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Why we built it"
                title="Built for the Kenyan hustle, not the Silicon Valley playbook"
              />
              <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-forest/78">
                <p>
                  A student selling study notes, a mama making Sunday chapati, a barber with a
                  waiting list, a photographer booked through DMs — all of them already have
                  customers. What they don't have is a checkout that works as fast as a WhatsApp
                  reply.
                </p>
                <p>
                  Traditional platforms ask sellers to register an account, verify an email, set up
                  a store, configure shipping and learn a dashboard before their first shilling
                  arrives. UZALINK flips it: create the product, set the price, lock your payment
                  number, share the link.
                </p>
                <p>
                  We charge a flat 5% commission, settle 95% within 6 business working hours of the
                  same day, and keep the public selling and buying flows completely account-free.
                  Seller management — earnings, analytics, settlements — lives separately behind a
                  passwordless Premium login.
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                <Badge tone="mint" icon="checkCircle">
                  Kenya-first
                </Badge>
                <Badge tone="mint" icon="phone">
                  Mobile-first
                </Badge>
                <Badge tone="mint" icon="mpesa">
                  M-Pesa-first
                </Badge>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { k: "01", t: "A market vendor", d: "Sells produce with a QR code taped to the stall." },
                  { k: "02", t: "A tutor", d: "Sells revision packs and books sessions by link." },
                  { k: "03", t: "A designer", d: "Delivers logo files the second payment verifies." },
                  { k: "04", t: "An event host", d: "Sells tickets and scans QR codes at the gate." },
                ].map((c) => (
                  <div
                    key={c.k}
                    className="rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_20px_45px_-38px_rgba(4,40,26,0.5)]"
                  >
                    <span className="text-[13px] font-extrabold text-golddeep">{c.k}</span>
                    <p className="mt-2 text-[15.5px] font-extrabold text-deep">{c.t}</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-forest/70">{c.d}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* VALUES */}
      <section className="bg-deep py-16 text-white sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              tone="light"
              eyebrow="What we stand for"
              title="Seven principles behind every Magic Link"
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:border-gold/40">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl gold-gradient text-deep">
                    <Icon name={v.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-[18px] text-white">{v.title}</h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-white/65">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="overflow-hidden rounded-[36px] border border-forest/10 bg-mint/70 p-8 text-center sm:p-12">
              <h2 className="mx-auto max-w-2xl text-[30px] leading-[1.08] text-deep sm:text-[40px]">
                Ready to put your hustle on a link?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[16px] text-forest/75">
                No account. No setup fees. Just your product, your price and your Magic Link.
              </p>
              <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
                <Link to="/sell" className={btnClass("gold", "xl")}>
                  SELL TODAY
                  <Icon name="arrowRight" className="h-5 w-5" strokeWidth={2.4} />
                </Link>
                <Link to="/explore" className={btnClass("deep", "xl")}>
                  EXPLORE US
                  <Icon name="compass" className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

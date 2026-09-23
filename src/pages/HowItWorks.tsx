import { cn } from "@/utils/cn";
import { BUYER_FLOW, SELLER_FLOW, SETTLEMENT_NOTE } from "@/lib/data";
import { Link } from "@/lib/router";
import { Icon } from "@/components/Icon";
import {
  Container,
  Eyebrow,
  Reveal,
  SectionHeading,
  btnClass,
} from "@/components/ui";
import { PhoneFrame, HeroScreen } from "@/components/PhoneMock";
import { CommissionBanner, CommissionCalculator } from "@/components/Commission";

function Flow({
  steps,
  tone,
}: {
  steps: { title: string; text: string; icon: string }[];
  tone: "light" | "dark";
}) {
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute bottom-6 left-[26px] top-6 w-0.5 sm:left-[30px]",
          tone === "dark" ? "bg-white/12" : "bg-forest/12",
        )}
      />
      <ol className="space-y-3.5">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 60}>
            <li className="relative flex gap-4">
              <span
                className={cn(
                  "relative z-10 flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl shadow-lg sm:h-[62px] sm:w-[62px]",
                  tone === "dark" ? "gold-gradient text-deep" : "bg-white text-forest shadow-forest/10",
                )}
              >
                <Icon name={s.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
                <span
                  className={cn(
                    "absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold",
                    tone === "dark" ? "bg-deep text-gold ring-2 ring-deep" : "bg-deep text-white",
                  )}
                >
                  {i + 1}
                </span>
              </span>

              <div
                className={cn(
                  "flex-1 rounded-3xl p-4 sm:p-5",
                  tone === "dark"
                    ? "border border-white/10 bg-white/5 backdrop-blur"
                    : "border border-forest/10 bg-white shadow-[0_18px_40px_-35px_rgba(4,40,26,0.5)]",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={cn(
                      "text-[16px] font-extrabold sm:text-[18px]",
                      tone === "dark" ? "text-white" : "text-deep",
                    )}
                  >
                    {s.title}
                  </p>
                  {i < steps.length - 1 && (
                    <Icon
                      name="chevronDown"
                      className={cn(
                        "h-5 w-5 shrink-0",
                        tone === "dark" ? "text-white/25" : "text-forest/25",
                      )}
                    />
                  )}
                </div>
                <p
                  className={cn(
                    "mt-1.5 text-[13.5px] leading-relaxed",
                    tone === "dark" ? "text-white/65" : "text-forest/70",
                  )}
                >
                  {s.text}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

export function HowItWorks() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden brand-gradient pb-14 pt-28 text-white sm:pb-16 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-70" />
        <Container className="relative">
          <div className="max-w-2xl">
            <Eyebrow tone="light" icon="info">
              How UZALINK works
            </Eyebrow>
            <h1 className="mt-5 text-[38px] leading-[1.02] sm:text-[54px]">
              Two flows.
              <br />
              <span className="text-gold">Zero sign up screens.</span>
            </h1>
            <p className="mt-5 text-[16.5px] leading-relaxed text-white/75">
              Sellers build a product and share a Magic Link. Buyers open the link, pay and receive.
              Neither side has to create an account to get started.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/sell" className={btnClass("gold", "lg")}>
                Sell Today
                <Icon name="arrowRight" className="h-5 w-5" />
              </Link>
              <Link to="/explore" className={btnClass("white", "lg", "border-2 border-white/25")}>
                Explore Us
                <Icon name="compass" className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* SELLER FLOW */}
      <section className="relative overflow-hidden bg-deep py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow tone="light" icon="bolt">
                  For sellers
                </Eyebrow>
                <h2 className="mt-5 text-[32px] leading-[1.06] sm:text-[42px]">
                  Product in, Magic Link out
                </h2>
                <p className="mt-4 text-[16px] leading-relaxed text-white/70">
                  Eight steps, one sitting. The whole flow runs on your phone and takes about two
                  minutes.
                </p>

                <ul className="mt-7 space-y-3">
                  {[
                    "No account, email or password",
                    "Payment number verified, then locked",
                    "You keep 95% of every sale",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-3 text-[14.5px] text-white/80">
                      <Icon name="checkCircle" className="h-5 w-5 shrink-0 text-gold" />
                      {t}
                    </li>
                  ))}
                </ul>

                <Link to="/sell" className={btnClass("gold", "lg", "mt-8 w-full sm:w-auto")}>
                  Start selling
                  <Icon name="arrowRight" className="h-5 w-5" />
                </Link>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-10 flex justify-center lg:mt-12">
                  <PhoneFrame className="hidden animate-float-slow lg:block">
                    <HeroScreen />
                  </PhoneFrame>
                </div>
              </Reveal>
            </div>

            <Flow steps={SELLER_FLOW} tone="dark" />
          </div>
        </Container>
      </section>

      {/* PAYMENT NUMBER LOCK */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="grid items-center gap-8 rounded-[32px] border-2 border-gold bg-goldsoft p-6 sm:p-10 lg:grid-cols-[1fr_1fr]">
              <div>
                <Eyebrow icon="lock">Step 4 matters most</Eyebrow>
                <h2 className="mt-5 text-[28px] leading-[1.08] text-deep sm:text-[36px]">
                  Set Your Payment Number — once.
                </h2>
                <p className="mt-4 text-[15.5px] leading-relaxed text-[#6d4f00]">
                  Enter your M-Pesa/payment number exactly as registered and intended for receiving
                  your UZALINK settlements. Where technically supported, UZALINK verifies ownership
                  with a short code before the number locks.
                </p>
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#e3b800] bg-white/70 p-4">
                  <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-golddeep" />
                  <p className="text-[14px] font-bold leading-relaxed text-[#6d4f00]">
                    Payment numbers cannot be changed after setup. Please double-check the number
                    before continuing.
                  </p>
                </div>
              </div>
              <div className="rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_25px_55px_-40px_rgba(4,40,26,0.5)]">
                <p className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-forest/50">
                  Verified Payment Number
                </p>
                <p className="mt-2 flex flex-wrap items-center gap-2.5 text-[26px] font-extrabold text-deep">
                  07XX XXX XXX
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-deep px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-white">
                    <Icon name="lock" className="h-3.5 w-3.5 text-gold" />
                    Locked
                  </span>
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-forest/70">
                  Locked numbers protect your settlements. There is deliberately no "change payment
                  number" button — support verifies identity first.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* BUYER FLOW */}
      <section className="bg-mint/60 py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <Flow steps={BUYER_FLOW} tone="light" />

            <div className="lg:sticky lg:top-28">
              <Reveal>
                <Eyebrow icon="compass">For buyers</Eyebrow>
                <h2 className="mt-5 text-[32px] leading-[1.06] text-deep sm:text-[42px]">
                  Link → product → pay → receive
                </h2>
                <p className="mt-4 text-[16px] leading-relaxed text-forest/75">
                  Buyers don't need to create an account. Sellers share their UZALINK Magic Links
                  through WhatsApp, Facebook, TikTok, Instagram, SMS, QR codes, websites and other
                  channels.
                </p>

                <div className="mt-7 grid grid-cols-2 gap-2.5">
                  {["WhatsApp", "Facebook", "TikTok", "Instagram", "SMS", "QR Code"].map((c) => (
                    <span
                      key={c}
                      className="rounded-2xl border border-forest/10 bg-white px-4 py-3 text-[13.5px] font-bold text-forest"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <Link to="/explore" className={btnClass("deep", "lg", "mt-8 w-full sm:w-auto")}>
                  Explore Us
                  <Icon name="compass" className="h-5 w-5" />
                </Link>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* COMMISSION */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Commission & settlement"
              title="5% UZALINK Commission. 95% Goes to the Seller."
              text="Clear maths on every sale, with fast settlement to your locked payment number."
            />
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-11">
              <CommissionBanner />
            </div>
          </Reveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <Reveal>
              <div className="h-full rounded-3xl border border-forest/10 bg-mint/60 p-6 sm:p-7">
                <p className="flex items-center gap-2.5 text-[16px] font-extrabold text-deep">
                  <Icon name="clock" className="h-5 w-5 text-brand" />
                  Seller settlement
                </p>
                <p className="mt-4 text-[15.5px] leading-relaxed text-forest/80">{SETTLEMENT_NOTE}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { k: "Same day", v: "Settlement window" },
                    { k: "6 hrs", v: "Business working hours" },
                    { k: "M-Pesa", v: "Payout channel" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-2xl border border-forest/10 bg-white p-4">
                      <p className="text-[19px] font-extrabold text-deep">{s.k}</p>
                      <p className="mt-1 text-[12px] font-semibold uppercase tracking-wide text-forest/55">
                        {s.v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <CommissionCalculator />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20 sm:pb-24">
        <Container>
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/sell"
                className="group flex items-center justify-between gap-4 rounded-[28px] brand-gradient p-6 text-white transition-transform hover:-translate-y-1 sm:p-7"
              >
                <div>
                  <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-gold">
                    Sellers
                  </p>
                  <p className="mt-2 text-[24px] font-extrabold sm:text-[28px]">Sell Today</p>
                  <p className="mt-2 text-[13.5px] text-white/70">
                    Create a product and get your Magic Link.
                  </p>
                </div>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gold-gradient text-deep transition-transform group-hover:translate-x-1">
                  <Icon name="arrowRight" className="h-6 w-6" strokeWidth={2.4} />
                </span>
              </Link>
              <Link
                to="/explore"
                className="group flex items-center justify-between gap-4 rounded-[28px] border border-forest/10 bg-mint/70 p-6 transition-transform hover:-translate-y-1 sm:p-7"
              >
                <div>
                  <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-brand">
                    Buyers
                  </p>
                  <p className="mt-2 text-[24px] font-extrabold text-deep sm:text-[28px]">
                    Explore Us
                  </p>
                  <p className="mt-2 text-[13.5px] text-forest/70">
                    Discover products from sellers.
                  </p>
                </div>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-deep text-gold transition-transform group-hover:translate-x-1">
                  <Icon name="compass" className="h-6 w-6" />
                </span>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

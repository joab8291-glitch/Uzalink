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
    text: "Upload your book, set your price and share one simple link with your readers.",
  },
  {
    icon: "globe",
    title: "Reach more readers",
    text: "Your book link can be shared anywhere your readers already are — WhatsApp, social media, SMS and websites.",
  },
  {
    icon: "phone",
    title: "Mobile-first",
    text: "Built for authors and readers using phones every day, without requiring complicated software.",
  },
  {
    icon: "mpesa",
    title: "M-Pesa-first payments",
    text: "Readers can pay for books using M-Pesa, with payment verification handled before access is released.",
  },
  {
    icon: "share",
    title: "Easy sharing",
    text: "Every book can have a dedicated link that authors can share directly with their audience.",
  },
  {
    icon: "shield",
    title: "Secure digital delivery",
    text: "Payments are verified server-side before digital book access is released.",
  },
  {
    icon: "trend",
    title: "Author growth",
    text: "Start publishing your books and build a direct relationship with the people who read your work.",
  },
];

const STATS = [
  { k: "95%", v: "Author earnings" },
  { k: "5%", v: "UZALINK commission" },
  { k: "M-Pesa", v: "Reader payments" },
  { k: "24/7", v: "Book link access" },
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
              Your book deserves
              <br />
              <span className="text-brand">more readers.</span>
            </h1>

            <p className="mt-6 text-[17px] leading-relaxed text-forest/80 sm:text-[18.5px]">
              UZALINK helps authors sell digital books online through a
              simple book link, secure M-Pesa payments and direct access for
              readers — without requiring readers to create an account.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/sell" className={btnClass("gold", "lg")}>
                Sell Your Book
                <Icon name="arrowRight" className="h-5 w-5" />
              </Link>

              <Link to="/explore" className={btnClass("outline", "lg")}>
                Explore Books
                <Icon name="compass" className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.v} delay={i * 70}>
                <div className="rounded-3xl border border-forest/10 bg-white p-5">
                  <p className="text-[30px] font-extrabold leading-none text-deep">
                    {s.k}
                  </p>

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
                  “To make selling a digital book as simple as sharing a
                  link.”
                </p>

                <p className="mt-6 text-[16px] leading-relaxed text-white/75">
                  Authors put time, knowledge and creativity into their
                  books. UZALINK is built to make the final step — getting
                  those books into readers' hands — simple. Upload your
                  digital book, set your price, share your link and let
                  readers pay securely through M-Pesa.
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
                title="Built for authors who want a simpler way to sell"
              />

              <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-forest/78">
                <p>
                  An author may have written an eBook, study guide,
                  devotional, novel, business book or educational resource,
                  but turning that work into a simple online purchase can
                  become complicated.
                </p>

                <p>
                  UZALINK focuses on the essentials: create your author
                  account, upload your digital book, add the book details,
                  choose your price and receive a unique link that you can
                  share with your readers.
                </p>

                <p>
                  Readers can open the book link, review the information,
                  pay through M-Pesa and receive access after the payment is
                  verified. They do not need to create a UZALINK account
                  simply to buy a book.
                </p>

                <p>
                  UZALINK keeps 5% of each verified sale while the author
                  receives 95%. The goal is to give authors a straightforward
                  digital sales channel without forcing them to build and
                  maintain their own e-commerce system.
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                <Badge tone="mint" icon="checkCircle">
                  Author-first
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
                  {
                    k: "01",
                    t: "Independent author",
                    d: "Publishes an eBook and shares the book link directly with readers.",
                  },
                  {
                    k: "02",
                    t: "Teacher or tutor",
                    d: "Publishes revision books, study guides or educational resources.",
                  },
                  {
                    k: "03",
                    t: "Writer or storyteller",
                    d: "Turns a completed manuscript into a digital book readers can buy.",
                  },
                  {
                    k: "04",
                    t: "Business author",
                    d: "Sells practical guides, manuals and knowledge resources online.",
                  },
                ].map((c) => (
                  <div
                    key={c.k}
                    className="rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_20px_45px_-38px_rgba(4,40,26,0.5)]"
                  >
                    <span className="text-[13px] font-extrabold text-golddeep">
                      {c.k}
                    </span>

                    <p className="mt-2 text-[15.5px] font-extrabold text-deep">
                      {c.t}
                    </p>

                    <p className="mt-1.5 text-[13px] leading-relaxed text-forest/70">
                      {c.d}
                    </p>
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
              title="Seven principles behind every UZALINK book"
            />
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:border-gold/40">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl gold-gradient text-deep">
                    <Icon name={v.icon} className="h-6 w-6" />
                  </span>

                  <h3 className="mt-5 text-[18px] text-white">
                    {v.title}
                  </h3>

                  <p className="mt-2.5 text-[14px] leading-relaxed text-white/65">
                    {v.text}
                  </p>
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
                Ready to put your book in front of more readers?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-[16px] text-forest/75">
                Upload your digital book, set your price and get a unique
                UZALINK link you can share with your audience.
              </p>

              <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
                <Link to="/sell" className={btnClass("gold", "xl")}>
                  SELL YOUR BOOK
                  <Icon
                    name="arrowRight"
                    className="h-5 w-5"
                    strokeWidth={2.4}
                  />
                </Link>

                <Link to="/explore" className={btnClass("deep", "xl")}>
                  EXPLORE BOOKS
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

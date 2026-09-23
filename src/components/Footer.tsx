import { Link } from "@/lib/router";
import { Icon, Logo } from "./Icon";
import { Container } from "./ui";

const COLS = [
  {
    title: "Sell Today",
    items: [
      { label: "Create a product", to: "/sell" },
      { label: "What you can sell", to: "/sell" },
      { label: "Commission & settlement", to: "/how-it-works" },
      { label: "Premium dashboard", to: "/seller-login" },
    ],
  },
  {
    title: "Buyers",
    items: [
      { label: "Explore Us", to: "/explore" },
      { label: "How buying works", to: "/how-it-works" },
      { label: "Sample Magic Link", to: "/magic/abc123" },
      { label: "Digital receipts", to: "/explore" },
    ],
  },
  {
    title: "UZALINK",
    items: [
      { label: "About Us", to: "/about" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "Seller Magic Login", to: "/seller-login" },
      { label: "Home", to: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-deep text-white">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
      <Container className="relative py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-4 text-[17px] font-bold text-gold">One Link. Everything You Sell.</p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-white/65">
              Kenya-first, mobile-first, M-Pesa-first commerce. Create a product, get your Magic
              Link and start selling — no account required.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["M-Pesa Payments", "5% Commission", "95% to Seller"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-white/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLS.map((col) => (
              <div key={col.title}>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-gold">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="text-[14.5px] font-medium text-white/70 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-white/50">
            © {new Date().getFullYear()} UZALINK. Made in Nairobi, Kenya 🇰🇪
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/50">
            <span className="inline-flex items-center gap-2">
              <Icon name="lock" className="h-4 w-4 text-gold" />
              Payment numbers lock after setup
            </span>
            <span className="inline-flex items-center gap-2">
              <Icon name="shield" className="h-4 w-4 text-gold" />
              Secure digital delivery
            </span>
          </div>
        </div>
      </Container>
      <div className="h-16 sm:h-0" />
    </footer>
  );
}

import { cn } from "@/utils/cn";
import { formatKsh } from "@/lib/data";
import { Icon } from "./Icon";

export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-[268px] shrink-0 rounded-[42px] border-[9px] border-deep bg-deep shadow-[0_50px_90px_-40px_rgba(0,0,0,0.75)] sm:w-[300px]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[42px] ring-1 ring-white/10" />
      <div className="absolute left-1/2 top-2.5 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-deep" />
      <div className="relative overflow-hidden rounded-[33px] bg-white">
        {children}
      </div>
    </div>
  );
}

const rows = [
  {
    icon: "file",
    name: "The Nairobi Story",
    price: 1200,
    tone: "bg-mint text-brand",
  },
  {
    icon: "file",
    name: "Building Your Future",
    price: 800,
    tone: "bg-goldsoft text-golddeep",
  },
  {
    icon: "file",
    name: "Faith & Purpose",
    price: 1000,
    tone: "bg-mint text-brand",
  },
  {
    icon: "file",
    name: "Start Your Business",
    price: 1500,
    tone: "bg-goldsoft text-golddeep",
  },
];

export function HeroScreen() {
  return (
    <div className="flex flex-col">
      {/* app header */}
      <div className="brand-gradient px-4 pb-5 pt-8 text-white">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M5 6v6a7 7 0 0 0 14 0V6"
                  stroke="#FFC800"
                  strokeWidth="2.6"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className="text-[13px] font-extrabold tracking-tight">
              UZALINK
            </span>
          </span>

          <span className="rounded-full bg-gold px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-deep">
            Live
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/60">
              Author earnings
            </p>

            <p className="mt-1 text-[26px] font-extrabold leading-none">
              {formatKsh(94650)}
            </p>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2 py-1 text-[9.5px] font-bold text-white/85">
            <Icon name="refresh" className="h-3 w-3 text-gold" />
            95% yours
          </span>
        </div>
      </div>

      {/* featured book card */}
      <div className="px-4 pt-4">
        <div className="overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm">
          <div className="relative h-28 bg-mint">
            <img
              src="https://images.pexels.com/photos/159711/books-book-pages-read-literature-159711.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
              alt="Digital book"
              className="h-full w-full object-cover"
            />

            <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-forest">
              Digital Book
            </span>
          </div>

          <div className="p-3">
            <p className="text-[12px] font-extrabold leading-snug text-deep">
              The Nairobi Story
            </p>

            <p className="mt-0.5 line-clamp-1 text-[10px] text-forest/60">
              By Amina Wanjiku · Instant access
            </p>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[15px] font-extrabold text-deep">
                {formatKsh(1200)}
              </span>

              <span className="inline-flex items-center gap-1 rounded-lg bg-deep px-2.5 py-1.5 text-[10px] font-bold text-white">
                <Icon
                  name="bolt"
                  className="h-3 w-3 text-gold"
                  strokeWidth={0}
                />
                Buy Book
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* your books */}
      <div className="px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-forest/50">
            Your books
          </p>

          <span className="text-[10px] font-bold text-brand">
            + New Book
          </span>
        </div>

        <div className="mt-2.5 space-y-2">
          {rows.map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-2.5 rounded-xl border border-forest/8 bg-mint/40 px-2.5 py-2"
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg",
                  r.tone,
                )}
              >
                <Icon name={r.icon} className="h-3.5 w-3.5" />
              </span>

              <span className="flex-1 truncate text-[11.5px] font-bold text-deep">
                {r.name}
              </span>

              <span className="text-[11.5px] font-extrabold text-forest/70">
                {formatKsh(r.price)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* M-Pesa payment */}
      <div className="mt-auto bg-mint/60 px-4 py-3">
        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 shadow-sm">
          <span className="flex items-center gap-2">
            <Icon name="mpesa" className="h-5 w-5 text-brand" />

            <span className="text-[10.5px] font-extrabold leading-tight text-deep">
              M-Pesa
              <span className="block text-[9px] font-semibold text-forest/55">
                Book payment ready
              </span>
            </span>
          </span>

          <span className="rounded-lg gold-gradient px-2.5 py-1.5 text-[10px] font-extrabold text-deep">
            Pay
          </span>
        </div>
      </div>
    </div>
  );
}

function FloatingChip({
  className,
  children,
  delay = "0s",
}: {
  className?: string;
  children: React.ReactNode;
  delay?: string;
}) {
  return (
    <div
      className={cn(
        "absolute animate-float rounded-2xl shadow-[0_20px_45px_-20px_rgba(0,0,0,0.55)]",
        className,
      )}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

export function HeroVisual() {
  return (
    <div className="relative mx-auto flex w-full max-w-[520px] items-center justify-center py-6">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[420px] w-[420px] rounded-full bg-gold/20 blur-[90px]" />
      </div>

      <div className="pointer-events-none absolute -right-6 top-10 h-40 w-40 rounded-full bg-brandlight/30 blur-3xl" />

      {/* rotating ring decoration */}
      <div className="pointer-events-none absolute h-[330px] w-[330px] animate-spin-slow rounded-full border border-dashed border-white/15 sm:h-[400px] sm:w-[400px]" />

      <div className="relative animate-fade-up">
        <PhoneFrame className="animate-float-slow">
          <HeroScreen />
        </PhoneFrame>
      </div>

      {/* payment verified toast */}
      <FloatingChip
        className="left-0 top-8 z-10 w-[190px] bg-white/95 p-3 backdrop-blur sm:-left-8"
        delay="0.4s"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint text-brand">
            <Icon name="checkCircle" className="h-5 w-5" />
          </span>

          <div className="leading-tight">
            <p className="text-[11.5px] font-extrabold text-deep">
              Book payment verified
            </p>

            <p className="text-[10px] font-semibold text-forest/60">
              KSh 1,200 · M-Pesa
            </p>
          </div>
        </div>
      </FloatingChip>

      {/* book thumbnail */}
      <FloatingChip
        className="right-0 top-24 z-10 hidden w-[150px] overflow-hidden rounded-2xl bg-white/95 p-2 backdrop-blur sm:block sm:-right-6"
        delay="1.1s"
      >
        <div className="h-20 overflow-hidden rounded-xl">
          <img
            src="https://images.pexels.com/photos/159711/books-book-pages-read-literature-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
            alt="Digital book"
            className="h-full w-full object-cover"
          />
        </div>

        <p className="mt-2 px-1 text-[11px] font-extrabold leading-tight text-deep">
          The Nairobi Story
        </p>

        <p className="px-1 pb-1 text-[10px] font-bold text-brand">
          {formatKsh(1200)}
        </p>
      </FloatingChip>

      {/* author settlement chip */}
      <FloatingChip
        className="bottom-16 left-0 z-10 hidden bg-deep/90 p-3 backdrop-blur sm:-left-10 sm:block"
        delay="0.8s"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gold-gradient text-deep">
            <Icon name="wallet" className="h-5 w-5" />
          </span>

          <div className="leading-tight">
            <p className="text-[11.5px] font-extrabold text-white">
              Author earnings
            </p>

            <p className="text-[10px] font-semibold text-gold">
              {formatKsh(1140)} · 95% yours
            </p>
          </div>
        </div>
      </FloatingChip>

      {/* book magic link chip */}
      <FloatingChip
        className="-bottom-2 right-2 z-10 bg-white/95 px-3.5 py-2.5 backdrop-blur sm:right-0"
        delay="1.6s"
      >
        <div className="flex items-center gap-2">
          <Icon name="link" className="h-4 w-4 text-brand" />

          <span className="font-mono text-[11px] font-bold text-deep">
            uzalink.co.ke/magic/abc123
          </span>
        </div>
      </FloatingChip>
    </div>
  );
}

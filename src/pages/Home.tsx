import { Link } from "@/lib/router";
import { ArrowRight, Check, Menu } from "lucide-react";

function UzaLinkLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2" aria-label="UZALINK">
      <svg viewBox="0 0 64 64" className={compact ? "h-9 w-9" : "h-12 w-12"} aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#0b6248" />
        <path d="M19 14v25c0 8 5 12 13 12s13-4 13-12V14" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
        <path d="M36 14c9 2 14 8 14 16 0 4-1 7-3 10" fill="none" stroke="#f7c91b" strokeWidth="6" strokeLinecap="round" />
        <path d="M22 38c4-7 9-10 14-10 5 0 9 3 11 8" fill="none" stroke="#f7c91b" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="text-xl font-black tracking-tight text-forest">UZALINK</span>
    </div>
  );
}

export function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b6048] text-white">
      <header className="relative z-20 bg-white shadow-sm">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="UzaLink home"><UzaLinkLogo compact /></Link>
          <div className="flex items-center gap-3">
            <Link to="/sell" className="rounded-xl bg-[#f7d21f] px-5 py-3 text-sm font-extrabold text-forest shadow-sm transition hover:brightness-105">Sell Today</Link>
            <button type="button" aria-label="Open menu" className="rounded-xl p-2 text-forest hover:bg-mint/50"><Menu className="h-7 w-7" /></button>
          </div>
        </div>
      </header>

      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-[#064d3b] via-[#0b6048] to-[#52776a]">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -right-24 -top-20 h-[520px] w-[420px] rotate-[17deg] rounded-[45%] bg-[#315f52]/60 blur-[1px]" />
          <div className="absolute -bottom-64 -right-20 h-[720px] w-[500px] rotate-[27deg] rounded-[48%] bg-[#184d3e]/80" />
          <div className="absolute -bottom-32 -left-36 h-[600px] w-[520px] rotate-[-18deg] rounded-[45%] bg-[#0b6a4d]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,255,255,.10),transparent_35%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-start px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
          <div className="w-full max-w-3xl">
            <div className="mb-7 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#f7d21f] sm:text-sm">
              <span className="h-px w-9 bg-[#f7d21f]" />
              Kenya's link-first commerce platform
            </div>

            <div className="mb-2 text-xl font-black tracking-tight text-[#f7d21f] sm:text-2xl">UZALINK</div>
            <h1 className="max-w-2xl text-[46px] font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              One Link.<br />
              Everything You Sell.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Create your product, set your price, add your payment number, get your unique Magic Link and start selling.
            </p>

            <div className="mt-8 grid max-w-xl gap-3">
              <Link to="/sell" className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#f7d21f] px-6 text-base font-extrabold text-forest shadow-lg transition hover:brightness-105">
                Sell Today <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/explore" className="flex h-14 items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-6 text-base font-extrabold text-white backdrop-blur-sm transition hover:bg-white/15">
                Explore Us <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white/70">
              <Check className="h-4 w-4 text-[#f7d21f]" />
              No account needed to start selling or buying
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

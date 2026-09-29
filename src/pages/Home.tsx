import { Link } from "@/lib/router";
import { ArrowRight, Check, Menu, ShieldCheck, Smartphone, Zap } from "lucide-react";

function UzaLinkLogo() {
  return (
    <div className="flex items-center gap-2.5" aria-label="UZALINK">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#075a43] shadow-sm">
        <span className="absolute left-[10px] top-[8px] h-6 w-4 rounded-b-[10px] border-[4px] border-white border-t-0" />
        <span className="absolute right-[8px] top-[7px] h-6 w-5 rotate-[-18deg] rounded-full border-[4px] border-[#f7d21f] border-l-0 border-b-0" />
        <span className="absolute bottom-[9px] left-[11px] h-2 w-5 rotate-[-28deg] rounded-full bg-[#f7d21f]" />
      </div>
      <div className="leading-none"><div className="text-[21px] font-black tracking-[-0.04em] text-[#075a43]">UZALINK</div><div className="mt-1 text-[7px] font-bold tracking-[0.16em] text-[#075a43]/70">TURN LINKS INTO SALES.</div></div>
    </div>
  );
}

export function Home() {
  return (
    <main className="min-h-screen bg-[#f7fbf8] text-[#073f31]">
      <header className="sticky top-0 z-30 border-b border-[#075a43]/10 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="UzaLink home"><UzaLinkLogo /></Link>
          <nav className="hidden items-center gap-8 text-sm font-bold text-[#075a43]/75 lg:flex">
            <Link to="/explore" className="transition hover:text-[#075a43]">Explore</Link>
            <Link to="/how-it-works" className="transition hover:text-[#075a43]">How It Works</Link>
            <Link to="/about" className="transition hover:text-[#075a43]">About</Link>
          </nav>
          <div className="flex items-center gap-2.5"><Link to="/sell" className="rounded-xl bg-[#f7d21f] px-5 py-3 text-sm font-extrabold text-[#073f31] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">Sell Today</Link><button type="button" aria-label="Open menu" className="rounded-xl p-2 text-[#075a43] hover:bg-[#e9f5ef] lg:hidden"><Menu className="h-6 w-6" /></button></div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#064d3b] via-[#075a43] to-[#477667] text-white">
        <div className="pointer-events-none absolute inset-0"><div className="absolute -right-24 -top-32 h-[620px] w-[520px] rotate-[20deg] rounded-[45%] bg-white/[0.06]" /><div className="absolute -bottom-80 right-0 h-[760px] w-[500px] rotate-[25deg] rounded-[48%] bg-[#063e31]/70" /><div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#f7d21f]/[0.05] blur-3xl" /></div>
        <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#f7d21f] sm:text-sm"><span className="h-px w-9 bg-[#f7d21f]" />Kenya's link-first commerce platform</div>
            <h1 className="text-[48px] font-black leading-[.96] tracking-[-.045em] sm:text-6xl lg:text-[76px]">One Link.<span className="block text-[#f7d21f]">Everything You Sell.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/75 sm:text-lg">Sell digital products, services, bookings, events, courses and physical products. Get paid with M-Pesa and share one simple Magic Link.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to="/sell" className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#f7d21f] px-7 font-extrabold text-[#073f31] shadow-lg transition hover:-translate-y-0.5">Sell Today <ArrowRight className="h-5 w-5" /></Link><Link to="/explore" className="flex h-14 items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-7 font-extrabold text-white backdrop-blur transition hover:bg-white/15">Explore Marketplace <ArrowRight className="h-5 w-5" /></Link></div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70"><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#f7d21f]" />Free seller access</span><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#f7d21f]" />M-Pesa payments</span><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#f7d21f]" />95% seller earnings</span></div>
          </div>
          <div className="mx-auto w-full max-w-md lg:ml-auto"><div className="rounded-[30px] border border-white/15 bg-white/[0.09] p-5 shadow-2xl backdrop-blur-xl sm:p-7"><div className="rounded-[22px] bg-white p-6 text-[#073f31] shadow-xl"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-[#075a43]/50">Your Magic Link</p><p className="mt-2 text-2xl font-black">Ready to sell</p></div><div className="rounded-xl bg-[#e9f5ef] p-3 text-[#075a43]"><Zap className="h-6 w-6" /></div></div><div className="mt-6 rounded-xl bg-[#f3f8f5] p-4"><p className="text-xs font-semibold text-[#075a43]/50">uzalink.vercel.app/#/magic/...</p><p className="mt-2 font-bold">Share one link. Get customers.</p></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#e9f5ef] p-4"><p className="text-xs text-[#075a43]/50">Payment</p><p className="mt-1 font-black">M-Pesa</p></div><div className="rounded-xl bg-[#fff7cc] p-4"><p className="text-xs text-[#075a43]/50">You keep</p><p className="mt-1 font-black">95%</p></div></div><div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#075a43]/65"><ShieldCheck className="h-4 w-4 text-[#075a43]" />Secure, Kenya-first commerce</div></div></div></div>
        </div>
      </section>

      <section className="border-b border-[#075a43]/10 bg-white"><div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8"><div className="flex items-center gap-4"><div className="rounded-xl bg-[#e9f5ef] p-3 text-[#075a43]"><Smartphone className="h-5 w-5" /></div><div><p className="font-bold text-[#073f31]">Mobile first</p><p className="text-sm text-[#075a43]/55">Built for Kenyan customers</p></div></div><div className="flex items-center gap-4"><div className="rounded-xl bg-[#fff7cc] p-3 text-[#075a43]"><Zap className="h-5 w-5" /></div><div><p className="font-bold text-[#073f31]">Simple selling</p><p className="text-sm text-[#075a43]/55">Create and share one link</p></div></div><div className="flex items-center gap-4"><div className="rounded-xl bg-[#e9f5ef] p-3 text-[#075a43]"><ShieldCheck className="h-5 w-5" /></div><div><p className="font-bold text-[#073f31]">Secure payments</p><p className="text-sm text-[#075a43]/55">M-Pesa-first checkout</p></div></div></div></section>

      <section className="bg-[#f7fbf8]"><div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#075a43]">Start selling today</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#073f31] sm:text-4xl">Create. Share. Sell.</h2><p className="mx-auto mt-4 max-w-xl text-[#075a43]/60">No Premium required to sell. Create your offer, get your Magic Link on screen and share it with customers.</p><Link to="/sell" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#f7d21f] px-7 py-4 font-extrabold text-[#073f31] shadow-md transition hover:-translate-y-0.5">Sell Today <ArrowRight className="h-5 w-5" /></Link></div></section>
    </main>
  );
}

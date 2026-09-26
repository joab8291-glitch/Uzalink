import { Link } from "@/lib/router";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
  BookOpen,
  Wallet,
  LockKeyhole,
  Smartphone,
  Download,
  BadgeCheck,
  Sparkles,
  PenLine,
} from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* =========================
          HERO
      ========================== */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Hero copy */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
                <Sparkles className="h-4 w-4" />
                Built for African authors
              </div>

              <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                Sell your books.
                <span className="block bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Reach more readers.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                UzaLink gives authors a simple way to sell their digital books
                online, accept M-Pesa payments and securely deliver their
                books to readers.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/sell"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
                >
                  Start Selling Your Book
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
                >
                  Explore Books
                  <BookOpen className="h-5 w-5" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  Free author account
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  M-Pesa payments
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  Keep 95%
                </div>
              </div>
            </div>

            {/* Author earnings card */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 blur-2xl" />

              <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Author earnings
                    </p>

                    <p className="mt-1 text-4xl font-black">
                      95%
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-500/10 p-4">
                    <Wallet className="h-7 w-7 text-emerald-400" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-500/10 p-2">
                          <BookOpen className="h-5 w-5 text-indigo-400" />
                        </div>

                        <div>
                          <p className="font-semibold">
                            Your book sale
                          </p>

                          <p className="text-sm text-slate-400">
                            Example: KES 1,000 book
                          </p>
                        </div>
                      </div>

                      <p className="font-bold">
                        KES 1,000
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-300">
                          UzaLink fee
                        </p>

                        <p className="text-sm text-slate-500">
                          5%
                        </p>
                      </div>

                      <p className="font-bold text-slate-300">
                        KES 50
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-emerald-300">
                          You receive
                        </p>

                        <p className="text-sm text-emerald-400/70">
                          95% of the sale
                        </p>
                      </div>

                      <p className="text-xl font-black text-emerald-300">
                        KES 950
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 rounded-xl bg-indigo-500/10 p-4 text-sm text-indigo-200">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-indigo-400" />
                  Secure M-Pesa payments and protected book delivery.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          AUTHOR MODEL
      ========================== */}
      <section className="border-y border-white/5 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-400">
              Simple author model
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Turn your book into a digital business
            </h2>

            <p className="mt-5 text-slate-400">
              Create your free author account, upload your book, set your
              price and share your unique book link with readers. No Premium
              subscription is required.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <PenLine className="h-6 w-6" />
              </div>

              <div className="mb-2 text-sm font-bold text-indigo-400">
                STEP 01
              </div>

              <h3 className="text-xl font-bold">
                Create your author account
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Enter your email and receive a secure Magic Link. No password
                is required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <BookOpen className="h-6 w-6" />
              </div>

              <div className="mb-2 text-sm font-bold text-cyan-400">
                STEP 02
              </div>

              <h3 className="text-xl font-bold">
                Upload and sell your book
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Add your book title, cover, description and digital book file,
                then set the price you want readers to pay.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Wallet className="h-6 w-6" />
              </div>

              <div className="mb-2 text-sm font-bold text-emerald-400">
                STEP 03
              </div>

              <h3 className="text-xl font-bold">
                Earn from every sale
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                When a reader pays, UzaLink keeps 5% and the remaining 95% is
                credited to your author balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================== */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-cyan-400">
                Built for authors
              </span>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Everything you need to sell your books online
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-400">
                UzaLink handles the important parts of a digital book sale so
                you can focus on writing, publishing and reaching your readers.
              </p>

              <div className="mt-9 space-y-5">
                <div className="flex gap-4">
                  <div className="mt-1 rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                    <Zap className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Fast M-Pesa payments
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Readers can pay for your book using M-Pesa and their
                      order is processed through the UzaLink backend.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
                    <LockKeyhole className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Secure book delivery
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Your digital book files can be delivered using protected,
                      temporary download access after payment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                    <Wallet className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Author earnings dashboard
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Track book sales, available balance, pending payouts
                      and your author activity from one dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 rounded-lg bg-purple-500/10 p-2 text-purple-400">
                    <Download className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      Controlled book downloads
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Download limits and expiry controls can help authors
                      protect their digital book files.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature card */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-white/[0.03] to-cyan-500/10 p-8">
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm text-slate-500">
                      Author dashboard
                    </p>

                    <p className="mt-1 text-2xl font-black">
                      Your book earnings
                    </p>
                  </div>

                  <BadgeCheck className="h-7 w-7 text-emerald-400" />
                </div>

                <div className="py-7">
                  <p className="text-sm text-slate-500">
                    Available balance
                  </p>

                  <p className="mt-2 text-4xl font-black">
                    KES 12,350
                  </p>

                  <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                  </div>

                  <div className="mt-3 flex justify-between text-xs text-slate-500">
                    <span>95% author earnings</span>
                    <span>5% platform fee</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/[0.04] p-4">
                    <p className="text-xs text-slate-500">
                      Book sales
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      48
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/[0.04] p-4">
                    <p className="text-xs text-slate-500">
                      Books
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      12
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          READERS
      ========================== */}
      <section className="border-y border-white/5 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                <Smartphone className="h-6 w-6 text-cyan-400" />
              </div>

              <h2 className="text-2xl font-black">
                Readers can buy without an account
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                Readers don't need to create a UzaLink account just to buy a
                book. They can open an author's book link, provide their
                details, pay through M-Pesa and receive secure access to their
                purchase.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                  No reader account required
                </li>

                <li className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                  M-Pesa checkout
                </li>

                <li className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                  Secure book access
                </li>
              </ul>

              <Link
                to="/explore"
                className="mt-8 inline-flex items-center gap-2 font-bold text-cyan-400 hover:text-cyan-300"
              >
                Explore books
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                <ShieldCheck className="h-6 w-6 text-indigo-400" />
              </div>

              <h2 className="text-2xl font-black">
                Authors stay in control
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                Your author account gives you access to your books, sales,
                earnings and payout information without requiring a paid
                Premium plan.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                  Free passwordless Magic Link login
                </li>

                <li className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                  Create and manage your books
                </li>

                <li className="flex gap-3">
                  <Check className="h-5 w-5 shrink-0 text-emerald-400" />
                  Track book sales and earnings
                </li>
              </ul>

              <Link
                to="/seller-login"
                className="mt-8 inline-flex items-center gap-2 font-bold text-indigo-400 hover:text-indigo-300"
              >
                Author login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          COMMISSION
      ========================== */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-8">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-400">
            Transparent pricing
          </span>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Keep 95% of every successful book sale
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
            UzaLink applies a 5% platform commission to successful book
            sales. The remaining 95% is credited to the author's balance.
          </p>

          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
              <p className="text-sm text-slate-500">
                UzaLink
              </p>

              <p className="mt-2 text-4xl font-black">
                5%
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Platform commission
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-7">
              <p className="text-sm text-emerald-400/80">
                Author
              </p>

              <p className="mt-2 text-4xl font-black text-emerald-300">
                95%
              </p>

              <p className="mt-2 text-sm text-emerald-400/70">
                Author earnings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          PREMIUM
      ========================== */}
      <section className="border-y border-white/5 bg-slate-900/50">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">
            <Sparkles className="h-7 w-7 text-purple-400" />
          </div>

          <h2 className="mt-6 text-3xl font-black sm:text-4xl">
            Premium is optional
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
            You don't need Premium to start selling your books. Your free
            author account provides the core tools needed to upload books,
            receive orders, track earnings and manage your author activity.
          </p>

          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-purple-400/20 bg-purple-500/5 p-6 text-left">
            <div className="flex gap-4">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-purple-400" />

              <div>
                <h3 className="font-bold">
                  Optional Premium features
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Premium can provide additional author-management features
                  as the platform grows. It is not required to sell books.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-cyan-500/10 to-purple-600/20" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center lg:px-8">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            Ready to sell your book?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Create your free author account, upload your first book and start
            accepting payments from readers through M-Pesa.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/seller-login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-slate-950 transition hover:bg-slate-100"
            >
              Become an Author Seller
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 font-bold text-white transition hover:bg-white/10"
            >
              Explore Books
              <BookOpen className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================
          FAQ
      ========================== */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-400">
              FAQ
            </span>

            <h2 className="mt-3 text-3xl font-black">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-bold">
                Do I need Premium to sell my book on UzaLink?
              </h3>

              <p className="mt-2 leading-7 text-slate-400">
                No. Authors can create a free account using a secure Magic
                Link and use the core book-selling features without Premium.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-bold">
                Do I need a password to create an author account?
              </h3>

              <p className="mt-2 leading-7 text-slate-400">
                No. UzaLink uses passwordless Magic Link authentication. A
                secure login link is sent to your email.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-bold">
                How much does UzaLink charge authors?
              </h3>

              <p className="mt-2 leading-7 text-slate-400">
                UzaLink applies a 5% commission to successful book sales. The
                author receives the remaining 95%.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-bold">
                Do readers need a UzaLink account?
              </h3>

              <p className="mt-2 leading-7 text-slate-400">
                No. Readers can purchase books without creating a UzaLink
                account.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-bold">
                How do authors receive their earnings?
              </h3>

              <p className="mt-2 leading-7 text-slate-400">
                Successful book sales add the author's 95% share to their
                available balance. Authors can manage their payout details and
                request payouts from their author dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-bold">
                What types of books can I sell?
              </h3>

              <p className="mt-2 leading-7 text-slate-400">
                UzaLink is designed for authors selling digital books. You can
                provide your book title, description, cover and digital book
                file, then sell it directly to your readers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}
      <section className="border-t border-white/5 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-bold">
                UzaLink
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Helping authors sell their books online.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-400">
              <Link
                to="/explore"
                className="transition hover:text-white"
              >
                Explore Books
              </Link>

              <Link
                to="/sell"
                className="transition hover:text-white"
              >
                Sell Your Book
              </Link>

              <Link
                to="/how-it-works"
                className="transition hover:text-white"
              >
                How it works
              </Link>

              <Link
                to="/about"
                className="transition hover:text-white"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

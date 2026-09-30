import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Menu,
  ShieldCheck,
  Smartphone,
  Store,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Link } from "@/lib/router";

const faqs = [
  {
    question: "What is UZALINK?",
    answer:
      "UZALINK is a Kenya-first online selling platform that helps creators, freelancers, educators and other sellers create a product page, share one Magic Link and receive customer payments online.",
  },
  {
    question: "What can I sell on UZALINK?",
    answer:
      "You can list digital products such as ebooks, courses, templates and files, as well as services, bookings and other products supported by your UZALINK seller account.",
  },
  {
    question: "How do customers pay?",
    answer:
      "Customers can complete checkout through the payment options currently enabled on UZALINK. For supported purchases, M-Pesa is used to make the payment and UZALINK records the order after successful confirmation.",
  },
  {
    question: "Do customers need an account to buy?",
    answer:
      "No. UZALINK is designed around a simple shareable link and a low-friction buyer experience, so customers can open a seller's link and continue through the available checkout flow.",
  },
  {
    question: "How much does UZALINK charge sellers?",
    answer:
      "UZALINK currently uses a 5% commission model on eligible sales. Your dashboard shows the sale amount, UZALINK commission and your seller share.",
  },
];

export function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#f7fbf8] text-[#073f31]">
      <header className="sticky top-0 z-50 border-b border-[#075a43]/10 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="UZALINK Kenya home">
            <BrandLogo className="w-[155px] sm:w-[185px]" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-bold text-[#075a43]/75 lg:flex">
            <Link to="/explore" className="transition hover:text-[#075a43]">
              Explore
            </Link>
            <Link to="/how-it-works" className="transition hover:text-[#075a43]">
              How It Works
            </Link>
            <Link to="/about" className="transition hover:text-[#075a43]">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/sell"
              className="rounded-xl bg-[#f7d21f] px-5 py-3 text-sm font-extrabold text-[#073f31] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Sell Today
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              className="rounded-xl border border-[#075a43]/10 p-2 text-[#075a43] hover:bg-[#e9f5ef] lg:hidden"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-[#075a43]/10 bg-white px-4 py-4 shadow-lg lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-2">
              <Link
                onClick={() => setMenuOpen(false)}
                to="/explore"
                className="rounded-xl px-4 py-3 font-bold hover:bg-[#e9f5ef]"
              >
                Explore Marketplace
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                to="/how-it-works"
                className="rounded-xl px-4 py-3 font-bold hover:bg-[#e9f5ef]"
              >
                How It Works
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                to="/about"
                className="rounded-xl px-4 py-3 font-bold hover:bg-[#e9f5ef]"
              >
                About UZALINK
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                to="/sell"
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#f7d21f] px-4 py-3 font-extrabold"
              >
                Sell Today <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#064d3b] via-[#075a43] to-[#477667] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-32 h-[620px] w-[520px] rotate-[20deg] rounded-[45%] bg-white/[0.06]" />
          <div className="absolute -bottom-80 right-0 h-[760px] w-[500px] rotate-[25deg] rounded-[48%] bg-[#063e31]/70" />
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#f7d21f]/[0.05] blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#f7d21f] sm:text-sm">
              <span className="h-px w-9 bg-[#f7d21f]" />
              Kenya&apos;s digital selling platform
            </div>

            <h1 className="text-[46px] font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-[70px]">
              Sell Digital Products Online in Kenya with UZALINK
            </h1>

            <div className="mt-7 max-w-2xl space-y-4 text-base leading-7 text-white/78 sm:text-lg">
              <p>
                UZALINK helps creators, freelancers, educators and online sellers sell digital products through a simple, shareable link. Create your product or service, get your UZALINK page and share it wherever your customers are.
              </p>
              <p>
                Share your link on WhatsApp, Instagram, Facebook or other platforms, let customers complete checkout, and deliver supported products through UZALINK without needing a traditional online store.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/sell"
                className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#f7d21f] px-7 font-extrabold text-[#073f31] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Start Selling Today <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/explore"
                className="flex h-14 items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-7 font-extrabold text-white transition hover:bg-white/15"
              >
                Explore Marketplace <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/72">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#f7d21f]" />
                Simple seller setup
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#f7d21f]" />
                M-Pesa checkout
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#f7d21f]" />
                95% seller share on eligible sales
              </span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:ml-auto">
            <div className="rounded-[30px] border border-white/15 bg-white/[0.09] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="rounded-[22px] bg-white p-6 text-[#073f31] shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#075a43]/50">
                      Your UZALINK page
                    </p>
                    <p className="mt-2 text-2xl font-black">Ready to sell</p>
                  </div>
                  <div className="rounded-xl bg-[#e9f5ef] p-3 text-[#075a43]">
                    <Zap className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-[#f3f8f5] p-4">
                  <p className="text-xs font-semibold text-[#075a43]/50">
                    uzalink.vercel.app/#/magic/your-link
                  </p>
                  <p className="mt-2 font-bold">Create once. Share everywhere.</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#e9f5ef] p-4">
                    <p className="text-xs text-[#075a43]/50">Customer payment</p>
                    <p className="mt-1 font-black">M-Pesa</p>
                  </div>
                  <div className="rounded-xl bg-[#fff7cc] p-4">
                    <p className="text-xs text-[#075a43]/50">Seller share</p>
                    <p className="mt-1 font-black">95%</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#075a43]/65">
                  <ShieldCheck className="h-4 w-4" />
                  Kenya-first online selling
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#075a43]/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-[#e9f5ef] p-3 text-[#075a43]">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">Built for mobile selling</p>
              <p className="text-sm text-[#075a43]/55">Reach customers on WhatsApp and social platforms</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-[#fff7cc] p-3 text-[#075a43]">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">One shareable link</p>
              <p className="text-sm text-[#075a43]/55">Show products and offers from one page</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-[#e9f5ef] p-3 text-[#075a43]">
              <WalletCards className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">M-Pesa-first checkout</p>
              <p className="text-sm text-[#075a43]/55">Accept supported M-Pesa payments online</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#075a43]">About the platform</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">What is UZALINK?</h2>
            <p className="mt-5 text-base leading-7 text-[#075a43]/68 sm:text-lg">
              UZALINK gives Kenyan online sellers a simple way to turn a product, service or offer into a shareable sales page. Instead of sending customers through a complicated store, you can share one link and guide them from your offer to checkout.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Create", "Add your product or service, price, description and the information customers need before buying."],
              ["Share", "Use your UZALINK page and Magic Link across WhatsApp, Instagram, Facebook and other channels."],
              ["Sell", "Customers open your link, complete the available checkout flow and receive the product or service according to its delivery method."],
            ].map(([title, text], index) => (
              <div key={title} className="rounded-3xl border border-[#075a43]/10 bg-[#f7fbf8] p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#075a43] text-sm font-black text-white">0{index + 1}</div>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#075a43]/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbf8]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#075a43]">How it works</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">How UZALINK Works</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#075a43]/65">
                UZALINK keeps the selling journey straightforward: create your offer, get your link, share it, receive a confirmed payment and deliver what you sold.
              </p>
              <Link to="/how-it-works" className="mt-7 inline-flex items-center gap-2 font-extrabold text-[#075a43]">
                See the full process <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["01", "Create your offer", "Add your product, service, price and delivery details."],
                ["02", "Get your UZALINK", "Your offer can be opened from a simple shareable page."],
                ["03", "Share everywhere", "Post your link on WhatsApp, Instagram, Facebook or wherever your customers are."],
                ["04", "Customer pays & receives", "The customer completes the available payment flow and gets access according to the product delivery method."],
              ].map(([number, title, text]) => (
                <div key={number} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#075a43]/8">
                  <span className="text-xs font-black tracking-widest text-[#075a43]/45">{number}</span>
                  <h3 className="mt-3 text-lg font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#075a43]/60">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#075a43] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f7d21f]">For Kenyan sellers</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Built for Kenyan Online Sellers</h2>
            <p className="mt-5 text-base leading-7 text-white/72 sm:text-lg">
              Whether you are a creator selling an ebook, a freelancer selling a service, an educator selling a course, or a digital seller building a catalogue, UZALINK gives you a practical way to put your offers online and share them directly with customers.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Creators & digital product sellers",
              "Freelancers & service providers",
              "Educators & course creators",
              "Coaches and online businesses",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Check className="h-5 w-5 text-[#f7d21f]" />
                <p className="mt-4 font-bold leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#075a43]">Payments</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Accept M-Pesa Payments</h2>
              <p className="mt-5 text-base leading-7 text-[#075a43]/65">
                For products using the supported M-Pesa checkout flow, customers can pay from their mobile device and UZALINK records the order after successful payment confirmation. This makes it easier to connect a shared sales link with a familiar Kenyan payment experience.
              </p>
            </div>
            <div className="rounded-3xl border border-[#075a43]/10 bg-[#f7fbf8] p-7">
              <div className="grid gap-5 sm:grid-cols-3">
                {[
                  ["01", "Customer opens your link"],
                  ["02", "Customer completes payment"],
                  ["03", "Order is recorded and delivery follows"],
                ].map(([number, text]) => (
                  <div key={number}>
                    <span className="text-xs font-black text-[#075a43]/45">{number}</span>
                    <p className="mt-2 font-extrabold leading-6">{text}</p>
                  </div>
                ))}
              </div>
              <p className="mt-7 border-t border-[#075a43]/10 pt-5 text-sm leading-6 text-[#075a43]/55">
                Payment availability and delivery depend on the product and checkout options enabled on UZALINK.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbf8]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#075a43]">Why UZALINK?</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Why Use UZALINK?</h2>
            <p className="mt-5 text-base leading-7 text-[#075a43]/65">
              Start with a simple sales page instead of building a full online store. UZALINK is designed around shareable links, a straightforward buyer flow, digital delivery and Kenyan payment needs.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [Zap, "Shareable Magic Links", "Turn your offer into one link that is easy to post and share."],
              [Smartphone, "Mobile-first experience", "Make it easy for customers to discover and buy from their phones."],
              [WalletCards, "Seller earnings visibility", "Track sales, commission and your seller balance from your dashboard."],
              [ShieldCheck, "Secure checkout flow", "Use the available authentication, payment confirmation and delivery controls."],
            ].map(([Icon, title, text]) => (
              <div key={title as string} className="rounded-3xl border border-[#075a43]/10 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f5ef] text-[#075a43]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-black">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-[#075a43]/60">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#075a43]">Answers for buyers and sellers</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
          </div>

          <div className="mt-10 divide-y divide-[#075a43]/10 rounded-3xl border border-[#075a43]/10 bg-[#f7fbf8]">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question} className="px-5 sm:px-7">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-5 py-5 text-left"
                  >
                    <span className="font-extrabold">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <p className="pb-5 pr-8 text-sm leading-6 text-[#075a43]/62">{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#064d3b] to-[#075a43] text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f7d21f]">Start selling today</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Start Selling Today</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
            Create your first product or service, get your UZALINK page and share it with customers. Start simple and grow your online sales from one link.
          </p>
          <Link
            to="/sell"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#f7d21f] px-7 py-4 font-extrabold text-[#073f31] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Sell Today <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

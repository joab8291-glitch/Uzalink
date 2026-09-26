import { Header, MobileCtaBar } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { Container, btnClass } from "@/components/ui";
import { Link, useRoute } from "@/lib/router";

import { Home } from "@/pages/Home";
import { Explore } from "@/pages/Explore";
import { SellToday } from "@/pages/SellToday";
import { MagicProduct } from "@/pages/MagicProduct";
import { LiveCheckout } from "@/pages/LiveCheckout";
import { HowItWorks } from "@/pages/HowItWorks";
import { About } from "@/pages/About";
import { SellerLogin } from "@/pages/SellerLogin";
import { Dashboard } from "@/pages/Dashboard";
import { AdminDashboard } from "@/pages/AdminDashboard";

function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-mint/50 pt-28">
      <Container className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl gold-gradient text-deep"><Icon name="book" className="h-8 w-8" /></span>
        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-forest/50">UzaLink Books</p>
        <h1 className="mt-3 text-[34px] leading-tight text-deep sm:text-[44px]">This book link took a wrong turn</h1>
        <p className="mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-forest/75">The book or page you are looking for could not be found. Explore available books or publish your own digital book on UzaLink.</p>
        <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2">
          <Link to="/explore" className={btnClass("deep", "lg")}>Explore Books<Icon name="compass" className="h-5 w-5" /></Link>
          <Link to="/sell" className={btnClass("gold", "lg")}>Sell Your Book<Icon name="arrowRight" className="h-5 w-5" /></Link>
        </div>
      </Container>
    </section>
  );
}

function renderRoute(route: string) {
  const path = route.split("?")[0].replace(/\/+$/, "") || "/";
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return <Home />;

  switch (parts[0]) {
    case "explore": return <Explore />;
    case "sell": return <SellToday />;
    case "how-it-works": return <HowItWorks />;
    case "about": return <About />;
    case "seller-login": return <SellerLogin />;
    case "dashboard": return <Dashboard />;
    case "admin": return <AdminDashboard />;
    case "magic":
      if (parts[1] && parts[2] === "checkout") return <LiveCheckout code={parts[1]} />;
      if (parts[1]) return <MagicProduct code={parts[1]} />;
      return <NotFound />;
    default: return <NotFound />;
  }
}

export function App() {
  const route = useRoute();
  const bare = route.startsWith("/dashboard") || route.startsWith("/seller-login") || route.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">{renderRoute(route)}</main>
      {!bare && <Footer />}
      <MobileCtaBar />
    </div>
  );
}

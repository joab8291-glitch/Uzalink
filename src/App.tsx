import { Header, MobileCtaBar } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { Container, btnClass } from "@/components/ui";
import { Link, useRoute } from "@/lib/router";
import { Home } from "@/pages/Home";
import { Explore } from "@/pages/Explore";
import { SellToday } from "@/pages/SellToday";
import { SellerLogin } from "@/pages/SellerLogin";
import { PremiumMagicLogin } from "@/pages/PremiumMagicLogin";
import { PremiumDashboard } from "@/pages/PremiumDashboard";
import { MagicProduct } from "@/pages/MagicProduct";
import { LiveCheckout } from "@/pages/LiveCheckout";
import { HowItWorks } from "@/pages/HowItWorks";
import { About } from "@/pages/About";
import { Dashboard } from "@/pages/Dashboard";
import { AdminConsole } from "@/pages/AdminConsole";
import { Wishlist } from "@/pages/Wishlist";
import { Messages } from "@/pages/Messages";

function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-mint/50 pt-28">
      <Container className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl gold-gradient text-deep">
          <Icon name="search" className="h-8 w-8" />
        </span>
        <h1 className="mt-3 text-[34px] text-deep">
          This page took a wrong turn
        </h1>
        <p className="mx-auto mt-4 max-w-md text-forest/75">
          The page or offer you are looking for could not be found.
        </p>
        <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2">
          <Link to="/explore" className={btnClass("deep", "lg")}>
            Explore Marketplace
          </Link>
          <Link to="/sell" className={btnClass("gold", "lg")}>
            Sell Today
          </Link>
        </div>
      </Container>
    </section>
  );
}

function renderRoute(route: string) {
  const path =
    route.split("?")[0].replace(/\/+$/, "") || "/";
  const parts = path.split("/").filter(Boolean);

  if (!parts.length) return <Home />;

  switch (parts[0]) {
    case "explore":
      return <Explore />;
    case "sell":
      return <SellToday />;
    case "seller-login":
      return <SellerLogin />;
    case "premium-login":
      return <PremiumMagicLogin />;
    case "premium-dashboard":
      return <PremiumDashboard />;
    case "how-it-works":
      return <HowItWorks />;
    case "about":
      return <About />;
    case "dashboard":
      return <Dashboard />;
    case "admin":
      return <AdminConsole />;
    case "wishlist":
      return <Wishlist />;
    case "messages":
      return <Messages />;
    case "ref":
      return <Wishlist />;
    case "magic":
      if (parts[1] && parts[2] === "checkout") {
        return <LiveCheckout code={parts[1]} />;
      }
      if (parts[1]) {
        return <MagicProduct code={parts[1]} />;
      }
      return <NotFound />;
    default:
      return <NotFound />;
  }
}

export function App() {
  const route = useRoute();
  const bare =
    route.startsWith("/dashboard") ||
    route.startsWith("/admin");
  const isHome =
    route.split("?")[0].replace(/\/+$/, "") === "";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {!isHome && <Header />}
      <main className="flex-1">{renderRoute(route)}</main>
      {!bare && <Footer />}
      {!isHome && <MobileCtaBar />}
    </div>
  );
}

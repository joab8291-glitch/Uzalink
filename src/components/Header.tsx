import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { Link, useRoute } from "@/lib/router";
import { Icon } from "./Icon";
import { BrandLogo } from "./BrandLogo";
import { Container, btnClass } from "./ui";
import { useAuth } from "@/lib/auth";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Explore Marketplace", to: "/explore" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "About UZALINK", to: "/about" },
  { label: "Wishlist", to: "/wishlist" },
];

export function Header() {
  const route = useRoute();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [route]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (to: string) =>
    to === "/" ? route === "/" : route.startsWith(to);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-forest/10 bg-white/95 py-2 shadow-sm backdrop-blur-xl"
            : "border-b border-transparent bg-white/95 py-3 shadow-sm backdrop-blur-xl"
        )}
      >
        <Container className="flex items-center justify-between gap-3">
          <Link
            to="/"
            aria-label="UZALINK home"
            className="shrink-0 rounded-lg"
          >
            <BrandLogo className="w-[145px] sm:w-[165px]" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative rounded-xl px-4 py-2.5 text-[14.5px] font-bold transition-colors",
                  isActive(item.to)
                    ? "text-brand"
                    : "text-forest/80 hover:bg-mint hover:text-deep"
                )}
              >
                {item.label}
                {isActive(item.to) && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-[3px] rounded-full gold-gradient" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/premium-login"
              className="hidden rounded-xl px-3 py-2 text-[13px] font-extrabold text-brand transition-colors hover:bg-mint sm:inline-flex"
            >
              Premium Magic Login
            </Link>

            {user?.role === "SELLER" && user.premium ? (
              <Link
                to="/dashboard"
                className="hidden text-[14px] font-bold text-forest/75 transition-colors hover:text-brand xl:block"
              >
                Premium Dashboard
              </Link>
            ) : null}

            <Link
              to="/sell"
              className={btnClass(
                "gold",
                "md",
                "hidden sm:inline-flex h-11! px-5! text-[14.5px]!"
              )}
            >
              Sell Today
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-colors lg:hidden",
                open
                  ? "border-deep bg-deep text-white"
                  : "border-forest/15 bg-white text-deep"
              )}
            >
              <Icon
                name={open ? "x" : "menu"}
                className="h-5.5 w-5.5"
                strokeWidth={2.2}
              />
            </button>
          </div>
        </Container>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open
            ? "pointer-events-auto"
            : "pointer-events-none"
        )}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-deep/50 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          className={cn(
            "absolute inset-x-0 top-[72px] mx-3 overflow-hidden rounded-3xl border border-forest/10 bg-white p-3 shadow-2xl transition-all duration-300",
            open
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          )}
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-4 text-[16px] font-bold transition-colors",
                isActive(item.to)
                  ? "bg-mint text-brand"
                  : "text-deep hover:bg-mint/60"
              )}
            >
              {item.label}
              <Icon
                name="chevronRight"
                className="h-4 w-4 opacity-40"
              />
            </Link>
          ))}

          <div className="mt-2 grid gap-2 border-t border-forest/10 pt-3">
            <Link
              to="/premium-login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-mint px-4 py-3 font-extrabold text-brand"
            >
              <Icon name="key" className="h-4 w-4" />
              Premium Magic Login
            </Link>

            <Link
              to="/sell"
              onClick={() => setOpen(false)}
              className={btnClass("gold", "lg")}
            >
              Sell Today
              <Icon name="arrowRight" className="h-5 w-5" />
            </Link>

            <Link
              to="/explore"
              onClick={() => setOpen(false)}
              className={btnClass("outline", "lg")}
            >
              Explore Marketplace
              <Icon name="compass" className="h-5 w-5" />
            </Link>

            {user?.role === "SELLER" && user.premium ? (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 py-3 text-[14px] font-bold text-forest/70"
              >
                <Icon name="grid" className="h-4 w-4" />
                Premium Dashboard
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export function MobileCtaBar() {
  const route = useRoute();

  if (
    route.startsWith("/dashboard") ||
    route.startsWith("/admin") ||
    route.startsWith("/magic") ||
    route.startsWith("/premium-login")
  ) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-forest/10 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden">
      <div className="grid grid-cols-[1fr_1.1fr] gap-2">
        <Link
          to="/premium-login"
          className={btnClass(
            "outline",
            "md",
            "h-12! text-[13px]!"
          )}
        >
          <Icon name="key" className="h-4 w-4" />
          Premium
        </Link>

        <Link
          to="/sell"
          className={btnClass(
            "gold",
            "md",
            "h-12! text-[13.5px]!"
          )}
        >
          Sell Today
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

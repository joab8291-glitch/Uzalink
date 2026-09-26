import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { Link, useRoute } from "@/lib/router";
import { Icon, Logo } from "./Icon";
import { Container, btnClass } from "./ui";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Explore Books", to: "/explore" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "About UZALINK", to: "/about" },
];

export function Header() {
  const route = useRoute();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [route]);

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
            ? "border-b border-forest/10 bg-white/85 py-2 shadow-[0_10px_30px_-24px_rgba(4,40,26,0.55)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-3",
        )}
      >
        <Container className="flex items-center justify-between gap-3">
          <Link to="/" aria-label="UZALINK home" className="shrink-0">
            <Logo />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative rounded-xl px-4 py-2.5 text-[14.5px] font-bold transition-colors",
                  isActive(item.to)
                    ? "text-brand"
                    : "text-forest/80 hover:bg-mint hover:text-deep",
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
            {/* Author login */}
            <Link
              to="/seller-login"
              className="hidden text-[14px] font-bold text-forest/75 transition-colors hover:text-brand xl:block"
            >
              Author Login
            </Link>

            {/* Main CTA */}
            <Link
              to="/sell"
              className={btnClass(
                "gold",
                "md",
                "hidden sm:inline-flex h-11! px-5! text-[14.5px]!",
              )}
            >
              Sell Your Book
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-colors lg:hidden",
                open
                  ? "border-deep bg-deep text-white"
                  : "border-forest/15 bg-white/70 text-deep",
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

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open
            ? "pointer-events-auto"
            : "pointer-events-none",
        )}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-deep/50 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          className={cn(
            "absolute inset-x-0 top-[64px] mx-3 overflow-hidden rounded-3xl border border-forest/10 bg-white p-3 shadow-2xl transition-all duration-300",
            open
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0",
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
                  : "text-deep hover:bg-mint/60",
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
              to="/sell"
              onClick={() => setOpen(false)}
              className={btnClass("gold", "lg")}
            >
              Sell Your Book
              <Icon name="arrowRight" className="h-5 w-5" />
            </Link>

            <Link
              to="/explore"
              onClick={() => setOpen(false)}
              className={btnClass("outline", "lg")}
            >
              Explore Books
              <Icon name="compass" className="h-5 w-5" />
            </Link>

            <Link
              to="/seller-login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 py-3 text-[14px] font-bold text-forest/70"
            >
              <Icon name="key" className="h-4 w-4" />
              Author Login
            </Link>
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
    route.startsWith("/magic")
  ) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-forest/10 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden">
      <div className="grid grid-cols-[1fr_1.1fr] gap-2">
        <Link
          to="/explore"
          className={btnClass(
            "outline",
            "md",
            "h-12! text-[13.5px]!",
          )}
        >
          <Icon name="compass" className="h-4 w-4" />
          Explore Books
        </Link>

        <Link
          to="/sell"
          className={btnClass(
            "gold",
            "md",
            "h-12! text-[13.5px]!",
          )}
        >
          Sell Your Book
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

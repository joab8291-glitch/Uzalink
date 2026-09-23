import { useEffect, useState } from "react";

function readHash(): string {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

export function navigate(path: string, opts?: { keepScroll?: boolean }) {
  const target = path.startsWith("/") ? path : `/${path}`;
  if (readHash() === target) {
    if (!opts?.keepScroll) window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.location.hash = target;
}

export function useRoute() {
  const [route, setRoute] = useState<string>(() =>
    typeof window === "undefined" ? "/" : readHash(),
  );

  useEffect(() => {
    const onChange = () => {
      setRoute(readHash());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export function Link({
  to,
  children,
  className,
  onClick,
  ...rest
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

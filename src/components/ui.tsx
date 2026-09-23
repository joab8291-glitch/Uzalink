import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";

/* ------------------------------------------------------------------ */
/* Buttons                                                            */
/* ------------------------------------------------------------------ */

type Variant = "gold" | "deep" | "outline" | "ghost" | "white" | "mint";
type Size = "sm" | "md" | "lg" | "xl";

const VARIANTS: Record<Variant, string> = {
  gold: "gold-gradient text-deep shadow-[0_10px_30px_-10px_rgba(255,200,0,0.7)] hover:brightness-105",
  deep: "bg-deep text-white hover:bg-deep2 shadow-[0_12px_30px_-14px_rgba(4,40,26,0.9)]",
  outline:
    "border-2 border-deep/15 bg-white text-deep hover:border-deep/35 hover:bg-mint/50",
  ghost: "text-deep hover:bg-mint",
  white: "bg-white text-deep shadow-lg shadow-black/10 hover:bg-mint",
  mint: "bg-mint text-forest hover:bg-lime",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-4 text-[13px] gap-1.5 rounded-xl",
  md: "h-12 px-5 text-[15px] gap-2 rounded-2xl",
  lg: "h-14 px-7 text-base gap-2 rounded-2xl",
  xl: "h-16 px-8 text-[17px] gap-2.5 rounded-[22px]",
};

export function btnClass(variant: Variant = "gold", size: Size = "md", extra?: string) {
  return cn(
    "inline-flex select-none items-center justify-center font-bold transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/40 disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    extra,
  );
}

export function Button({
  variant = "gold",
  size = "md",
  className,
  children,
  icon,
  iconLeft,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconLeft?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={btnClass(variant, size, className)} {...rest}>
      {iconLeft && <Icon name={iconLeft} className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />}
      {children}
      {icon && <Icon name={icon} className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Surfaces                                                           */
/* ------------------------------------------------------------------ */

export function Card({
  className,
  children,
  hover = false,
}: {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_18px_45px_-30px_rgba(4,40,26,0.35)]",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_28px_60px_-30px_rgba(4,40,26,0.4)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "mint",
  className,
  icon,
}: {
  children: React.ReactNode;
  tone?: "mint" | "gold" | "deep" | "white" | "card" | "danger";
  className?: string;
  icon?: string;
}) {
  const tones = {
    mint: "bg-mint text-forest border-forest/10",
    gold: "bg-goldsoft text-[#8a6300] border-gold/40",
    deep: "bg-deep text-white border-white/10",
    white: "bg-white/10 text-white border-white/20",
    card: "bg-white text-forest border-forest/12",
    danger: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-white/90 backdrop-blur",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Layout helpers                                                     */
/* ------------------------------------------------------------------ */

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Eyebrow({
  children,
  tone = "dark",
  icon,
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
  icon?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.16em]",
        tone === "light"
          ? "bg-white/10 text-gold ring-1 ring-white/15"
          : "bg-mint text-forest ring-1 ring-forest/10",
      )}
    >
      {icon && <Icon name={icon} className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  tone = "dark",
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  tone?: "dark" | "light";
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "max-w-3xl text-[30px] leading-[1.08] sm:text-[40px] lg:text-[46px]",
          tone === "light" ? "text-white" : "text-deep",
        )}
      >
        {title}
      </h2>
      {text && (
        <p
          className={cn(
            "max-w-2xl text-[15.5px] leading-relaxed sm:text-[17px]",
            tone === "light" ? "text-white/70" : "text-forest/75",
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal on scroll                                                   */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out", className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form controls                                                      */
/* ------------------------------------------------------------------ */

export const inputClass =
  "w-full rounded-2xl border-2 border-forest/12 bg-white px-4 py-3.5 text-[15.5px] font-medium text-ink outline-none transition-all placeholder:text-forest/35 focus:border-brand focus:ring-4 focus:ring-brand/12";

export function Field({
  label,
  hint,
  required,
  children,
  error,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="flex items-center gap-1.5 text-[13.5px] font-bold text-deep">
        {label}
        {required && <span className="text-brand">*</span>}
      </span>
      {children}
      {hint && !error && <span className="text-[12.5px] leading-snug text-forest/60">{hint}</span>}
      {error && (
        <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-red-600">
          <Icon name="alert" className="h-3.5 w-3.5" />
          {error}
        </span>
      )}
    </label>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-forest/10", className)} />;
}

/* ------------------------------------------------------------------ */
/* Misc                                                               */
/* ------------------------------------------------------------------ */

export function Avatar({ seed, className }: { seed: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full gold-gradient text-[13px] font-extrabold text-deep",
        className,
      )}
    >
      {seed}
    </span>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-deep/6 px-1.5 py-0.5 font-mono text-[12.5px] text-forest">
      {children}
    </code>
  );
}

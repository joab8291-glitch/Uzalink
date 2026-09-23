import { useState } from "react";
import { COMMISSION, SETTLEMENT_NOTE, commissionOf, formatKsh, sellerOf } from "@/lib/data";
import { Icon } from "./Icon";
import { cn } from "@/utils/cn";

export function CommissionCalculator({ className }: { className?: string }) {
  const [price, setPrice] = useState(COMMISSION.example);

  const rows = [
    { label: "Product price", value: price, strong: false },
    { label: "UZALINK commission (5%)", value: commissionOf(price), strong: false, minus: true },
    { label: "Seller balance (95%)", value: sellerOf(price), strong: true },
  ];

  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_20px_50px_-32px_rgba(4,40,26,0.45)] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-forest/55">
            Try the maths
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-[12px] font-extrabold text-forest">
            <Icon name="bolt" className="h-3.5 w-3.5 text-brand" strokeWidth={0} />
            Live
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-end justify-between">
            <label htmlFor="uzl-price" className="text-[14px] font-bold text-deep">
              Product price
            </label>
            <span className="text-[26px] font-extrabold leading-none text-deep">
              {formatKsh(price)}
            </span>
          </div>
          <input
            id="uzl-price"
            type="range"
            min={100}
            max={50000}
            step={100}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-4 h-2.5 w-full cursor-pointer appearance-none rounded-full bg-mint accent-[#0e8c46]"
            style={{
              backgroundImage: `linear-gradient(90deg, #0e8c46 0%, #ffc800 ${((price - 100) / 499) * 100}%, #cdeeda ${((price - 100) / 499) * 100}%)`,
            }}
          />
          <div className="mt-2 flex justify-between text-[11.5px] font-semibold text-forest/50">
            <span>KSh 100</span>
            <span>KSh 50,000</span>
          </div>
        </div>

        <div className="mt-6 space-y-2.5">
          {rows.map((r) => (
            <div
              key={r.label}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3.5",
                r.strong ? "brand-gradient text-white" : "bg-mint/70 text-forest",
              )}
            >
              <span
                className={cn(
                  "text-[13.5px] font-bold",
                  r.strong ? "text-white/85" : "text-forest/75",
                )}
              >
                {r.minus && "− "}
                {r.label}
              </span>
              <span
                className={cn(
                  "text-[17px] font-extrabold",
                  r.strong ? "text-gold" : "text-deep",
                )}
              >
                {formatKsh(r.value)}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 flex gap-2.5 rounded-2xl bg-goldsoft/70 p-3.5 text-[12.5px] leading-relaxed text-[#7a5a00]">
          <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{SETTLEMENT_NOTE}</span>
        </p>
      </div>
    </div>
  );
}

export function CommissionBanner() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { label: "Product price", value: COMMISSION.example, tone: "bg-white text-deep" },
        {
          label: "UZALINK commission",
          value: commissionOf(COMMISSION.example),
          tone: "bg-deep text-white",
        },
        {
          label: "Seller balance",
          value: sellerOf(COMMISSION.example),
          tone: "gold-gradient text-deep",
        },
      ].map((item, i) => (
        <div
          key={item.label}
          className={cn(
            "relative overflow-hidden rounded-3xl p-5 shadow-[0_20px_45px_-30px_rgba(4,40,26,0.5)]",
            item.tone,
          )}
        >
          <span className="absolute right-4 top-4 text-[11px] font-extrabold uppercase tracking-[0.14em] opacity-50">
            0{i + 1}
          </span>
          <p className="text-[13px] font-bold uppercase tracking-wide opacity-70">{item.label}</p>
          <p className="mt-3 text-[32px] font-extrabold leading-none">{formatKsh(item.value)}</p>
        </div>
      ))}
    </div>
  );
}

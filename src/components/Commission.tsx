import { useState } from "react";
import {
  COMMISSION,
  SETTLEMENT_NOTE,
  commissionOf,
  formatKsh,
} from "@/lib/data";
import { Icon } from "./Icon";
import { cn } from "@/utils/cn";

const EXAMPLE_PRICE = 1000;

function authorEarnings(price: number) {
  return Math.max(0, price - commissionOf(price));
}

export function CommissionCalculator({
  className,
}: {
  className?: string;
}) {
  const [price, setPrice] = useState(EXAMPLE_PRICE);

  const commission = commissionOf(price);
  const earnings = authorEarnings(price);

  const rows = [
    {
      label: "Book price",
      value: price,
      strong: false,
    },
    {
      label: "UZALINK commission (5%)",
      value: commission,
      strong: false,
      minus: true,
    },
    {
      label: "Author earnings (95%)",
      value: earnings,
      strong: true,
    },
  ];

  const progress = ((price - 100) / (50000 - 100)) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_20px_50px_-32px_rgba(4,40,26,0.45)] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-forest/55">
            See your book earnings
          </p>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-[12px] font-extrabold text-forest">
            <Icon
              name="bolt"
              className="h-3.5 w-3.5 text-brand"
              strokeWidth={0}
            />
            Live
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-end justify-between gap-4">
            <label
              htmlFor="uzl-price"
              className="text-[14px] font-bold text-deep"
            >
              Book price
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
              backgroundImage: `linear-gradient(
                90deg,
                #0e8c46 0%,
                #ffc800 ${progress}%,
                #cdeeda ${progress}%
              )`,
            }}
          />

          <div className="mt-2 flex justify-between text-[11.5px] font-semibold text-forest/50">
            <span>KSh 100</span>
            <span>KSh 50,000</span>
          </div>
        </div>

        <div className="mt-6 space-y-2.5">
          {rows.map((row) => (
            <div
              key={row.label}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3.5",
                row.strong
                  ? "brand-gradient text-white"
                  : "bg-mint/70 text-forest",
              )}
            >
              <span
                className={cn(
                  "text-[13.5px] font-bold",
                  row.strong
                    ? "text-white/85"
                    : "text-forest/75",
                )}
              >
                {row.minus && "− "}
                {row.label}
              </span>

              <span
                className={cn(
                  "text-[17px] font-extrabold",
                  row.strong ? "text-gold" : "text-deep",
                )}
              >
                {formatKsh(row.value)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-goldsoft/70 p-4">
          <div className="flex gap-2.5">
            <Icon
              name="clock"
              className="mt-0.5 h-4 w-4 shrink-0 text-[#7a5a00]"
            />

            <div>
              <p className="text-[12.5px] font-extrabold text-[#7a5a00]">
                Your author share
              </p>

              <p className="mt-1 text-[12.5px] leading-relaxed text-[#7a5a00]">
                {SETTLEMENT_NOTE}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CommissionBanner() {
  const price = EXAMPLE_PRICE;
  const commission = commissionOf(price);
  const earnings = authorEarnings(price);

  const items = [
    {
      label: "Book price",
      value: price,
      tone: "bg-white text-deep",
    },
    {
      label: "UZALINK commission",
      value: commission,
      tone: "bg-deep text-white",
    },
    {
      label: "Author earnings",
      value: earnings,
      tone: "gold-gradient text-deep",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            "relative overflow-hidden rounded-3xl p-5 shadow-[0_20px_45px_-30px_rgba(4,40,26,0.5)]",
            item.tone,
          )}
        >
          <span className="absolute right-4 top-4 text-[11px] font-extrabold uppercase tracking-[0.14em] opacity-50">
            0{index + 1}
          </span>

          <p className="text-[13px] font-bold uppercase tracking-wide opacity-70">
            {item.label}
          </p>

          <p className="mt-3 text-[32px] font-extrabold leading-none">
            {formatKsh(item.value)}
          </p>
        </div>
      ))}
    </div>
  );
}

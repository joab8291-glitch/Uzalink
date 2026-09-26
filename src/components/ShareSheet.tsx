```tsx
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";
import { btnClass, Divider } from "./ui";

export function useCopy() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();

      try {
        document.execCommand("copy");
      } catch {
        /* noop */
      }

      document.body.removeChild(ta);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return { copied, copy };
}

export function CopyField({
  value,
  className,
  label = "Your unique UZALINK book link",
}: {
  value: string;
  className?: string;
  label?: string;
}) {
  const { copied, copy } = useCopy();

  return (
    <div className={cn("", className)}>
      <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.14em] text-forest/55">
        {label}
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl border-2 border-forest/12 bg-mint/70 px-4 py-3">
          <Icon name="link" className="h-4.5 w-4.5 shrink-0 text-brand" />

          <span className="truncate font-mono text-[14px] font-semibold text-deep">
            {value}
          </span>
        </div>

        <button
          onClick={() => copy(`https://${value}`)}
          className={btnClass(
            copied ? "deep" : "gold",
            "md",
            "h-[52px]! shrink-0",
          )}
        >
          <Icon name={copied ? "check" : "copy"} className="h-4.5 w-4.5" />
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}

export function QrCode({
  value,
  size = 190,
}: {
  value: string;
  size?: number;
}) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${
    size * 2
  }x${size * 2}&margin=6&color=04281a&bgcolor=ffffff&data=${encodeURIComponent(
    `https://${value}`,
  )}`;

  return (
    <div className="inline-flex flex-col items-center gap-3 rounded-3xl border-2 border-forest/10 bg-white p-4 shadow-[0_18px_40px_-28px_rgba(4,40,26,0.5)]">
      <img
        src={src}
        alt="UZALINK book link QR code"
        width={size}
        height={size}
        className="rounded-xl"
        style={{ width: size, height: size }}
      />

      <p className="text-[12px] font-bold uppercase tracking-wide text-forest/60">
        Scan to open book
      </p>
    </div>
  );
}

const CHANNELS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: "whatsapp",
    bg: "bg-[#25D366]",
    href: (text: string, url: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
    copy: false,
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: "facebook",
    bg: "bg-[#1877F2]",
    href: (_text: string, url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url,
      )}`,
    copy: false,
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: "tiktok",
    bg: "bg-deep",
    href: () => "https://www.tiktok.com/upload",
    copy: true,
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: "instagram",
    bg: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    href: () => "https://www.instagram.com/",
    copy: true,
  },
  {
    key: "sms",
    label: "SMS",
    icon: "sms",
    bg: "bg-brand",
    href: (text: string, url: string) =>
      `sms:?&body=${encodeURIComponent(`${text} ${url}`)}`,
    copy: false,
  },
];

export function ShareChannels({
  link,
  message,
  compact = false,
}: {
  link: string;
  message: string;
  compact?: boolean;
}) {
  const { copied, copy } = useCopy();
  const url = `https://${link}`;

  return (
    <div
      className={cn(
        "grid gap-2.5",
        compact ? "grid-cols-4" : "grid-cols-3 sm:grid-cols-4",
      )}
    >
      {CHANNELS.map((channel) => (
        <a
          key={channel.key}
          href={channel.href(message, url)}
          target="_blank"
          rel="noreferrer"
          onClick={() => channel.copy && copy(url)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-2xl border border-forest/10 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg",
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center rounded-2xl text-white",
              channel.bg,
              compact ? "h-10 w-10" : "h-11 w-11",
            )}
          >
            <Icon
              name={channel.icon}
              className={compact ? "h-5 w-5" : "h-5.5 w-5.5"}
            />
          </span>

          <span className="text-[11.5px] font-bold text-deep">
            {channel.label}
          </span>
        </a>
      ))}

      <button
        onClick={() => copy(url)}
        className="flex flex-col items-center gap-2 rounded-2xl border border-forest/10 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg"
      >
        <span
          className={cn(
            "flex items-center justify-center rounded-2xl bg-forest text-white",
            compact ? "h-10 w-10" : "h-11 w-11",
          )}
        >
          <Icon
            name={copied ? "check" : "copy"}
            className={compact ? "h-5 w-5" : "h-5.5 w-5.5"}
          />
        </span>

        <span className="text-[11.5px] font-bold text-deep">
          {copied ? "Copied" : "Copy Link"}
        </span>
      </button>

      {"share" in navigator && (
        <button
          onClick={() =>
            navigator
              .share({
                title: "UZALINK",
                text: message,
                url,
              })
              .catch(() => undefined)
          }
          className="flex flex-col items-center gap-2 rounded-2xl border border-forest/10 bg-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg"
        >
          <span
            className={cn(
              "flex items-center justify-center rounded-2xl gold-gradient text-deep",
              compact ? "h-10 w-10" : "h-11 w-11",
            )}
          >
            <Icon
              name="share"
              className={compact ? "h-5 w-5" : "h-5.5 w-5.5"}
            />
          </span>

          <span className="text-[11.5px] font-bold text-deep">
            More
          </span>
        </button>
      )}
    </div>
  );
}

export function ShareSheet({
  open,
  onClose,
  link,
  message,
}: {
  open: boolean;
  onClose: () => void;
  link: string;
  message: string;
}) {
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-deep/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl animate-sheet sm:max-w-lg sm:rounded-[28px] sm:p-7">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-forest/15 sm:hidden" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[22px] leading-tight text-deep">
              Share your Book Link
            </h3>

            <p className="mt-1.5 text-[14px] text-forest/70">
              Share your book anywhere. Readers open the link, pay with
              M-Pesa, and access the book — no account needed.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-forest/12 text-forest/60 hover:bg-mint"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5">
          <CopyField value={link} />
        </div>

        <div className="mt-6">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-forest/55">
            Share via
          </p>

          <ShareChannels
            link={link}
            message={message}
          />
        </div>

        <Divider className="my-6" />

        <button
          onClick={() => setShowQr((value) => !value)}
          className="flex w-full items-center justify-between rounded-2xl border-2 border-forest/10 bg-mint/50 px-4 py-3.5 text-left transition-colors hover:bg-mint"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep text-white">
              <Icon name="qr" className="h-5 w-5" />
            </span>

            <span>
              <span className="block text-[15px] font-extrabold text-deep">
                QR Code
              </span>

              <span className="block text-[12.5px] text-forest/65">
                Perfect for posters, stickers & book displays
              </span>
            </span>
          </span>

          <Icon
            name={showQr ? "chevronUp" : "chevronDown"}
            className="h-5 w-5 text-forest/50"
          />
        </button>

        {showQr && (
          <div className="mt-5 flex justify-center animate-pop">
            <QrCode value={link} />
          </div>
        )}

        <button
          onClick={onClose}
          className={btnClass("gold", "lg", "mt-6 w-full")}
        >
          Share Book Link
          <Icon name="arrowRight" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
```

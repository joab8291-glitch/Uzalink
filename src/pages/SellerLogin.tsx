import { useState } from "react";
import { cn } from "@/utils/cn";
import { SELLER, formatKsh } from "@/lib/data";
import { Link, navigate } from "@/lib/router";
import { Icon, Logo } from "@/components/Icon";
import { Container, Field, btnClass, inputClass } from "@/components/ui";

export function SellerLogin() {
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const accessCode = "417286";

  const send = () => {
    if (value.trim().length < 6) {
      setError(
        mode === "phone" ? "Enter the number on your UZALINK profile." : "Enter a valid email address.",
      );
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <section className="relative min-h-screen overflow-hidden brand-gradient pb-20 pt-28 text-white sm:pt-32">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-70" />
      <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <Container className="relative max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <Logo tone="light" />
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-gold">
              <Icon name="key" className="h-3.5 w-3.5" />
              Seller Magic Login
            </p>
            <h1 className="mt-5 text-[36px] leading-[1.03] sm:text-[50px]">
              Passwordless login for
              <br />
              <span className="text-gold">Premium sellers.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/75">
              Your public selling and buying flows stay completely account-free. This login only
              unlocks seller management: earnings, sales, orders, downloads, analytics, settlements
              and payment settings.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { icon: "wallet", t: formatKsh(SELLER.planPrice) + "/month", d: "Premium plan" },
                { icon: "shield", t: "No password", d: "One-time code or link" },
                { icon: "lock", t: "Locked payouts", d: "Verified settlement number" },
                { icon: "chart", t: "11 sections", d: "Full seller management" },
              ].map((c) => (
                <div key={c.t} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <Icon name={c.icon} className="h-5 w-5 text-gold" />
                  <p className="mt-3 text-[16px] font-extrabold">{c.t}</p>
                  <p className="mt-1 text-[12.5px] text-white/60">{c.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/12 bg-white p-6 text-ink shadow-2xl sm:p-8">
            {!sent ? (
              <>
                <h2 className="text-[24px] leading-tight text-deep">Log in to Premium</h2>
                <p className="mt-2 text-[14px] text-forest/70">
                  We send you a one-time code — there is no password to remember.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-mint p-1.5">
                  {(["phone", "email"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMode(m);
                        setError("");
                      }}
                      className={cn(
                        "rounded-xl py-2.5 text-[13.5px] font-extrabold capitalize transition-all",
                        mode === m ? "bg-deep text-white shadow" : "text-forest/70",
                      )}
                    >
                      {m === "phone" ? "Phone number" : "Email"}
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <Field
                    label={mode === "phone" ? "Phone number" : "Email address"}
                    error={error}
                  >
                    {mode === "phone" ? (
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14.5px] font-bold text-forest/45">
                          +254
                        </span>
                        <input
                          value={value}
                          inputMode="numeric"
                          onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="0712 345 678"
                          className={cn(inputClass, "pl-[68px] text-[17px] font-extrabold tracking-wide")}
                        />
                      </div>
                    ) : (
                      <input
                        type="email"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="you@store.co.ke"
                        className={inputClass}
                      />
                    )}
                  </Field>
                </div>

                <button onClick={send} className={btnClass("gold", "lg", "mt-5 w-full")}>
                  Send login code
                  <Icon name="arrowRight" className="h-5 w-5" />
                </button>

                <p className="mt-5 flex items-start gap-2.5 text-[12.5px] leading-relaxed text-forest/65">
                  <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  Don't have Premium yet? You can still sell free from the{" "}
                  <Link to="/sell" className="font-bold text-brand underline">
                    Sell Today
                  </Link>{" "}
                  flow — no account needed.
                </p>
              </>
            ) : (
              <div className="animate-fade-up text-center">
                <span className="mx-auto flex h-16 w-16 animate-pop items-center justify-center rounded-3xl bg-mint text-brand">
                  <Icon name="sms" className="h-8 w-8" />
                </span>
                <h2 className="mt-6 text-[24px] leading-tight text-deep">Check your messages</h2>
                <p className="mt-3 text-[14.5px] leading-relaxed text-forest/70">
                  We sent a one-time login code to{" "}
                  <span className="font-extrabold text-deep">
                    {mode === "phone" ? `+254 ${value}` : value}
                  </span>
                  . It expires in 10 minutes.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-forest/10 bg-mint/60 px-4 py-4">
                  <span className="font-mono text-[26px] font-extrabold tracking-[0.28em] text-brand">
                    {accessCode}
                  </span>
                  <span className="rounded-lg bg-white px-2 py-1 text-[10.5px] font-extrabold uppercase tracking-wide text-forest/60">
                    Demo code
                  </span>
                </div>

                <button
                  onClick={() => navigate("/dashboard")}
                  className={btnClass("gold", "lg", "mt-6 w-full")}
                >
                  Open Premium Dashboard
                  <Icon name="arrowRight" className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setSent(false);
                    setValue("");
                  }}
                  className="mt-4 text-[13.5px] font-bold text-forest/60 hover:text-brand"
                >
                  Use a different number
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

import { useState } from "react";
import {
  Container,
  btnClass,
  inputClass,
} from "@/components/ui";
import {
  Icon,
} from "@/components/Icon";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { navigate } from "@/lib/router";

export function PremiumMagicLogin() {
  const {
    user,
    loading,
    refresh,
  } = useAuth();

  const [identity, setIdentity] =
    useState("");

  const [code, setCode] =
    useState("");

  const [sent, setSent] =
    useState(false);

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  if (
    !loading &&
    user?.role === "SELLER" &&
    user.premium
  ) {
    navigate("/premium-dashboard");
  }

  const requestCode = async () => {
    setError("");
    setMessage("");

    if (!identity.trim()) {
      setError(
        "Enter your phone number or email address."
      );
      return;
    }

    setBusy(true);

    try {
      const result =
        await api.premiumRequest(
          identity.trim()
        );

      setSent(true);

      setMessage(
        result?.message ||
          "SMS verification code sent."
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not send SMS code."
      );
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setError("");
    setMessage("");

    if (!code.trim()) {
      setError(
        "Enter the SMS verification code."
      );
      return;
    }

    setBusy(true);

    try {
      await api.premiumVerify(
        identity.trim(),
        code.trim()
      );

      const refreshed =
        await refresh();

      if (
        refreshed?.role === "SELLER" &&
        refreshed.premium
      ) {
        navigate("/premium-dashboard");
        return;
      }

      navigate("/premium-dashboard");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Invalid verification code."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="brand-gradient min-h-screen pb-20 pt-28 text-white">
      <Container className="max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <BrandLogo />

            <p className="mt-7 text-xs font-extrabold uppercase tracking-[.18em] text-gold">
              UzaLink Premium
            </p>

            <h1 className="mt-4 text-4xl sm:text-5xl">
              Premium Magic Login
            </h1>

            <p className="mt-5 max-w-xl text-white/70">
              Securely access your Premium seller
              dashboard with your phone number or
              email, then verify ownership with an
              SMS code.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                [
                  "95%",
                  "Your seller earnings",
                ],
                [
                  "5%",
                  "UzaLink commission",
                ],
                [
                  "KSh 1,000",
                  "Premium / month",
                ],
                [
                  "M-Pesa",
                  "Seller settlements",
                ],
              ].map(
                ([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-2xl font-black text-gold">
                      {value}
                    </p>

                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/55">
                      {label}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-7 text-ink shadow-2xl">
            {!sent ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-brand">
                  <Icon
                    name="key"
                    className="h-7 w-7"
                  />
                </div>

                <h2 className="mt-5 text-2xl font-extrabold text-deep">
                  Enter your details
                </h2>

                <p className="mt-2 text-sm text-forest/65">
                  Enter your Premium phone number
                  or email.
                </p>

                <label className="mt-6 block text-sm font-bold text-deep">
                  Phone number or email
                </label>

                <input
                  value={identity}
                  onChange={(e) =>
                    setIdentity(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    void requestCode()
                  }
                  placeholder="Phone number or email"
                  className={
                    inputClass + " mt-2"
                  }
                  disabled={busy}
                />

                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void requestCode()
                  }
                  className={btnClass(
                    "gold",
                    "lg",
                    "mt-6 w-full"
                  )}
                >
                  {busy
                    ? "Sending SMS…"
                    : "Send SMS Code"}

                  <Icon
                    name="arrowRight"
                    className="h-5 w-5"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/sell")
                  }
                  className="mt-4 w-full text-sm font-bold text-brand"
                >
                  Back to Sell Today
                </button>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-brand">
                  <Icon
                    name="shield"
                    className="h-7 w-7"
                  />
                </div>

                <h2 className="mt-5 text-2xl font-extrabold text-deep">
                  Enter SMS code
                </h2>

                <p className="mt-2 text-sm text-forest/65">
                  Enter the one-time verification
                  code sent to your phone.
                </p>

                <label className="mt-6 block text-sm font-bold text-deep">
                  SMS verification code
                </label>

                <input
                  value={code}
                  onChange={(e) =>
                    setCode(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    void verify()
                  }
                  placeholder="Enter verification code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  className={
                    inputClass +
                    " mt-2 text-center text-2xl tracking-[.35em]"
                  }
                  disabled={busy}
                />

                {message && (
                  <div className="mt-4 rounded-xl bg-mint p-3 text-sm font-semibold text-brand">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void verify()
                  }
                  className={btnClass(
                    "gold",
                    "lg",
                    "mt-6 w-full"
                  )}
                >
                  {busy
                    ? "Verifying…"
                    : "Verify & Open Premium Dashboard"}
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setSent(false);
                    setCode("");
                    setError("");
                    setMessage("");
                  }}
                  className="mt-4 w-full text-sm font-bold text-brand"
                >
                  Use another number or email
                </button>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

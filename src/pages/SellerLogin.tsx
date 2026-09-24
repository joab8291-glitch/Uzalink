import { useEffect, useState } from "react";
import { Container, btnClass, inputClass } from "@/components/ui";
import { Logo, Icon } from "@/components/Icon";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { navigate } from "@/lib/router";

export function SellerLogin() {
  const { user, refresh } = useAuth();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(
      location.hash.split("?")[1] || ""
    );

    const token = query.get("token");

    if (!token) return;

    void (async () => {
      try {
        await api.verifyMagic(token);
        await refresh();
        navigate("/dashboard");
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Login link is invalid or expired."
        );
      }
    })();
  }, [refresh]);

  if (user) {
    return (
      <section className="min-h-screen bg-mint/50 pt-32">
        <Container className="max-w-lg">
          <div className="rounded-3xl bg-white p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-brand">
              <Icon name="checkCircle" className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-3xl text-deep">
              Welcome back
            </h1>

            <p className="mt-3 text-forest/65">
              Your seller account is ready. Premium is optional.
            </p>

            <button
              className={btnClass("gold", "lg", "mt-6 w-full")}
              onClick={() =>
                navigate(
                  user.role === "ADMIN"
                    ? "/admin"
                    : "/dashboard"
                )
              }
            >
              Open Seller Dashboard
            </button>
          </div>
        </Container>
      </section>
    );
  }

  const send = async () => {
    setError("");

    if (!email && !phone) {
      setError(
        "Enter your email or phone number."
      );
      return;
    }

    setBusy(true);

    try {
      const result = await api.requestMagic({
        email: email || undefined,
        phone: phone || undefined,
        intent: "seller",
      });

      setSent(true);

      if (result.devLink) {
        console.info(
          "Development magic link:",
          result.devLink
        );
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not send login link."
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
            <Logo tone="light" />

            <p className="mt-6 text-xs font-extrabold uppercase tracking-[.16em] text-gold">
              Free seller access
            </p>

            <h1 className="mt-4 text-4xl sm:text-5xl">
              Start selling.
              <br />
              <span className="text-gold">
                No Premium required.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-white/70">
              Create your free seller account with a
              one-time Magic Link. List products, sell
              through M-Pesa and receive 95% of every
              successful sale.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Free seller account",
                "Passwordless Magic Link",
                "Create and manage products",
                "5% UzaLink commission",
                "95% seller earnings",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-white/80"
                >
                  <Icon
                    name="checkCircle"
                    className="h-5 w-5 text-gold"
                  />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-bold text-gold">
                Premium is optional
              </p>

              <p className="mt-1 text-sm text-white/65">
                Premium can unlock additional seller
                features, but it is not required to sell.
              </p>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-7 text-ink shadow-2xl">
            <h2 className="text-2xl text-deep">
              Seller Magic Login
            </h2>

            {!sent ? (
              <>
                <p className="mt-2 text-sm text-forest/70">
                  Get a secure one-time login link.
                </p>

                <label className="mt-6 block text-sm font-bold text-deep">
                  Email
                </label>

                <input
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  type="email"
                  placeholder="you@example.com"
                  className={`${inputClass} mt-2`}
                />

                <div className="my-4 text-center text-xs font-bold text-forest/45">
                  OR
                </div>

                <label className="block text-sm font-bold text-deep">
                  Phone
                </label>

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10)
                    )
                  }
                  placeholder="0712345678"
                  className={`${inputClass} mt-2`}
                />

                {error && (
                  <p className="mt-3 text-sm font-semibold text-red-600">
                    {error}
                  </p>
                )}

                <button
                  disabled={busy}
                  onClick={send}
                  className={btnClass(
                    "gold",
                    "lg",
                    "mt-6 w-full"
                  )}
                >
                  {busy
                    ? "Sending secure link…"
                    : "Get Free Seller Login"}
                  <Icon
                    name="key"
                    className="h-5 w-5"
                  />
                </button>

                <p className="mt-4 text-center text-xs text-forest/50">
                  No password is stored. Your Magic Link
                  expires after 15 minutes.
                </p>
              </>
            ) : (
              <div className="mt-6 rounded-2xl bg-mint p-5">
                <div className="flex items-center gap-3">
                  <Icon
                    name="checkCircle"
                    className="h-6 w-6 text-brand"
                  />

                  <p className="font-extrabold text-deep">
                    Login link sent
                  </p>
                </div>

                <p className="mt-3 text-sm text-forest/70">
                  Check your email or phone for your
                  secure UzaLink seller login link.
                </p>

                <p className="mt-2 text-xs text-forest/55">
                  The link can only be used once and
                  expires in 15 minutes.
                </p>

                <button
                  className={btnClass(
                    "outline",
                    "md",
                    "mt-5 w-full"
                  )}
                  onClick={() => {
                    setSent(false);
                    setError("");
                  }}
                >
                  Use another identity
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

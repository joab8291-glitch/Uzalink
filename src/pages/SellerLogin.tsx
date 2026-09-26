```tsx
import { useEffect, useRef, useState } from "react";
import { Container, btnClass, inputClass } from "@/components/ui";
import { Logo, Icon } from "@/components/Icon";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { navigate } from "@/lib/router";

export default function SellerLogin() {
  const { user, refresh } = useAuth();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const verificationStarted =
    useRef(false);

  /**
   * ======================================================
   * MAGIC LINK DETECTION + VERIFICATION
   * ======================================================
   *
   * Expected URL:
   *
   * https://uzalink.vercel.app/#/seller-login?token=xxxxx
   *
   * Because UzaLink uses hash routing, the token
   * is contained inside window.location.hash.
   */
  useEffect(() => {
    if (verificationStarted.current) {
      return;
    }

    const hash =
      window.location.hash || "";

    console.log(
      "[SellerLogin] Current URL:",
      window.location.href
    );

    console.log(
      "[SellerLogin] Current hash:",
      hash
    );

    if (
      !hash.startsWith(
        "#/seller-login"
      )
    ) {
      return;
    }

    const questionMarkIndex =
      hash.indexOf("?");

    if (questionMarkIndex === -1) {
      console.log(
        "[SellerLogin] No query string found."
      );

      return;
    }

    const queryString =
      hash.substring(
        questionMarkIndex + 1
      );

    const params =
      new URLSearchParams(
        queryString
      );

    const token =
      params.get("token");

    if (!token) {
      console.log(
        "[SellerLogin] No magic-link token found."
      );

      return;
    }

    console.log(
      "[SellerLogin] Magic-link token detected."
    );

    console.log(
      "[SellerLogin] Token length:",
      token.length
    );

    verificationStarted.current =
      true;

    setVerifying(true);
    setError("");

    /**
     * Remove the token from the visible URL.
     */
    window.history.replaceState(
      null,
      "",
      window.location.pathname +
        "#/seller-login"
    );

    void (async () => {
      try {
        console.log(
          "[SellerLogin] Verifying magic link..."
        );

        const result =
          await api.verifyMagic(token);

        console.log(
          "[SellerLogin] Magic-link verification response:",
          result
        );

        console.log(
          "[SellerLogin] Refreshing authentication..."
        );

        const refreshed =
          await refresh();

        console.log(
          "[SellerLogin] Authentication refresh result:",
          refreshed
        );

        if (refreshed) {
          console.log(
            "[SellerLogin] Authentication successful."
          );

          if (
            refreshed.role ===
            "ADMIN"
          ) {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }

          return;
        }

        console.log(
          "[SellerLogin] First refresh returned no user. Retrying..."
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              500
            )
        );

        const retry =
          await refresh();

        console.log(
          "[SellerLogin] Authentication retry result:",
          retry
        );

        if (retry) {
          if (
            retry.role ===
            "ADMIN"
          ) {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }

          return;
        }

        throw new Error(
          "The login link was verified, but your session could not be established."
        );
      } catch (e) {
        console.error(
          "[SellerLogin] Magic-link verification failed:",
          e
        );

        setError(
          e instanceof Error
            ? e.message
            : "Login link is invalid or expired."
        );

        verificationStarted.current =
          false;
      } finally {
        setVerifying(false);
      }
    })();
  }, [refresh]);

  /**
   * ======================================================
   * ALREADY LOGGED IN
   * ======================================================
   */
  if (
    user &&
    !verifying
  ) {
    return (
      <section className="min-h-screen bg-mint/50 pt-32">
        <Container className="max-w-lg">
          <div className="rounded-3xl bg-white p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-brand">
              <Icon
                name="checkCircle"
                className="h-7 w-7"
              />
            </div>

            <h1 className="mt-5 text-3xl text-deep">
              Welcome back
            </h1>

            <p className="mt-3 text-forest/65">
              Your seller account is ready.
              Premium is optional.
            </p>

            <button
              className={btnClass(
                "gold",
                "lg",
                "mt-6 w-full"
              )}
              onClick={() =>
                navigate(
                  user.role ===
                    "ADMIN"
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

  /**
   * ======================================================
   * VERIFYING MAGIC LINK
   * ======================================================
   */
  if (verifying) {
    return (
      <section className="brand-gradient min-h-screen flex items-center justify-center px-6 text-white">
        <Container className="max-w-lg">
          <div className="rounded-3xl bg-white p-8 text-center text-ink shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-mint text-brand">
              <Icon
                name="key"
                className="h-8 w-8"
              />
            </div>

            <h1 className="mt-6 text-2xl text-deep">
              Signing you in…
            </h1>

            <p className="mt-3 text-sm text-forest/65">
              Your secure seller login link is
              being verified.
            </p>

            <div className="mt-6 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest/15 border-t-brand" />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  /**
   * ======================================================
   * REQUEST MAGIC LINK
   * ======================================================
   */
  const send = async () => {
    setError("");

    if (
      !email.trim() &&
      !phone.trim()
    ) {
      setError(
        "Enter your email or phone number."
      );

      return;
    }

    setBusy(true);

    try {
      const result =
        await api.requestMagic({
          email:
            email.trim() ||
            undefined,

          phone:
            phone.trim() ||
            undefined,

          intent: "seller",
        });

      setSent(true);

      if (result.devLink) {
        console.info(
          "[SellerLogin] Development magic link:",
          result.devLink
        );
      }
    } catch (e) {
      console.error(
        "[SellerLogin] Could not send magic link:",
        e
      );

      setError(
        e instanceof Error
          ? e.message
          : "Could not send login link."
      );
    } finally {
      setBusy(false);
    }
  };

  /**
   * ======================================================
   * SELLER LOGIN FORM
   * ======================================================
   */
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
              Create your free seller account with
              a one-time Magic Link. List products,
              sell through M-Pesa and receive 95%
              of every successful sale.
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
                    setEmail(
                      e.target.value
                    )
                  }
                  type="email"
                  placeholder="you@example.com"
                  className={
                    inputClass +
                    " mt-2"
                  }
                  disabled={busy}
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
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(
                          0,
                          10
                        )
                    )
                  }
                  type="tel"
                  inputMode="numeric"
                  placeholder="0712345678"
                  className={
                    inputClass +
                    " mt-2"
                  }
                  disabled={busy}
                />

                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 p-3">
                    <p className="text-sm font-semibold text-red-600">
                      {error}
                    </p>
                  </div>
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
                  No password is stored. Your Magic
                  Link expires after 15 minutes.
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
                  Check your email for your secure
                  UzaLink seller login link.
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
```

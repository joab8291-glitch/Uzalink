import { useEffect, useState } from "react";
import {
  Container,
  btnClass,
  inputClass,
} from "@/components/ui";
import { Icon, Logo } from "@/components/Icon";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { navigate } from "@/lib/router";

export function AdminTestLogin() {
  const {
    user,
    loading,
    refresh,
  } = useAuth();

  const [phone, setPhone] =
    useState("0733304491");

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

  /*
   * If the browser already has an ADMIN
   * session, redirect after render.
   */
  useEffect(() => {
    if (!loading && user?.role === "ADMIN") {
      navigate("/admin");
    }
  }, [loading, user?.role]);

  const requestCode = async () => {
    setError("");
    setMessage("");

    if (!phone.trim()) {
      setError(
        "Enter the admin phone number."
      );
      return;
    }

    setBusy(true);

    try {
      const result =
        await api.adminTestRequest(
          phone.trim()
        );

      setSent(true);

      setMessage(
        result?.message ||
          "Admin verification code ready."
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not start admin verification."
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
        "Enter the admin verification code."
      );
      return;
    }

    setBusy(true);

    try {
      const result =
        await api.adminTestVerify(
          phone.trim(),
          code.trim()
        );

      /*
       * Make sure the backend actually
       * returned an ADMIN session.
       */
      if (
        result?.admin !== true &&
        result?.user?.role !== "ADMIN"
      ) {
        throw new Error(
          "Admin verification did not return an ADMIN session."
        );
      }

      /*
       * Refresh the global authentication
       * state so AdminConsole can see ADMIN.
       */
      const refreshed =
        await refresh();

      if (
        refreshed?.role !== "ADMIN"
      ) {
        throw new Error(
          "Admin session was not established. Please try again."
        );
      }

      navigate("/admin");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Invalid admin verification code."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="brand-gradient min-h-screen pb-20 pt-28 text-white">
      <Container className="max-w-3xl">
        <div className="mx-auto max-w-xl rounded-[32px] bg-white p-7 text-ink shadow-2xl sm:p-9">

          <Logo tone="dark" />

          <p className="mt-6 text-xs font-extrabold uppercase tracking-[.18em] text-brand">
            UzaLink Administration
          </p>

          <h1 className="mt-3 text-3xl font-black text-deep sm:text-4xl">
            Admin Login
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-forest/65">
            Secure administrator access.
            The verification code is managed
            securely on the server.
          </p>

          {!sent ? (
            <>
              <label className="mt-7 block text-sm font-bold text-deep">
                Admin phone number
              </label>

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void requestCode();
                  }
                }}
                className={
                  inputClass + " mt-2"
                }
                inputMode="tel"
                autoComplete="tel"
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
                  ? "Checking…"
                  : "Continue to Admin Login"}

                <Icon
                  name="arrowRight"
                  className="h-5 w-5"
                />
              </button>
            </>
          ) : (
            <>
              <label className="mt-7 block text-sm font-bold text-deep">
                Admin verification code
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void verify();
                  }
                }}
                className={
                  inputClass +
                  " mt-2 text-center text-2xl tracking-[.35em]"
                }
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
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
                  : "Verify & Open Admin Dashboard"}

                <Icon
                  name="shield"
                  className="h-5 w-5"
                />
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
                Use another number
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="mt-5 w-full text-sm font-bold text-brand"
          >
            Back to UzaLink
          </button>

        </div>
      </Container>
    </section>
  );
}

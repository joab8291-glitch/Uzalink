import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import {
  commissionOf,
  formatKsh,
  productByCode,
  sellerOf,
  type Product,
} from "@/lib/data";
import { Link, useRoute } from "@/lib/router";
import { Icon } from "@/components/Icon";
import {
  Badge,
  Container,
  Field,
  Reveal,
  btnClass,
  inputClass,
} from "@/components/ui";
import { api } from "@/lib/api";

const VERIFY_STEPS = [
  "M-Pesa payment confirmed",
  "Matching transaction reference",
  "Verifying amount received",
  "Crediting author balance (95%)",
  "Unlocking your book",
];

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function Checkout({ code }: { code: string }) {
  const route = useRoute();

  const book = productByCode(code);

  const [stage, setStage] = useState<
    "form" | "paying" | "verifying" | "success"
  >("form");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [method, setMethod] = useState<"stk" | "paybill">("stk");

  const [vStep, setVStep] = useState(0);
  const [countdown, setCountdown] = useState(60);

  const [errors, setErrors] = useState<string[]>([]);

  const [mpesaOrder, setMpesaOrder] = useState<{
    orderId: string;
    publicId?: string;
    status?: string;
    checkoutRequestId?: string;
  } | null>(null);

  const [mpesaError, setMpesaError] = useState("");
  const [polling, setPolling] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadError, setDownloadError] = useState("");

  const seller = sellerOf(book);
  const commission = commissionOf(book.price);
  const authorEarnings = Math.max(0, book.price - commission);
  const isDigital = book.instant ?? false;

  useEffect(() => {
    if (stage !== "paying") return;

    setCountdown(60);

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    if (!mpesaOrder?.orderId) return;
    if (stage !== "paying" && stage !== "verifying") return;

    let cancelled = false;
    let attempts = 0;

    setPolling(true);
    setVStep(0);

    const checkOrder = async () => {
      try {
        const response = await api.order(mpesaOrder.orderId);

        if (cancelled) return;

        const status = String(response?.order?.status ?? response?.status ?? "")
          .toUpperCase();

        if (status === "PAID" || status === "FULFILLED") {
          setVStep(VERIFY_STEPS.length - 1);

          try {
            const access = await api.downloadAccess(
              mpesaOrder.orderId,
              digitsOnly(phone)
            );

            if (!access?.url) {
              throw new Error("Secure book access could not be created.");
            }

            if (!cancelled) {
              setDownloadUrl(access.url);
              setDownloadError("");
              setStage("success");
              setPolling(false);
            }
          } catch (error: any) {
            if (!cancelled) {
              setDownloadError(
                error?.message ||
                  "Payment was confirmed, but secure book access could not be prepared yet."
              );
              setStage("success");
              setPolling(false);
            }
          }

          return;
        }

        if (
          status === "FAILED" ||
          status === "CANCELLED" ||
          status === "EXPIRED"
        ) {
          setMpesaError(
            response?.order?.paymentError ||
              response?.paymentError ||
              "The M-Pesa payment could not be completed."
          );
          setPolling(false);
          return;
        }

        attempts += 1;

        const progress = Math.min(
          VERIFY_STEPS.length - 2,
          Math.floor(attempts / 2)
        );

        setVStep(progress);

        if (attempts >= 40) {
          setMpesaError(
            "We could not confirm the payment within the expected time. If money was deducted, please keep your M-Pesa confirmation message and contact support."
          );
          setPolling(false);
          return;
        }

        window.setTimeout(checkOrder, 3000);
      } catch (error: any) {
        if (cancelled) return;

        attempts += 1;

        if (attempts >= 40) {
          setMpesaError(
            error?.message ||
              "We could not confirm your payment. Please try again."
          );
          setPolling(false);
          return;
        }

        window.setTimeout(checkOrder, 3000);
      }
    };

    checkOrder();

    return () => {
      cancelled = true;
    };
  }, [mpesaOrder?.orderId, stage]);

  if (!book) {
    return (
      <main className="min-h-screen bg-mint/40 pb-16 pt-32">
        <Container className="max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold text-deep">
            Book unavailable
          </h1>
          <p className="mt-3 text-forest/70">
            This book could not be loaded. Please return to the book page and try again.
          </p>
          <Link
            to={`/magic/${code}`}
            className={btnClass("gold", "lg", "mt-6")}
          >
            Back to Book
          </Link>
        </Container>
      </main>
    );
  }

  async function pay() {
    const nextErrors: string[] = [];

    if (!name.trim()) {
      nextErrors.push("Enter your name.");
    }

    const normalizedPhone = digitsOnly(phone);

    if (!normalizedPhone) {
      nextErrors.push("Enter your M-Pesa phone number.");
    } else if (normalizedPhone.length < 9) {
      nextErrors.push("Enter a valid Kenyan phone number.");
    }

    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }

    setErrors([]);
    setMpesaError("");

    // Paybill is not connected to the current payment API yet.
    if (method !== "stk") {
      setMpesaError(
        "Paybill payments are coming soon. Please use M-Pesa STK Push for now."
      );
      return;
    }

    try {
      setStage("paying");

      const created = await api.createOrder({
        productCode: book.code,
        name: name.trim(),
        phone: normalizedPhone,
        email: email.trim() || undefined,
      });

      const orderId = created?.order?.id;

      if (!orderId) {
        throw new Error(
          "We could not create your book order. Please try again."
        );
      }

      const paid = await api.payOrder(orderId);

      setMpesaOrder({
        orderId,
        publicId: created?.order?.publicId,
        status: paid?.order?.status ?? paid?.status,
        checkoutRequestId:
          paid?.checkoutRequestId ??
          paid?.order?.checkoutRequestId ??
          created?.order?.checkoutRequestId,
      });
    } catch (error: any) {
      setStage("form");
      setMpesaError(
        error?.message ||
          "We could not start the M-Pesa payment. Please try again."
      );
    }
  }

  function resetCheckout() {
    setStage("form");
    setMpesaOrder(null);
    setMpesaError("");
    setDownloadUrl("");
    setDownloadError("");
    setPolling(false);
    setVStep(0);
    setCountdown(60);
  }

  return (
    <main className="min-h-screen bg-mint/40 pb-16 pt-28">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-5xl">
            <div className="mb-6">
              <Link
                to={`/magic/${book.code}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-forest/70 transition hover:text-deep"
              >
                <Icon name="arrowLeft" className="h-4 w-4" />
                Back to book
              </Link>
            </div>

            {stage === "success" ? (
              <SuccessState
                book={book}
                seller={seller}
                name={name}
                phone={phone}
                email={email}
                authorEarnings={authorEarnings}
                commission={commission}
                downloadUrl={downloadUrl}
                downloadError={downloadError}
              />
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
                <section className="rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(4,40,26,0.4)] sm:p-7">
                  {stage === "form" ? (
                    <>
                      <div>
                        <Badge tone="gold">
                          <Icon name="book" className="h-3.5 w-3.5" />
                          Secure book checkout
                        </Badge>

                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-deep sm:text-4xl">
                          Buy this book
                        </h1>

                        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-forest/70">
                          Complete your details and pay with M-Pesa. You do not
                          need to create a reader account.
                        </p>
                      </div>

                      <div className="mt-7 space-y-5">
                        <Field label="Your name" required>
                          <input
                            className={inputClass}
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter your name"
                            autoComplete="name"
                          />
                        </Field>

                        <Field
                          label="M-Pesa phone number"
                          required
                          hint="Use the number that should receive the M-Pesa payment prompt."
                        >
                          <input
                            className={inputClass}
                            value={phone}
                            onChange={(event) =>
                              setPhone(event.target.value)
                            }
                            placeholder="07XX XXX XXX"
                            inputMode="tel"
                            autoComplete="tel"
                          />
                        </Field>

                        <Field
                          label="Email address"
                          hint="Optional — useful for your digital receipt."
                        >
                          <input
                            className={inputClass}
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            type="email"
                            autoComplete="email"
                          />
                        </Field>

                        <div>
                          <p className="mb-3 text-sm font-extrabold text-deep">
                            Payment method
                          </p>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <button
                              type="button"
                              onClick={() => setMethod("stk")}
                              className={cn(
                                "rounded-2xl border p-4 text-left transition",
                                method === "stk"
                                  ? "border-deep bg-mint/70 shadow-sm"
                                  : "border-forest/10 bg-white hover:border-forest/20"
                              )}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep text-white">
                                    <Icon
                                      name="phone"
                                      className="h-5 w-5"
                                    />
                                  </span>

                                  <div>
                                    <p className="font-extrabold text-deep">
                                      M-Pesa STK Push
                                    </p>
                                    <p className="mt-0.5 text-xs text-forest/60">
                                      Recommended
                                    </p>
                                  </div>
                                </div>

                                {method === "stk" && (
                                  <Icon
                                    name="check"
                                    className="h-5 w-5 text-deep"
                                  />
                                )}
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setMethod("paybill")}
                              className={cn(
                                "relative rounded-2xl border p-4 text-left transition",
                                method === "paybill"
                                  ? "border-deep bg-mint/70 shadow-sm"
                                  : "border-forest/10 bg-white hover:border-forest/20"
                              )}
                            >
                              <span className="absolute right-3 top-3 rounded-full bg-gold/20 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-deep">
                                Coming soon
                              </span>

                              <div className="flex items-center gap-3 pr-16">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-forest">
                                  <Icon
                                    name="creditCard"
                                    className="h-5 w-5"
                                  />
                                </span>

                                <div>
                                  <p className="font-extrabold text-deep">
                                    Paybill
                                  </p>
                                  <p className="mt-0.5 text-xs text-forest/60">
                                    Manual payment option
                                  </p>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>

                        {errors.length > 0 && (
                          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                            <div className="flex gap-3">
                              <Icon
                                name="alert"
                                className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
                              />

                              <div className="space-y-1">
                                {errors.map((error) => (
                                  <p
                                    key={error}
                                    className="text-sm font-semibold text-red-700"
                                  >
                                    {error}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {mpesaError && (
                          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                            <div className="flex gap-3">
                              <Icon
                                name="alert"
                                className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
                              />

                              <div>
                                <p className="font-extrabold text-red-800">
                                  Payment issue
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-red-700">
                                  {mpesaError}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={pay}
                          className={btnClass(
                            "deep",
                            "lg",
                            "w-full justify-center"
                          )}
                        >
                          <Icon
                            name="lock"
                            className="h-5 w-5 text-gold"
                          />
                          Pay {formatKsh(book.price)} with M-Pesa
                        </button>

                        <div className="flex items-start gap-3 rounded-2xl bg-mint/60 p-4">
                          <Icon
                            name="shield"
                            className="mt-0.5 h-5 w-5 shrink-0 text-deep"
                          />

                          <p className="text-xs font-medium leading-relaxed text-forest/70">
                            Your payment is processed through M-Pesa. Your
                            reader account is not required to purchase this
                            book.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <PaymentProcessing
                      countdown={countdown}
                      error={mpesaError}
                      polling={polling}
                      onRetry={resetCheckout}
                      vStep={vStep}
                    />
                  )}
                </section>

                <aside className="h-fit rounded-3xl border border-forest/10 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(4,40,26,0.4)] sm:p-6 lg:sticky lg:top-24">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-forest/50">
                    Book summary
                  </p>

                  <div className="mt-4 overflow-hidden rounded-2xl bg-mint">
                    <img
                      src={book.image}
                      alt={book.name}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>

                  <div className="mt-5">
                    <Badge tone="mint">Digital Book</Badge>

                    <h2 className="mt-3 text-xl font-extrabold leading-tight text-deep">
                      {book.name}
                    </h2>

                    <p className="mt-2 text-sm text-forest/65">
                      By <span className="font-bold">{seller}</span>
                    </p>

                    <p className="mt-4 text-sm leading-relaxed text-forest/70">
                      {book.description}
                    </p>
                  </div>

                  <div className="my-5 h-px bg-forest/10" />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-semibold text-forest/60">
                        Book price
                      </span>
                      <span className="font-extrabold text-deep">
                        {formatKsh(book.price)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-semibold text-forest/60">
                        Reader account
                      </span>
                      <span className="font-extrabold text-deep">
                        Not required
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-semibold text-forest/60">
                        Access
                      </span>
                      <span className="font-extrabold text-deep">
                        Digital book
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-deep p-4 text-white">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                        <Icon
                          name="shield"
                          className="h-4.5 w-4.5 text-gold"
                        />
                      </span>

                      <div>
                        <p className="text-sm font-extrabold">
                          UZALINK reader protection
                        </p>
                        <p className="mt-0.5 text-xs text-white/60">
                          Simple M-Pesa checkout for digital books.
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </main>
  );
}

function PaymentProcessing({
  countdown,
  error,
  polling,
  onRetry,
  vStep,
}: {
  countdown: number;
  error: string;
  polling: boolean;
  onRetry: () => void;
  vStep: number;
}) {
  if (error) {
    return (
      <div className="py-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600">
          <Icon name="alert" className="h-8 w-8" />
        </span>

        <h2 className="mt-6 text-2xl font-extrabold text-deep">
          Payment needs attention
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-forest/70">
          {error}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className={cn(btnClass("deep", "md"), "mt-7")}
        >
          <Icon name="refresh" className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-mint text-deep">
          <Icon name="phone" className="h-8 w-8" />
        </span>

        <h2 className="mt-6 text-2xl font-extrabold text-deep">
          Check your phone
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-forest/70">
          An M-Pesa payment prompt has been sent to your phone. Enter your
          M-Pesa PIN to complete the purchase.
        </p>

        <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-sm font-extrabold text-deep">
          <Icon name="clock" className="h-4 w-4" />
          {countdown}s
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {VERIFY_STEPS.map((step, index) => {
          const complete = index < vStep;
          const current = index === vStep;

          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-4 transition",
                complete || current
                  ? "border-forest/10 bg-mint/50"
                  : "border-forest/5 bg-white"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  complete
                    ? "bg-deep text-white"
                    : current
                      ? "bg-gold text-deep"
                      : "bg-forest/5 text-forest/40"
                )}
              >
                {complete ? (
                  <Icon name="check" className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-extrabold">{index + 1}</span>
                )}
              </span>

              <span
                className={cn(
                  "text-sm font-bold",
                  complete || current
                    ? "text-deep"
                    : "text-forest/40"
                )}
              >
                {step}
              </span>

              {current && polling && (
                <span className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-deep/20 border-t-deep" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-7 rounded-2xl border border-gold/20 bg-gold/10 p-4">
        <p className="text-center text-xs font-semibold leading-relaxed text-deep/75">
          Please keep this page open while we confirm your M-Pesa payment.
        </p>
      </div>
    </div>
  );
}

function SuccessState({
  book,
  seller,
  name,
  phone,
  email,
  authorEarnings,
  commission,
  downloadUrl,
  downloadError,
}: {
  book: Product;
  seller: string;
  name: string;
  phone: string;
  email: string;
  authorEarnings: number;
  commission: number;
  downloadUrl: string;
  downloadError: string;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <section className="overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-[0_25px_70px_-40px_rgba(4,40,26,0.45)]">
        <div className="bg-deep px-6 py-10 text-center text-white sm:px-10">
          <span className="mx-auto flex h-18 w-18 items-center justify-center rounded-[24px] bg-white/10">
            <Icon name="check" className="h-9 w-9 text-gold" />
          </span>

          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-gold">
            Payment confirmed
          </p>

          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Your book is ready!
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/65">
            Your M-Pesa payment has been confirmed and your book purchase has
            been recorded.
          </p>
        </div>

        <div className="p-5 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
            <img
              src={book.image}
              alt={book.name}
              className="mx-auto aspect-[4/3] w-full max-w-[180px] rounded-2xl object-cover sm:mx-0"
            />

            <div>
              <Badge tone="mint">Digital Book</Badge>

              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-deep">
                {book.name}
              </h2>

              <p className="mt-2 text-sm text-forest/65">
                By <span className="font-bold">{seller}</span>
              </p>

              <p className="mt-4 text-sm leading-relaxed text-forest/70">
                Thank you, {name || "reader"}. Your payment for this book has
                been confirmed.
              </p>
            </div>
          </div>

          <div className="my-7 h-px bg-forest/10" />

          <div className="grid gap-4 sm:grid-cols-3">
            <ReceiptItem label="Book" value={formatKsh(book.price)} />
            <ReceiptItem label="Author settlement" value={formatKsh(authorEarnings)} />
            <ReceiptItem label="UzaLink fee" value={formatKsh(commission)} />
          </div>

          <div className="mt-7 rounded-2xl border border-gold/25 bg-gold/10 p-5">
            <div className="flex gap-3">
              <Icon
                name="book"
                className="mt-0.5 h-5 w-5 shrink-0 text-deep"
              />

              <div>
                <p className="font-extrabold text-deep">
                  Book access unlocked
                </p>

                <p className="mt-1 text-sm leading-relaxed text-deep/65">
                  Your payment has been confirmed. Your secure download link
                  is valid for a limited time and follows the book's download limit.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {downloadUrl ? (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className={btnClass("deep", "lg", "justify-center")}
              >
                <Icon name="download" className="h-5 w-5 text-gold" />
                Download Your Book
              </a>
            ) : (
              <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm font-semibold leading-relaxed text-deep/75">
                {downloadError || "Preparing your secure book download..."}
              </div>
            )}

            <Link
              to="/explore"
              className={btnClass("outline", "lg", "justify-center")}
            >
              <Icon name="compass" className="h-5 w-5" />
              Discover More Books
            </Link>
          </div>

          <div className="mt-7 rounded-2xl bg-mint/60 p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-forest/50">
              Digital receipt
            </p>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <ReceiptLine label="Reader" value={name || "Reader"} />
              <ReceiptLine label="Phone" value={phone || "—"} />
              <ReceiptLine label="Email" value={email || "Not provided"} />
              <ReceiptLine label="Book price" value={formatKsh(book.price)} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReceiptItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-mint/60 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-forest/50">
        {label}
      </p>

      <p className="mt-2 text-lg font-extrabold text-deep">{value}</p>
    </div>
  );
}

function ReceiptLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-forest/10 pb-3 last:border-0 last:pb-0">
      <span className="font-semibold text-forest/55">{label}</span>
      <span className="text-right font-bold text-deep">{value}</span>
    </div>
  );
}

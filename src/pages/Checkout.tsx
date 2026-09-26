import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import {
  PRODUCTS,
  commissionOf,
  formatKsh,
  productByCode,
  sellerOf,
  type Product,
} from "@/lib/data";
import { findAnyProduct } from "@/lib/store";
import { Link } from "@/lib/router";
import { Icon } from "@/components/Icon";
import { api } from "@/lib/api";
import {
  Badge,
  Container,
  Field,
  Reveal,
  btnClass,
  inputClass,
} from "@/components/ui";

const FALLBACK = PRODUCTS[0];

const VERIFY_STEPS = [
  "M-Pesa payment confirmed",
  "Matching transaction reference",
  "Verifying amount received",
  "Crediting author balance (95%)",
  "Unlocking your book",
];

const digitsOnly = (value: string) =>
  value.replace(/\D/g, "").slice(0, 10);

export function Checkout({ code }: { code: string }) {
  const book: Product =
    productByCode(code) ?? findAnyProduct(code) ?? FALLBACK;

  const [stage, setStage] = useState<
    "form" | "paying" | "verifying" | "success"
  >("form");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [method, setMethod] = useState<"stk" | "paybill">("stk");

  const [vStep, setVStep] = useState(0);
  const [countdown, setCountdown] = useState(120);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [mpesaOrder, setMpesaOrder] = useState<any>(null);
  const [mpesaError, setMpesaError] = useState("");
  const [polling, setPolling] = useState(false);

  const [ref] = useState(
    () =>
      `UZL-${Math.random()
        .toString(16)
        .slice(2, 7)
        .toUpperCase()}`,
  );

  const pay = async () => {
    const validationErrors: Record<string, string> = {};

    if (name.trim().length < 3) {
      validationErrors.name = "Enter your name.";
    }

    if (digitsOnly(phone).length !== 10) {
      validationErrors.phone =
        "Enter the M-Pesa number paying for this book.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length || method !== "stk") {
      return;
    }

    setMpesaError("");
    setMpesaOrder(null);
    setCountdown(120);
    setPolling(true);
    setStage("paying");

    try {
      const created = await api.createOrder({
        productCode: book.code,
        name,
        phone,
        email: email || undefined,
      });

      const paid = await api.payOrder(created.order.id);

      setMpesaOrder({
        orderId: created.order.id,
        publicId: created.order.publicId,
        status: "pending",
        checkoutRequestId: paid.checkoutRequestId,
      });
    } catch (error) {
      setPolling(false);
      setMpesaError(
        error instanceof Error
          ? error.message
          : "Could not start payment.",
      );
    }
  };

  /* ============================================================
     POLL THE SAME SERVER-SIDE ORDER
  ============================================================ */
  useEffect(() => {
    if (!polling || !mpesaOrder?.orderId) return;

    let stopped = false;
    const started = Date.now();

    const check = async () => {
      try {
        const result = await api.order(mpesaOrder.orderId);
        const order = result.order;

        if (stopped) return;

        setMpesaOrder(order);

        if (
          order.status === "PAID" ||
          order.status === "FULFILLED"
        ) {
          setPolling(false);
          setVStep(VERIFY_STEPS.length);
          setStage("success");
          return;
        }

        if (order.status === "FAILED") {
          setPolling(false);

          setMpesaError(
            order.failureReason ||
              "M-Pesa payment was not completed.",
          );

          setStage("paying");
          return;
        }
      } catch (error) {
        if (Date.now() - started >= 120000) {
          setPolling(false);

          setMpesaError(
            error instanceof Error
              ? error.message
              : "Unable to check payment.",
          );

          setStage("paying");
          return;
        }
      }

      if (!stopped && Date.now() - started < 120000) {
        window.setTimeout(check, 3000);
      } else if (!stopped) {
        setPolling(false);

        setMpesaError(
          "Payment is still being processed. Please check your M-Pesa messages and try again shortly.",
        );

        setStage("paying");
      }
    };

    check();

    return () => {
      stopped = true;
    };
  }, [polling, mpesaOrder?.orderId]);

  useEffect(() => {
    if (!polling) return;

    const timer = window.setInterval(() => {
      setCountdown((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [polling]);

  const isDigital = book.instant ?? false;

  /* ============================================================
     PAYING
  ============================================================ */
  if (stage === "paying") {
    return (
      <section className="flex min-h-screen items-center justify-center bg-deep px-4 py-24 text-white">
        <div className="w-full max-w-md text-center">
          <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
            <span className="absolute inset-0 animate-ring rounded-full" />

            <span className="absolute inset-3 rounded-full border-4 border-white/10" />

            <div className="flex h-24 w-24 items-center justify-center rounded-3xl gold-gradient text-deep">
              <Icon name="phone" className="h-11 w-11" />
            </div>
          </div>

          <h1 className="mt-9 text-[28px] leading-tight sm:text-[34px]">
            Check your phone
          </h1>

          <p className="mt-4 text-[15.5px] leading-relaxed text-white/70">
            {mpesaOrder ? (
              <>
                We sent an M-Pesa request to{" "}
                <span className="font-extrabold text-gold">
                  +254 {digitsOnly(phone)}
                </span>
                . Enter your M-Pesa PIN to complete payment of{" "}
                <span className="font-extrabold text-gold">
                  {formatKsh(book.price)}
                </span>
                .
              </>
            ) : (
              <>
                Starting your M-Pesa payment for{" "}
                <span className="font-extrabold text-gold">
                  {formatKsh(book.price)}
                </span>
                …
              </>
            )}
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur">
            <div className="flex items-center justify-between text-[13.5px]">
              <span className="text-white/60">
                Book order
              </span>

              <span className="font-mono font-extrabold">
                {mpesaOrder?.orderId || ref}
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[13.5px]">
              <span className="text-white/60">
                Book
              </span>

              <span className="max-w-[60%] truncate text-right font-extrabold">
                {book.name}
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[13.5px]">
              <span className="text-white/60">
                Amount
              </span>

              <span className="font-extrabold text-gold">
                {formatKsh(book.price)}
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[13.5px]">
              <span className="text-white/60">
                Status
              </span>

              <span className="font-extrabold">
                {mpesaOrder?.status || "Starting STK Push…"}
              </span>
            </div>

            {mpesaError && (
              <p className="mt-4 rounded-2xl bg-red-500/10 p-3 text-[13px] font-semibold text-red-200">
                {mpesaError}
              </p>
            )}
          </div>

          <p className="mt-7 flex items-center justify-center gap-2 text-[13.5px] font-semibold text-white/60">
            <Icon
              name="clock"
              className="h-4 w-4 text-gold"
            />

            {mpesaError
              ? "Payment needs attention"
              : `Waiting for confirmation… ${countdown}s`}
          </p>

          <div className="mx-auto mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
            <span
              className="block h-full gold-gradient transition-all duration-1000"
              style={{
                width: `${Math.max(
                  0,
                  Math.min(
                    100,
                    ((120 - countdown) / 120) * 100,
                  ),
                )}%`,
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  /* ============================================================
     VERIFYING
  ============================================================ */
  if (stage === "verifying") {
    return (
      <section className="flex min-h-screen items-center justify-center bg-mint/60 px-4 py-24">
        <div className="w-full max-w-lg">
          <div className="rounded-[32px] border border-forest/10 bg-white p-7 text-center shadow-[0_30px_70px_-45px_rgba(4,40,26,0.5)] sm:p-9">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-mint text-brand">
              <Icon name="shield" className="h-8 w-8" />
            </span>

            <h1 className="mt-6 text-[27px] leading-tight text-deep sm:text-[32px]">
              Payment Received!
            </h1>

            <p className="mt-3 text-[14.5px] leading-relaxed text-forest/70">
              Verifying your payment server-side before your
              book is released. This protects both you and the
              author.
            </p>

            <div className="mt-7 space-y-2.5 text-left">
              {VERIFY_STEPS.map((step, index) => {
                const done = index < vStep;
                const active = index === vStep;

                return (
                  <div
                    key={step}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-300",
                      done
                        ? "border-brand/25 bg-mint"
                        : active
                          ? "border-gold bg-goldsoft"
                          : "border-forest/10 bg-white opacity-55",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        done
                          ? "bg-brand text-white"
                          : active
                            ? "bg-deep text-gold"
                            : "bg-forest/10",
                      )}
                    >
                      {done ? (
                        <Icon
                          name="check"
                          className="h-4 w-4"
                          strokeWidth={3}
                        />
                      ) : active ? (
                        <span className="h-2 w-2 animate-ping rounded-full bg-gold" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-forest/30" />
                      )}
                    </span>

                    <span className="text-[14px] font-bold text-deep">
                      {step}
                    </span>

                    <span className="ml-auto text-[11.5px] font-extrabold uppercase tracking-wide text-forest/45">
                      {done
                        ? "Done"
                        : active
                          ? "Running"
                          : "Queued"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ============================================================
     SUCCESS
  ============================================================ */
  if (stage === "success") {
    return (
      <section className="min-h-screen bg-mint/50 pb-24 pt-28 sm:pt-32">
        <Container className="max-w-2xl">
          <div className="text-center">
            <span className="mx-auto flex h-20 w-20 animate-pop items-center justify-center rounded-[28px] gold-gradient text-deep shadow-xl shadow-gold/40">
              <Icon
                name="checkCircle"
                className="h-11 w-11"
                strokeWidth={2.2}
              />
            </span>

            <h1 className="mt-6 text-[34px] leading-tight text-deep sm:text-[44px]">
              Your book is ready!
            </h1>

            <p className="mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-forest/75">
              Payment has been verified server-side. Your
              purchase is confirmed and your digital book has
              been released.
            </p>
          </div>

          {/* Book unlocked */}
          <div className="mt-9 overflow-hidden rounded-[32px] border border-brand/25 bg-white shadow-[0_30px_70px_-45px_rgba(4,40,26,0.5)]">
            <div className="brand-gradient px-6 py-5 text-white">
              <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-gold">
                {isDigital
                  ? "Digital book unlocked"
                  : "Book access unlocked"}
              </p>

              <p className="mt-2 text-[19px] font-extrabold leading-snug">
                {book.name}
              </p>

              <p className="mt-1 text-[13px] text-white/70">
                By {book.seller}
              </p>
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={book.image}
                  target="_blank"
                  rel="noreferrer"
                  className={btnClass(
                    "gold",
                    "lg",
                    "w-full sm:w-auto",
                  )}
                >
                  <Icon
                    name="download"
                    className="h-5 w-5"
                  />

                  {isDigital
                    ? "Open / Access Book"
                    : "View Book Access"}
                </a>

                <button
                  onClick={() => window.print()}
                  className={btnClass(
                    "outline",
                    "lg",
                    "w-full sm:w-auto",
                  )}
                >
                  <Icon
                    name="receipt"
                    className="h-5 w-5"
                  />
                  Print receipt
                </button>
              </div>

              <p className="mt-4 flex items-start gap-2.5 text-[13px] leading-relaxed text-forest/70">
                <Icon
                  name="info"
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                />

                {book.delivery}. Keep this page for your
                purchase information. A copy of the receipt
                was sent
                {email
                  ? ` to ${email}`
                  : " to your phone"}
                .
              </p>
            </div>
          </div>

          {/* Receipt */}
          <div className="mt-6 rounded-[32px] border border-forest/10 bg-white p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-forest/50">
                  Digital receipt
                </p>

                <p className="mt-1.5 font-mono text-[19px] font-extrabold text-deep">
                  {ref}
                </p>
              </div>

              <Badge tone="mint" icon="checkCircle">
                Verified
              </Badge>
            </div>

            <div className="mt-6 space-y-3">
              {[
                {
                  label: "Book",
                  value: book.name,
                },
                {
                  label: "Category",
                  value: book.category,
                },
                {
                  label: "Author",
                  value: book.seller,
                },
                {
                  label: "Paid by",
                  value: `${
                    name || "Reader"
                  } · M-Pesa +254 ${digitsOnly(phone)}`,
                },
                {
                  label: "M-Pesa receipt",
                  value:
                    mpesaOrder?.receipt ||
                    "Verified by M-Pesa",
                },
                {
                  label: "Amount paid",
                  value: formatKsh(book.price),
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-4 border-b border-forest/8 pb-3"
                >
                  <span className="text-[13px] font-semibold text-forest/60">
                    {row.label}
                  </span>

                  <span className="max-w-[60%] text-right text-[13.5px] font-extrabold text-deep">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-mint/70 p-4">
              <div className="flex items-center justify-between text-[13.5px] font-bold text-forest/75">
                <span>UZALINK commission (5%)</span>

                <span className="text-deep">
                  {formatKsh(
                    commissionOf(book.price),
                  )}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[14px] font-extrabold">
                <span className="text-forest">
                  Author settlement
                </span>

                <span className="text-brand">
                  {formatKsh(
                    sellerOf(book.price),
                  )}
                </span>
              </div>

              <p className="mt-3 text-[12px] leading-relaxed text-forest/65">
                The author receives 95% of the sale after
                successful payment verification, subject to
                the platform's applicable settlement process.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            <Link
              to="/explore"
              className={btnClass(
                "deep",
                "lg",
                "w-full",
              )}
            >
              Discover More Books
              <Icon
                name="compass"
                className="h-5 w-5"
              />
            </Link>

            <Link
              to="/sell"
              className={btnClass(
                "gold",
                "lg",
                "w-full",
              )}
            >
              Sell Your Book
              <Icon
                name="arrowRight"
                className="h-5 w-5"
              />
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  /* ============================================================
     CHECKOUT FORM
  ============================================================ */
  return (
    <section className="min-h-screen bg-mint/40 pb-24 pt-28 sm:pt-32">
      <Container className="max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-3 text-[13px] font-semibold text-forest/60">
          <Link
            to={`/magic/${book.code}`}
            className="inline-flex items-center gap-1.5 hover:text-brand"
          >
            <Icon
              name="arrowLeft"
              className="h-4 w-4"
            />
            Back to book
          </Link>

          <span className="hidden sm:inline">·</span>

          <span>Secure book checkout</span>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ======================================================
              PAYMENT FORM
          ======================================================= */}
          <Reveal>
            <div className="rounded-[32px] border border-forest/10 bg-white p-5 shadow-[0_30px_70px_-45px_rgba(4,40,26,0.5)] sm:p-7">
              <Badge tone="gold" icon="lock">
                No reader account needed
              </Badge>

              <h1 className="mt-4 text-[28px] leading-tight text-deep sm:text-[36px]">
                Buy this book
              </h1>

              <p className="mt-3 text-[14.5px] leading-relaxed text-forest/70">
                Complete your M-Pesa payment and get secure
                access to your digital book after the payment
                is verified.
              </p>

              {/* Payment method */}
              <div className="mt-6">
                <p className="text-[13.5px] font-bold text-deep">
                  Payment method
                </p>

                <div className="mt-3 grid gap-2.5">
                  {[
                    {
                      key: "stk" as const,
                      icon: "phone",
                      title: "M-Pesa STK Push",
                      text: "A payment prompt is sent directly to your phone.",
                      badge: "Recommended",
                    },
                    {
                      key: "paybill" as const,
                      icon: "bank",
                      title: "M-Pesa Paybill",
                      text: "Use the displayed Paybill instructions and order reference.",
                      badge: null,
                    },
                  ].map((payment) => (
                    <button
                      key={payment.key}
                      onClick={() =>
                        setMethod(payment.key)
                      }
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition-all",
                        method === payment.key
                          ? "border-brand bg-mint"
                          : "border-forest/10 bg-white hover:border-brand/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                          method === payment.key
                            ? "bg-white text-brand"
                            : "bg-mint text-brand",
                        )}
                      >
                        <Icon
                          name={payment.icon}
                          className="h-5 w-5"
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="text-[15px] font-extrabold text-deep">
                            {payment.title}
                          </span>

                          {payment.badge && (
                            <span className="rounded-full gold-gradient px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-deep">
                              {payment.badge}
                            </span>
                          )}
                        </span>

                        <span className="mt-0.5 block text-[12.5px] text-forest/65">
                          {payment.text}
                        </span>
                      </span>

                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                          method === payment.key
                            ? "border-brand bg-brand text-white"
                            : "border-forest/20",
                        )}
                      >
                        {method === payment.key && (
                          <Icon
                            name="check"
                            className="h-3.5 w-3.5"
                            strokeWidth={3}
                          />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paybill */}
              {method === "paybill" && (
                <div className="mt-4 animate-fade-up rounded-2xl border border-forest/10 bg-mint/60 p-4">
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-forest/55">
                    Paybill instructions
                  </p>

                  <ol className="mt-3 space-y-2">
                    {[
                      "Go to M-Pesa → Lipa na M-Pesa → Pay Bill.",
                      "Business number: 400200.",
                      `Account number: ${ref}.`,
                      `Amount: ${formatKsh(book.price)}.`,
                      "Enter your PIN and wait for the confirmation SMS.",
                    ].map((text, index) => (
                      <li
                        key={text}
                        className="flex gap-2.5 text-[13.5px] text-forest/80"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-deep text-[10.5px] font-extrabold text-gold">
                          {index + 1}
                        </span>

                        <span className="font-mono">
                          {text}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Reader information */}
              <div className="mt-6">
                <p className="text-[13.5px] font-extrabold text-deep">
                  Reader information
                </p>

                <p className="mt-1 text-[12.5px] text-forest/60">
                  These details are used to identify your
                  purchase and send your receipt.
                </p>
              </div>

              <div className="mt-5 grid gap-5">
                <Field
                  label="Your name"
                  required
                  error={errors.name}
                >
                  <input
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Name on M-Pesa"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="M-Pesa number to pay from"
                  required
                  hint="The STK push or payment confirmation is sent here."
                  error={errors.phone}
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14.5px] font-bold text-forest/45">
                      +254
                    </span>

                    <input
                      inputMode="numeric"
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          digitsOnly(
                            event.target.value,
                          ),
                        )
                      }
                      placeholder="0712 345 678"
                      className={cn(
                        inputClass,
                        "pl-[68px] text-[17px] font-extrabold tracking-wide",
                      )}
                    />
                  </div>
                </Field>

                <Field
                  label="Email for receipt"
                  hint="Optional — useful for keeping a copy of your purchase receipt."
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@email.com"
                    className={inputClass}
                  />
                </Field>
              </div>

              <button
                onClick={pay}
                className={btnClass(
                  "gold",
                  "xl",
                  "mt-7 w-full",
                )}
              >
                <Icon
                  name="bolt"
                  className="h-5.5 w-5.5"
                  strokeWidth={0}
                />

                Pay for Book · {formatKsh(book.price)}
              </button>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] font-semibold text-forest/60">
                <span className="inline-flex items-center gap-1.5">
                  <Icon
                    name="shield"
                    className="h-4 w-4 text-brand"
                  />
                  Secure payment
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Icon
                    name="lock"
                    className="h-4 w-4 text-brand"
                  />
                  Verified server-side
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Icon
                    name="receipt"
                    className="h-4 w-4 text-brand"
                  />
                  Digital receipt
                </span>
              </div>
            </div>
          </Reveal>

          {/* ======================================================
              BOOK SUMMARY
          ======================================================= */}
          <Reveal delay={90}>
            <div className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-[32px] border border-forest/10 bg-white shadow-[0_30px_70px_-45px_rgba(4,40,26,0.5)]">
                <div className="px-6 pt-6">
                  <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-forest/50">
                    Book summary
                  </p>
                </div>

                <div className="flex gap-4 p-6">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-2xl border border-forest/10 bg-mint">
                    <img
                      src={book.image}
                      alt={`${book.name} book cover`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[15px] font-extrabold leading-snug text-deep">
                      {book.name}
                    </p>

                    <p className="mt-1 text-[12.5px] text-forest/60">
                      By {book.seller}
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-mint px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wide text-forest">
                      {book.category}
                    </span>

                    <p className="mt-2 text-[17px] font-extrabold text-deep">
                      {formatKsh(book.price)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-forest/10 p-6">
                  <div className="flex items-center justify-between text-[13.5px]">
                    <span className="font-semibold text-forest/70">
                      Book price
                    </span>

                    <span className="font-extrabold text-deep">
                      {formatKsh(book.price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[13.5px]">
                    <span className="font-semibold text-forest/70">
                      Processing fee
                    </span>

                    <span className="font-extrabold text-brand">
                      KSh 0
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-forest/10 pt-3">
                    <span className="text-[15px] font-extrabold text-deep">
                      Total
                    </span>

                    <span className="text-[24px] font-extrabold text-deep">
                      {formatKsh(book.price)}
                    </span>
                  </div>
                </div>

                {/* Buyer protection */}
                <div className="bg-mint/60 p-6">
                  <p className="flex items-center gap-2 text-[13.5px] font-extrabold text-deep">
                    <Icon
                      name="shield"
                      className="h-4.5 w-4.5 text-brand"
                    />
                    UZALINK reader protection
                  </p>

                  <ul className="mt-3 space-y-2">
                    {[
                      "Payment is verified before your book is released",
                      "Order reference and digital receipt for every purchase",
                      "The author receives 95% after verification",
                    ].map((text) => (
                      <li
                        key={text}
                        className="flex gap-2.5 text-[12.5px] leading-snug text-forest/75"
                      >
                        <Icon
                          name="checkCircle"
                          className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                        />

                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* M-Pesa reassurance */}
              <div className="mt-4 flex items-center gap-3 rounded-3xl border border-forest/10 bg-white p-4">
                <Icon
                  name="mpesa"
                  className="h-7 w-7 shrink-0 text-brand"
                />

                <p className="text-[12.5px] leading-snug text-forest/70">
                  <span className="block font-extrabold text-deep">
                    M-Pesa made simple
                  </span>

                  Built for Kenyan readers — no card, no app
                  download and no reader account.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

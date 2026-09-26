import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Container,
  Field,
  btnClass,
  inputClass,
} from "@/components/ui";

import { Icon } from "@/components/Icon";

import {
  PRODUCT_TYPES,
  CATEGORIES,
  type ProductType,
} from "@/lib/data";

import { api } from "@/lib/api";

import { useAuth } from "@/lib/auth";

import { navigate } from "@/lib/router";

const kind = (t: ProductType) =>
  ({
    "Digital Product": "DIGITAL",
    Service: "SERVICE",
    Booking: "BOOKING",
    Event: "EVENT",
    Course: "COURSE",
    Subscription: "SUBSCRIPTION",
    "Physical Product": "PHYSICAL",
    Other: "OTHER",
  }[t] as string);

export function SellToday() {
  const { user, loading } = useAuth();

  const [step, setStep] = useState(1);

  const [handle, setHandle] = useState("");
  const [paymentNumber, setPaymentNumber] =
    useState("");

  const [profileLoading, setProfileLoading] =
    useState(false);

  const [type, setType] =
    useState<ProductType | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [category, setCategory] =
    useState("");
  const [price, setPrice] = useState("");
  const [inventory, setInventory] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState("");

  const [created, setCreated] =
    useState<any>();

  const ref =
    useRef<HTMLInputElement>(null);

  /**
   * Load the current seller profile.
   *
   * This allows sellers who already have a
   * profile to continue without re-entering
   * their details.
   */
  useEffect(() => {
    if (
      loading ||
      !user ||
      (user.role !== "SELLER" &&
        user.role !== "ADMIN")
    ) {
      return;
    }

    let cancelled = false;

    const loadSellerProfile = async () => {
      setProfileLoading(true);

      try {
        const result =
          await api.sellerDashboard();

        if (cancelled) {
          return;
        }

        const seller = result?.seller;

        if (seller?.handle) {
          setHandle(seller.handle);
        }

        if (seller?.paymentNumber) {
          setPaymentNumber(
            seller.paymentNumber
          );
        }
      } catch {
        /*
         * Do not block the seller page if the
         * profile cannot be loaded.
         *
         * The seller can still enter the
         * information manually.
         */
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    void loadSellerProfile();

    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  if (loading) {
    return (
      <section className="min-h-screen bg-mint/40 pt-32">
        <Container className="text-center">
          Loading seller access…
        </Container>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="min-h-screen bg-mint/40 pt-32">
        <Container className="max-w-xl">
          <div className="rounded-3xl bg-white p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-brand">
              <Icon
                name="key"
                className="h-7 w-7"
              />
            </div>

            <h1 className="mt-5 text-3xl text-deep">
              Start selling for free
            </h1>

            <p className="mt-3 text-forest/65">
              Get a secure Magic Link and create
              your seller account. Premium is
              optional.
            </p>

            <button
              className={btnClass(
                "gold",
                "lg",
                "mt-6 w-full"
              )}
              onClick={() =>
                navigate("/seller-login")
              }
            >
              Get Free Seller Login
            </button>
          </div>
        </Container>
      </section>
    );
  }

  if (
    user.role !== "SELLER" &&
    user.role !== "ADMIN"
  ) {
    return (
      <section className="min-h-screen bg-mint/40 pt-32">
        <Container className="max-w-xl">
          <div className="rounded-3xl bg-white p-8 text-center">
            <h1 className="text-3xl text-deep">
              Seller access required
            </h1>

            <p className="mt-3 text-forest/65">
              Sign in using Seller Magic Login to
              create products.
            </p>

            <button
              className={btnClass(
                "gold",
                "lg",
                "mt-6 w-full"
              )}
              onClick={() =>
                navigate("/seller-login")
              }
            >
              Seller Magic Login
            </button>
          </div>
        </Container>
      </section>
    );
  }

  const saveProfile = async () => {
    setError("");

    const cleanHandle =
      handle.trim().toLowerCase();

    const cleanPaymentNumber =
      paymentNumber
        .replace(/\D/g, "")
        .trim();

    if (
      !/^[a-z0-9_]{3,30}$/.test(
        cleanHandle
      )
    ) {
      setError(
        "Your seller handle must be 3–30 characters using lowercase letters, numbers or underscores."
      );
      return;
    }

    if (!cleanPaymentNumber) {
      setError(
        "Enter the M-Pesa number where your seller payouts will be settled."
      );
      return;
    }

    if (
      !/^(07\d{8}|01\d{8})$/.test(
        cleanPaymentNumber
      )
    ) {
      setError(
        "Enter a valid Kenyan M-Pesa number, for example 0712345678."
      );
      return;
    }

    setBusy(true);

    try {
      const result =
        await api.sellerProfile({
          handle: cleanHandle,
          paymentNumber:
            cleanPaymentNumber,
        });

      const saved =
        result?.seller;

      if (saved?.handle) {
        setHandle(saved.handle);
      }

      if (saved?.paymentNumber) {
        setPaymentNumber(
          saved.paymentNumber
        );
      }

      setStep(2);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save seller profile."
      );
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    setError("");

    if (
      !type ||
      name.trim().length < 3 ||
      description.trim().length < 12 ||
      !category ||
      Number(price) < 50
    ) {
      setError(
        "Complete the product type, name, description, category and a price of at least KSh 50."
      );
      return;
    }

    setBusy(true);

    try {
      const fd = new FormData();

      fd.append(
        "name",
        name.trim()
      );

      fd.append(
        "description",
        description.trim()
      );

      fd.append(
        "category",
        category
      );

      fd.append(
        "kind",
        kind(type)
      );

      fd.append(
        "priceCents",
        String(
          Math.round(
            Number(price) * 100
          )
        )
      );

      fd.append(
        "instant",
        String(
          PRODUCT_TYPES.find(
            (x) => x.type === type
          )?.digital || false
        )
      );

      fd.append(
        "downloadLimit",
        "5"
      );

      fd.append(
        "expiresHours",
        "72"
      );

      if (inventory) {
        fd.append(
          "inventory",
          inventory
        );
      }

      if (file) {
        fd.append(
          "file",
          file
        );
      }

      const result =
        await api.createProduct(fd);

      setCreated(result.product);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not create product."
      );
    } finally {
      setBusy(false);
    }
  };

  if (created) {
    return (
      <section className="min-h-screen bg-mint/50 pt-32">
        <Container className="max-w-2xl">
          <div className="rounded-[32px] bg-white p-8 text-center">
            <Icon
              name="checkCircle"
              className="mx-auto h-16 w-16 text-brand"
            />

            <h1 className="mt-5 text-4xl text-deep">
              Magic Link created
            </h1>

            <p className="mt-3 text-forest/65">
              Your product is now live and ready
              to sell.
            </p>

            <div className="mt-6 rounded-2xl bg-mint p-4 font-mono text-sm break-all">
              {location.origin}
              /#/magic/
              {created.code}
            </div>

            <div className="mt-6 rounded-2xl border border-forest/10 bg-white p-5 text-left">
              <p className="text-xs font-bold uppercase tracking-wide text-forest/50">
                Your earnings
              </p>

              <p className="mt-2 text-lg font-extrabold text-deep">
                You receive 95% of every successful
                sale.
              </p>

              <p className="mt-1 text-sm text-forest/65">
                UzaLink retains 5% as the platform
                commission.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className={btnClass(
                  "deep",
                  "md",
                  "flex-1"
                )}
                onClick={() =>
                  navigate(
                    `/magic/${created.code}`
                  )
                }
              >
                View product
              </button>

              <button
                className={btnClass(
                  "outline",
                  "md",
                  "flex-1"
                )}
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Dashboard
              </button>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-mint/40 pb-24 pt-28">
      <Container className="max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand">
            Free seller workspace
          </p>

          <h1 className="mt-4 text-4xl text-deep sm:text-5xl">
            Start selling today.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-forest/65">
            No Premium subscription is required.
            Create your seller profile, list your
            product and start accepting M-Pesa
            payments.
          </p>
        </div>

        <div className="mt-8 rounded-[32px] border border-forest/10 bg-white p-6 sm:p-8">
          {step === 1 && (
            <>
              <div className="mb-8 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep font-extrabold text-gold">
                  1
                </span>

                <div>
                  <h2 className="text-2xl text-deep">
                    Set up your free seller profile
                  </h2>

                  <p className="text-sm text-forest/60">
                    Your payout number is used for
                    seller settlements.
                  </p>
                </div>
              </div>

              {profileLoading && (
                <div className="mb-5 rounded-2xl bg-mint/60 p-4 text-sm font-semibold text-forest">
                  Loading your existing seller profile…
                </div>
              )}

              <div className="grid gap-5">
                <Field label="Seller handle">
                  <input
                    value={handle}
                    onChange={(e) =>
                      setHandle(
                        e.target.value
                          .toLowerCase()
                          .replace(
                            /[^a-z0-9_]/g,
                            ""
                          )
                      )
                    }
                    placeholder="myshop"
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-forest/55">
                    Your seller handle identifies your
                    seller account on UzaLink.
                  </p>
                </Field>

                <Field label="M-Pesa payout number">
                  <input
                    inputMode="tel"
                    value={paymentNumber}
                    onChange={(e) =>
                      setPaymentNumber(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10)
                      )
                    }
                    placeholder="0712345678"
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-forest/55">
                    This is where your available seller
                    balance will be paid out.
                  </p>
                </Field>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <button
                disabled={
                  busy ||
                  profileLoading
                }
                onClick={saveProfile}
                className={btnClass(
                  "gold",
                  "xl",
                  "mt-7 w-full"
                )}
              >
                {busy
                  ? "Saving securely…"
                  : "Continue to Product"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep font-extrabold text-gold">
                    2
                  </span>

                  <div>
                    <h2 className="text-2xl text-deep">
                      Create your product
                    </h2>

                    <p className="text-sm text-forest/60">
                      Your product will be stored
                      securely.
                    </p>
                  </div>
                </div>

                <button
                  className="text-sm font-bold text-brand"
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                >
                  Edit profile
                </button>
              </div>

              <div className="grid gap-5">
                <div>
                  <p className="text-sm font-bold text-deep">
                    Product type
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {PRODUCT_TYPES.map((t) => (
                      <button
                        key={t.type}
                        onClick={() =>
                          setType(t.type)
                        }
                        className={`rounded-2xl border-2 p-4 text-left ${
                          type === t.type
                            ? "border-brand bg-mint"
                            : "border-forest/10"
                        }`}
                      >
                        <span className="text-2xl">
                          {t.emoji}
                        </span>

                        <p className="mt-2 text-sm font-extrabold text-deep">
                          {t.type}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <Field label="Product name">
                  <input
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    rows={5}
                    className={inputClass}
                  />
                </Field>

                <Field label="Category">
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Select category
                    </option>

                    {CATEGORIES.map((c) => (
                      <option key={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Price (KSh)">
                    <input
                      inputMode="numeric"
                      value={price}
                      onChange={(e) =>
                        setPrice(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Inventory (optional)">
                    <input
                      inputMode="numeric"
                      value={inventory}
                      onChange={(e) =>
                        setInventory(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div>
                  <p className="text-sm font-bold text-deep">
                    Private product file
                  </p>

                  <input
                    ref={ref}
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setFile(
                        e.target.files?.[0] ||
                          null
                      )
                    }
                  />

                  <button
                    onClick={() =>
                      ref.current?.click()
                    }
                    className={btnClass(
                      "outline",
                      "md",
                      "mt-2"
                    )}
                  >
                    Upload private file
                  </button>

                  {file && (
                    <p className="mt-2 text-sm text-forest/60">
                      {file.name} ·{" "}
                      {(
                        file.size /
                        1024 /
                        1024
                      ).toFixed(1)}{" "}
                      MB
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-7 rounded-2xl border border-brand/10 bg-mint/60 p-4">
                <p className="font-extrabold text-deep">
                  UzaLink commission
                </p>

                <p className="mt-1 text-sm text-forest/65">
                  UzaLink takes 5% from each successful
                  sale. You receive the remaining 95%
                  in your seller balance.
                </p>
              </div>

              <button
                disabled={busy}
                onClick={submit}
                className={btnClass(
                  "gold",
                  "xl",
                  "mt-5 w-full"
                )}
              >
                {busy
                  ? "Creating securely…"
                  : "Create My Magic Link"}
              </button>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

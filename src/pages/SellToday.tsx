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
  CATEGORIES,
} from "@/lib/data";

import { api } from "@/lib/api";

import { useAuth } from "@/lib/auth";

import { navigate } from "@/lib/router";

export function SellToday() {
  const { user, loading } = useAuth();

  const [step, setStep] = useState(1);

  const [handle, setHandle] = useState("");
  const [paymentNumber, setPaymentNumber] =
    useState("");

  const [profileLoading, setProfileLoading] =
    useState(false);

  // =========================
  // BOOK DETAILS
  // =========================

  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] =
    useState("");
  const [description, setDescription] =
    useState("");
  const [category, setCategory] =
    useState("");
  const [price, setPrice] = useState("");

  const [bookFile, setBookFile] =
    useState<File | null>(null);

  const [coverFile, setCoverFile] =
    useState<File | null>(null);

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState("");

  const [created, setCreated] =
    useState<any>();

  const bookFileRef =
    useRef<HTMLInputElement>(null);

  const coverFileRef =
    useRef<HTMLInputElement>(null);

  /**
   * ======================================================
   * LOAD SELLER PROFILE
   * ======================================================
   *
   * Existing seller authentication and payout
   * functionality remains unchanged.
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

  /**
   * ======================================================
   * LOADING
   * ======================================================
   */
  if (loading) {
    return (
      <section className="min-h-screen bg-mint/40 pt-32">
        <Container className="text-center">
          Loading author access…
        </Container>
      </section>
    );
  }

  /**
   * ======================================================
   * NOT LOGGED IN
   * ======================================================
   */
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
              Start selling your books
            </h1>

            <p className="mt-3 text-forest/65">
              Get a secure Magic Link and create
              your author account. Premium is
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
              Get Free Author Login
            </button>
          </div>
        </Container>
      </section>
    );
  }

  /**
   * ======================================================
   * SELLER ACCESS REQUIRED
   * ======================================================
   */
  if (
    user.role !== "SELLER" &&
    user.role !== "ADMIN"
  ) {
    return (
      <section className="min-h-screen bg-mint/40 pt-32">
        <Container className="max-w-xl">
          <div className="rounded-3xl bg-white p-8 text-center">
            <h1 className="text-3xl text-deep">
              Author access required
            </h1>

            <p className="mt-3 text-forest/65">
              Sign in using the Author Magic
              Login to list your books.
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
              Author Magic Login
            </button>
          </div>
        </Container>
      </section>
    );
  }

  /**
   * ======================================================
   * SAVE AUTHOR PROFILE
   * ======================================================
   */
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
        "Your author handle must be 3–30 characters using lowercase letters, numbers or underscores."
      );

      return;
    }

    if (!cleanPaymentNumber) {
      setError(
        "Enter the M-Pesa number where your book-sale earnings will be settled."
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
          : "Could not save author profile."
      );
    } finally {
      setBusy(false);
    }
  };

  /**
   * ======================================================
   * CREATE BOOK
   * ======================================================
   */
  const submit = async () => {
    setError("");

    if (
      title.trim().length < 3 ||
      authorName.trim().length < 2 ||
      description.trim().length < 12 ||
      !category ||
      Number(price) < 50
    ) {
      setError(
        "Complete the book title, author name, description, category and a price of at least KSh 50."
      );

      return;
    }

    if (!bookFile) {
      setError(
        "Please upload the digital book file."
      );

      return;
    }

    setBusy(true);

    try {
      const fd = new FormData();

      /*
       * The backend currently expects "name".
       * We send the book title through that field
       * so the existing API remains compatible.
       */
      fd.append(
        "name",
        title.trim()
      );

      fd.append(
        "description",
        description.trim()
      );

      fd.append(
        "category",
        category
      );

      /*
       * Books are currently represented as
       * digital products in the existing backend.
       */
      fd.append(
        "kind",
        "DIGITAL"
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
        "true"
      );

      /*
       * Secure download controls.
       */
      fd.append(
        "downloadLimit",
        "5"
      );

      fd.append(
        "expiresHours",
        "72"
      );

      /*
       * Author information is included in the
       * FormData for future backend support.
       *
       * If the current backend ignores unknown
       * fields, this remains backwards compatible.
       */
      fd.append(
        "authorName",
        authorName.trim()
      );

      /*
       * Main digital book file.
       */
      fd.append(
        "file",
        bookFile
      );

      /*
       * The current backend accepts one multipart file:
       * the private digital book. The cover UI is retained
       * for the next cover-persistence update, but it is not
       * submitted yet because multer only accepts "file".
       */

      const result =
        await api.createProduct(fd);

      setCreated(result.product);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not create book listing."
      );
    } finally {
      setBusy(false);
    }
  };

  /**
   * ======================================================
   * BOOK CREATED
   * ======================================================
   */
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
              Book listing created
            </h1>

            <p className="mt-3 text-forest/65">
              Your book is now live and ready
              for readers to purchase.
            </p>

            <div className="mt-6 rounded-2xl bg-mint p-4 font-mono text-sm break-all">
              {location.origin}
              /#/magic/
              {created.code}
            </div>

            <div className="mt-6 rounded-2xl border border-forest/10 bg-white p-5 text-left">
              <p className="text-xs font-bold uppercase tracking-wide text-forest/50">
                Your book earnings
              </p>

              <p className="mt-2 text-lg font-extrabold text-deep">
                You receive 95% of every successful
                book sale.
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
                View Book
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
                Author Dashboard
              </button>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  /**
   * ======================================================
   * MAIN AUTHOR WORKSPACE
   * ======================================================
   */
  return (
    <section className="min-h-screen bg-mint/40 pb-24 pt-28">
      <Container className="max-w-4xl">

        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand">
            Author workspace
          </p>

          <h1 className="mt-4 text-4xl text-deep sm:text-5xl">
            Sell your book online.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-forest/65">
            Create your author profile, publish
            your book and start accepting M-Pesa
            payments from readers.
          </p>
        </div>

        <div className="mt-8 rounded-[32px] border border-forest/10 bg-white p-6 sm:p-8">

          {/* =================================================
              STEP 1 — AUTHOR PROFILE
          ================================================== */}
          {step === 1 && (
            <>
              <div className="mb-8 flex items-center gap-3">

                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep font-extrabold text-gold">
                  1
                </span>

                <div>
                  <h2 className="text-2xl text-deep">
                    Set up your author profile
                  </h2>

                  <p className="text-sm text-forest/60">
                    Your M-Pesa number is used for
                    your book-sale settlements.
                  </p>
                </div>
              </div>

              {profileLoading && (
                <div className="mb-5 rounded-2xl bg-mint/60 p-4 text-sm font-semibold text-forest">
                  Loading your existing author
                  profile…
                </div>
              )}

              <div className="grid gap-5">

                <Field label="Author handle">
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
                    placeholder="mybooks"
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-forest/55">
                    This identifies your author
                    account on UzaLink.
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
                    Your book-sale earnings will
                    be paid to this number.
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
                  : "Continue to Book"}
              </button>
            </>
          )}

          {/* =================================================
              STEP 2 — BOOK
          ================================================== */}
          {step === 2 && (
            <>
              <div className="mb-8 flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-deep font-extrabold text-gold">
                    2
                  </span>

                  <div>
                    <h2 className="text-2xl text-deep">
                      Publish your book
                    </h2>

                    <p className="text-sm text-forest/60">
                      Add your book details and
                      digital file.
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

                {/* BOOK TITLE */}
                <Field label="Book title">
                  <input
                    value={title}
                    onChange={(e) =>
                      setTitle(
                        e.target.value
                      )
                    }
                    placeholder="Enter your book title"
                    className={inputClass}
                  />
                </Field>

                {/* AUTHOR */}
                <Field label="Author name">
                  <input
                    value={authorName}
                    onChange={(e) =>
                      setAuthorName(
                        e.target.value
                      )
                    }
                    placeholder="Your full author name"
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-forest/55">
                    This is the name readers will
                    see on your book listing.
                  </p>
                </Field>

                {/* DESCRIPTION */}
                <Field label="Book description">
                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    rows={6}
                    placeholder="Tell readers what your book is about..."
                    className={inputClass}
                  />
                </Field>

                {/* CATEGORY */}
                <Field label="Book category">
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
                      Select book category
                    </option>

                    {CATEGORIES.map((c) => (
                      <option key={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* PRICE */}
                <Field label="Book price (KSh)">
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
                    placeholder="e.g. 500"
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-forest/55">
                    Minimum book price is KSh 50.
                  </p>
                </Field>

                {/* COVER */}
                <div>
                  <p className="text-sm font-bold text-deep">
                    Book cover
                  </p>

                  <p className="mt-1 text-xs text-forest/55">
                    Upload the cover readers will
                    associate with your book.
                  </p>

                  <input
                    ref={coverFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setCoverFile(
                        e.target.files?.[0] ||
                          null
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      coverFileRef.current?.click()
                    }
                    className={btnClass(
                      "outline",
                      "md",
                      "mt-3"
                    )}
                  >
                    Upload book cover
                  </button>

                  {coverFile && (
                    <p className="mt-2 text-sm text-forest/60">
                      {coverFile.name} ·{" "}
                      {(
                        coverFile.size /
                        1024 /
                        1024
                      ).toFixed(1)}{" "}
                      MB
                    </p>
                  )}
                </div>

                {/* BOOK FILE */}
                <div>
                  <p className="text-sm font-bold text-deep">
                    Digital book file
                  </p>

                  <p className="mt-1 text-xs text-forest/55">
                    Upload the file readers will
                    receive after successful payment.
                  </p>

                  <input
                    ref={bookFileRef}
                    type="file"
                    accept=".pdf,.epub,.mobi,.azw,.azw3"
                    className="hidden"
                    onChange={(e) =>
                      setBookFile(
                        e.target.files?.[0] ||
                          null
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      bookFileRef.current?.click()
                    }
                    className={btnClass(
                      "outline",
                      "md",
                      "mt-3"
                    )}
                  >
                    Upload digital book
                  </button>

                  {bookFile && (
                    <p className="mt-2 text-sm text-forest/60">
                      {bookFile.name} ·{" "}
                      {(
                        bookFile.size /
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

              {/* COMMISSION */}
              <div className="mt-7 rounded-2xl border border-brand/10 bg-mint/60 p-4">
                <p className="font-extrabold text-deep">
                  Your book-sale earnings
                </p>

                <p className="mt-1 text-sm text-forest/65">
                  UzaLink takes 5% from each
                  successful book sale. You receive
                  the remaining 95% in your author
                  balance.
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
                  ? "Publishing securely…"
                  : "Publish My Book"}
              </button>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}

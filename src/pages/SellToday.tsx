import { useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import {
  CATEGORIES,
  PRODUCT_TYPES,
  SELLER_STEPS,
  commissionOf,
  formatKsh,
  sellerOf,
  type Product,
  type ProductType,
} from "@/lib/data";
import { addCreatedProduct, randomCode } from "@/lib/store";
import { Link, navigate } from "@/lib/router";
import { Icon } from "@/components/Icon";
import {
  Badge,
  Container,
  Eyebrow,
  Field,
  Reveal,
  btnClass,
  inputClass,
} from "@/components/ui";
import { CopyField, QrCode, ShareChannels, useCopy } from "@/components/ShareSheet";

const SAMPLE_IMAGES = [
  "https://images.pexels.com/photos/19882424/pexels-photo-19882424.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/1212048/pexels-photo-1212048.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
  "https://images.pexels.com/photos/9557122/pexels-photo-9557122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
];

type Draft = {
  type: ProductType | null;
  name: string;
  description: string;
  category: string;
  image: string;
  file: string | null;
  price: string;
  payNumber: string;
  payConfirm: string;
  ownershipVerified: boolean;
  locked: boolean;
};

const EMPTY: Draft = {
  type: null,
  name: "",
  description: "",
  category: "",
  image: "",
  file: null,
  price: "",
  payNumber: "",
  payConfirm: "",
  ownershipVerified: false,
  locked: false,
};

const digitsOnly = (v: string) => v.replace(/\D/g, "").slice(0, 10);

function StepDots({ step }: { step: number }) {
  return (
    <div className="sticky top-[68px] z-30 -mx-4 mb-8 border-b border-forest/10 bg-white/90 px-4 py-3 backdrop-blur-xl sm:top-[76px] sm:mx-0 sm:rounded-2xl sm:border sm:border-forest/10 sm:px-4">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {SELLER_STEPS.map((s) => {
          const done = s.id < step;
          const active = s.id === step;
          return (
            <div key={s.id} className="flex shrink-0 items-center gap-1.5">
              <span
                className={cn(
                  "flex h-9 items-center gap-2 rounded-full px-3 text-[12.5px] font-extrabold transition-colors",
                  active
                    ? "bg-deep text-white"
                    : done
                      ? "bg-mint text-brand"
                      : "bg-forest/5 text-forest/45",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px]",
                    active ? "bg-gold text-deep" : done ? "bg-brand text-white" : "bg-forest/10",
                  )}
                >
                  {done ? <Icon name="check" className="h-3 w-3" strokeWidth={3} /> : s.id}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </span>
              {s.id < SELLER_STEPS.length && (
                <span
                  className={cn(
                    "h-1 w-4 rounded-full sm:w-7",
                    done ? "bg-brand" : "bg-forest/10",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SellToday() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [code, setCode] = useState<string | null>(null);
  const [expectCode, setExpectCode] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const { copy, copied } = useCopy();

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const priceNumber = Number(draft.price || 0);
  const link = code ? `uzalink.co.ke/magic/${code}` : "";
  const isDigital = PRODUCT_TYPES.find((t) => t.type === draft.type)?.digital ?? false;

  const shareMessage = useMemo(
    () =>
      `${draft.name || "My product"} — ${formatKsh(priceNumber)} on UZALINK. Pay by M-Pesa and get it instantly:`,
    [draft.name, priceNumber],
  );

  /* ------------------------- validation ------------------------- */
  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1 && !draft.type) e.type = "Choose what you are selling to continue.";
    if (s === 2) {
      if (draft.name.trim().length < 3) e.name = "Give your product a clear name.";
      if (draft.description.trim().length < 12)
        e.description = "Add a short description (at least 12 characters).";
      if (!draft.category) e.category = "Pick a category.";
    }
    if (s === 3) {
      if (!draft.price || Number(draft.price) < 50) e.price = "Enter a price of KSh 50 or more.";
    }
    if (s === 4) {
      if (digitsOnly(draft.payNumber).length !== 10)
        e.payNumber = "Enter a valid 10-digit M-Pesa/payment number.";
      else if (draft.payNumber !== draft.payConfirm)
        e.payConfirm = "The two numbers do not match. Please double-check.";
      else if (!draft.ownershipVerified)
        e.otp = "Verify ownership of this number to continue.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(5, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generate = () => {
    const newCode = randomCode();
    const product: Product = {
      code: newCode,
      name: draft.name.trim(),
      seller: "Your Store",
      handle: "@yourstore",
      sellerAvatarSeed: "YS",
      type: (draft.type ?? "Other") as ProductType,
      category: draft.category || "Other",
      description:
        draft.description.trim().slice(0, 120) || "A brand new UZALINK product.",
      longDescription: draft.description.trim(),
      price: priceNumber,
      image:
        draft.image ||
        "https://images.pexels.com/photos/4959935/pexels-photo-4959935.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      delivery: isDigital ? "Instant delivery after verification" : "Delivery details shared by seller",
      rating: 5,
      sales: 0,
      instant: isDigital,
      badge: "New",
    };
    addCreatedProduct(product);
    setCode(newCode);
    setStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sendOtp = () => {
    if (digitsOnly(draft.payNumber).length !== 10) {
      setErrors({ payNumber: "Enter a valid 10-digit M-Pesa/payment number." });
      return;
    }
    if (draft.payNumber !== draft.payConfirm) {
      setErrors({ payConfirm: "The two numbers do not match. Please double-check." });
      return;
    }
    const generated = String(Math.floor(1000 + Math.random() * 9000));
    setExpectCode(generated);
    setOtp("");
    setErrors({});
  };

  const confirmOtp = () => {
    if (otp.trim() === expectCode) {
      setDraft((d) => ({ ...d, ownershipVerified: true, locked: true }));
      setErrors({});
    } else {
      setErrors({ otp: "That code does not match. Request a new code." });
    }
  };

  const onImagePicked = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("image", String(reader.result));
    reader.readAsDataURL(file);
  };

  /* ------------------------- success screen ------------------------- */
  if (step === 5 && code) {
    return (
      <section className="min-h-screen bg-mint/50 pb-24 pt-28 sm:pt-32">
        <Container className="max-w-3xl">
          <div className="text-center">
            <span className="mx-auto flex h-16 w-16 animate-pop items-center justify-center rounded-3xl gold-gradient text-deep shadow-lg shadow-gold/40">
              <Icon name="checkCircle" className="h-9 w-9" />
            </span>
            <h1 className="mt-6 text-[34px] leading-tight text-deep sm:text-[46px]">
              Your Magic Link is Ready!
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-forest/75">
              {draft.name} is live at {formatKsh(priceNumber)}. Share it anywhere — buyers open it,
              pay by M-Pesa and receive their product. No account was needed to make this.
            </p>
          </div>

          <div className="mt-9 rounded-[32px] border border-forest/10 bg-white p-5 shadow-[0_30px_70px_-45px_rgba(4,40,26,0.55)] sm:p-7">
            <CopyField value={link} />

            <div className="mt-7">
              <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-forest/55">
                Share Link
              </p>
              <ShareChannels link={link} message={shareMessage} />
            </div>

            <div className="mt-7 flex flex-col items-center gap-6 rounded-3xl bg-mint/60 p-5 sm:flex-row sm:items-center">
              <QrCode value={link} size={150} />
              <div className="text-center sm:text-left">
                <p className="text-[17px] font-extrabold text-deep">Print it. Stick it. Sell.</p>
                <p className="mt-2 text-[14px] leading-relaxed text-forest/70">
                  Your QR code works on posters, car stickers, duuka windows and market tables.
                  Anyone who scans lands straight on your product.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <Badge tone="card" icon="lock">
                    Payment number locked
                  </Badge>
                  <Badge tone="card" icon="wallet">
                    95% to you
                  </Badge>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                copy(`https://${link}`);
                window.open(`https://wa.me/?text=${encodeURIComponent(`${shareMessage} https://${link}`)}`, "_blank");
              }}
              className={btnClass("gold", "xl", "mt-7 w-full")}
            >
              <Icon name="whatsapp" className="h-5.5 w-5.5" />
              {copied ? "Link copied — finishing share…" : "Share & Start Selling"}
            </button>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <Link to={`/magic/${code}`} className={btnClass("deep", "lg", "w-full")}>
                View product page
                <Icon name="eye" className="h-5 w-5" />
              </Link>
              <Link to="/explore" className={btnClass("outline", "lg", "w-full")}>
                Explore Us
                <Icon name="compass" className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start gap-4 rounded-3xl border border-forest/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[15px] font-extrabold text-deep">
                Ready to track sales, earnings & settlements?
              </p>
              <p className="mt-1 text-[13.5px] text-forest/70">
                Premium is {formatKsh(1000)}/month and starts with a passwordless Seller Magic Login.
              </p>
            </div>
            <Link to="/seller-login" className={btnClass("mint", "md", "shrink-0")}>
              Seller Magic Login
              <Icon name="key" className="h-4.5 w-4.5" />
            </Link>
          </div>

          <button
            onClick={() => {
              setDraft(EMPTY);
              setCode(null);
              setStep(1);
              navigate("/sell");
              window.scrollTo({ top: 0 });
            }}
            className="mx-auto mt-7 flex items-center gap-2 text-[14px] font-bold text-forest/60 transition-colors hover:text-brand"
          >
            <Icon name="plus" className="h-4 w-4" />
            Create another product
          </button>
        </Container>
      </section>
    );
  }

  /* ------------------------- wizard ------------------------- */
  return (
    <section className="min-h-screen bg-mint/40 pb-24 pt-28 sm:pt-32">
      <Container className="max-w-4xl">
        <div className="text-center">
          <Eyebrow icon="bolt">Sell Today · No account required</Eyebrow>
          <h1 className="mt-5 text-[34px] leading-[1.03] text-deep sm:text-[50px]">
            Create Your Product.
            <br />
            <span className="text-brand">Get Your Magic Link.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-forest/75">
            No account required. Create your product, set your price, add your payment number and
            start selling.
          </p>
        </div>

        <div className="mt-8">
          <StepDots step={step} />
        </div>

        <div className="rounded-[32px] border border-forest/10 bg-white p-5 shadow-[0_30px_70px_-45px_rgba(4,40,26,0.5)] sm:p-8">
          {/* ---------------- STEP 1 ---------------- */}
          {step === 1 && (
            <div className="animate-fade-up">
              <h2 className="text-[24px] text-deep sm:text-[30px]">
                Step 1 — Choose product type
              </h2>
              <p className="mt-2.5 text-[14.5px] text-forest/70">
                What are you selling? This decides how your product is delivered.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PRODUCT_TYPES.map((t) => {
                  const active = draft.type === t.type;
                  return (
                    <button
                      key={t.type}
                      onClick={() => {
                        set("type", t.type);
                        setErrors({});
                      }}
                      className={cn(
                        "flex h-full flex-col items-start rounded-3xl border-2 p-4 text-left transition-all duration-200",
                        active
                          ? "border-brand bg-mint shadow-[0_18px_40px_-28px_rgba(14,140,70,0.9)]"
                          : "border-forest/10 bg-white hover:-translate-y-0.5 hover:border-brand/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-2xl text-[22px]",
                          active ? "bg-white" : "bg-mint",
                        )}
                      >
                        {t.emoji}
                      </span>
                      <span className="mt-3 text-[14.5px] font-extrabold leading-tight text-deep">
                        {t.type}
                      </span>
                      <span className="mt-1.5 text-[11.5px] leading-snug text-forest/60">
                        {t.blurb}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.type && (
                <p className="mt-4 flex items-center gap-2 text-[13.5px] font-semibold text-red-600">
                  <Icon name="alert" className="h-4 w-4" />
                  {errors.type}
                </p>
              )}
            </div>
          )}

          {/* ---------------- STEP 2 ---------------- */}
          {step === 2 && (
            <div className="animate-fade-up">
              <h2 className="text-[24px] text-deep sm:text-[30px]">Step 2 — Add product details</h2>
              <p className="mt-2.5 text-[14.5px] text-forest/70">
                Clear names and real photos sell fastest on WhatsApp and TikTok.
              </p>

              <div className="mt-6 grid gap-5">
                <Field label="Product Name" required error={errors.name}>
                  <input
                    value={draft.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Homemade Pilau Masala 250g"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Description"
                  required
                  hint="What is included, sizes, delivery or usage. Buyers read this before paying."
                  error={errors.description}
                >
                  <textarea
                    value={draft.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={4}
                    placeholder="Tell buyers exactly what they get…"
                    className={cn(inputClass, "resize-none")}
                  />
                </Field>

                <Field label="Category" required error={errors.category}>
                  <div className="relative">
                    <select
                      value={draft.category}
                      onChange={(e) => set("category", e.target.value)}
                      className={cn(inputClass, "appearance-none pr-11")}
                    >
                      <option value="">Select a category…</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name="chevronDown"
                      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest/45"
                    />
                  </div>
                </Field>

                <div>
                  <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-deep">
                    Product Image
                  </p>
                  <div className="mt-2 flex flex-col gap-4 rounded-3xl border-2 border-dashed border-forest/15 bg-mint/40 p-4 sm:flex-row sm:items-center">
                    <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-forest/10 bg-white sm:w-36">
                      {draft.image ? (
                        <img src={draft.image} alt="Product preview" className="h-full w-full object-cover" />
                      ) : (
                        <Icon name="image" className="h-8 w-8 text-forest/30" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        ref={imageRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onImagePicked(e.target.files?.[0])}
                      />
                      <button
                        onClick={() => imageRef.current?.click()}
                        className={btnClass("deep", "md", "w-full sm:w-auto")}
                      >
                        <Icon name="upload" className="h-4.5 w-4.5" />
                        Upload photo
                      </button>
                      <p className="mt-2 text-[12.5px] text-forest/60">
                        JPG or PNG. Square images look best on the product page.
                      </p>
                      <div className="mt-3">
                        <p className="text-[11.5px] font-bold uppercase tracking-wide text-forest/50">
                          Or use a sample image
                        </p>
                        <div className="mt-2 flex gap-2">
                          {SAMPLE_IMAGES.map((src) => (
                            <button
                              key={src}
                              onClick={() => set("image", src)}
                              className={cn(
                                "h-12 w-12 overflow-hidden rounded-xl border-2 transition-all",
                                draft.image === src
                                  ? "border-brand ring-2 ring-brand/25"
                                  : "border-white hover:border-forest/25",
                              )}
                            >
                              <img src={src} alt="Sample" className="h-full w-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-deep">
                    Upload Product / File
                    <span className="rounded-full bg-mint px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wide text-brand">
                      {isDigital ? "Recommended" : "Optional"}
                    </span>
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => set("file", e.target.files?.[0]?.name ?? null)}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="mt-2 flex w-full items-center gap-3 rounded-3xl border-2 border-forest/12 bg-white px-4 py-4 text-left transition-colors hover:border-brand/40"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint text-brand">
                      <Icon name={draft.file ? "file" : "upload"} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-extrabold text-deep">
                        {draft.file ?? (isDigital ? "Add the file buyers will receive" : "Attach delivery instructions, invoice or menu")}
                      </span>
                      <span className="block text-[12.5px] text-forest/60">
                        {isDigital
                          ? "PDF, ZIP, MP3, MP4 — delivered automatically after payment verification."
                          : "Attached securely to this product only."}
                      </span>
                    </span>
                    <Icon name="chevronRight" className="h-5 w-5 shrink-0 text-forest/35" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- STEP 3 ---------------- */}
          {step === 3 && (
            <div className="animate-fade-up">
              <h2 className="text-[24px] text-deep sm:text-[30px]">Step 3 — Set your price</h2>
              <p className="mt-2.5 text-[14.5px] text-forest/70">
                You keep 95% of every sale. UZALINK charges 5% commission.
              </p>

              <div className="mt-6 rounded-3xl border-2 border-forest/10 bg-mint/40 p-5">
                <p className="text-[13.5px] font-bold text-deep">Selling Price</p>
                <div className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-forest/12 bg-white px-4 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/12">
                  <span className="flex items-center gap-1.5 border-r border-forest/10 pr-3 text-[17px] font-extrabold text-deep">
                    <Icon name="tag" className="h-4.5 w-4.5 text-brand" />
                    KSh
                  </span>
                  <input
                    inputMode="numeric"
                    value={draft.price}
                    onChange={(e) => set("price", digitsOnly(e.target.value))}
                    placeholder="1000"
                    className="h-14 w-full bg-transparent text-[26px] font-extrabold text-deep outline-none placeholder:text-forest/25"
                  />
                </div>
                {errors.price && (
                  <p className="mt-3 flex items-center gap-2 text-[13.5px] font-semibold text-red-600">
                    <Icon name="alert" className="h-4 w-4" />
                    {errors.price}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {[300, 500, 1000, 2500, 5000].map((p) => (
                    <button
                      key={p}
                      onClick={() => set("price", String(p))}
                      className={cn(
                        "rounded-full border-2 px-4 py-2 text-[13px] font-extrabold transition-all",
                        draft.price === String(p)
                          ? "border-deep bg-deep text-white"
                          : "border-forest/12 bg-white text-forest/75 hover:border-brand/40",
                      )}
                    >
                      {formatKsh(p)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-2.5">
                {[
                  { label: "Product price", value: priceNumber },
                  { label: "UZALINK commission (5%)", value: commissionOf(priceNumber), minus: true },
                  { label: "Your seller balance (95%)", value: sellerOf(priceNumber), strong: true },
                ].map((r) => (
                  <div
                    key={r.label}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-5 py-4",
                      r.strong ? "brand-gradient text-white" : "border border-forest/10 bg-white",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[13.5px] font-bold",
                        r.strong ? "text-white/85" : "text-forest/70",
                      )}
                    >
                      {r.minus ? "− " : ""}
                      {r.label}
                    </span>
                    <span
                      className={cn(
                        "text-[18px] font-extrabold",
                        r.strong ? "text-gold" : "text-deep",
                      )}
                    >
                      {formatKsh(r.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------- STEP 4 ---------------- */}
          {step === 4 && (
            <div className="animate-fade-up">
              <h2 className="text-[24px] text-deep sm:text-[30px]">Step 4 — Set Your Payment Number</h2>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-forest/75">
                Enter your M-Pesa/payment number exactly as registered and intended for receiving
                your UZALINK settlements.
              </p>

              <div className="mt-6 rounded-3xl border-2 border-gold bg-goldsoft p-5">
                <p className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.14em] text-[#8a6300]">
                  <Icon name="alert" className="h-4.5 w-4.5" />
                  Important
                </p>
                <p className="mt-3 text-[16.5px] font-extrabold leading-snug text-[#6d4f00]">
                  Payment numbers cannot be changed after setup.
                </p>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#7a5a00]">
                  Please double-check the number before continuing. Your settlements are sent to
                  this number, so it locks once verified to protect your earnings.
                </p>
              </div>

              <div className="mt-6 grid gap-5">
                <Field
                  label="Payment phone number"
                  required
                  hint="10 digits, starting with 07… or 01…"
                  error={errors.payNumber}
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold text-forest/45">
                      +254
                    </span>
                    <input
                      inputMode="numeric"
                      value={draft.payNumber}
                      onChange={(e) => set("payNumber", digitsOnly(e.target.value))}
                      placeholder="0712 345 678"
                      className={cn(inputClass, "pl-[68px] text-[17px] font-extrabold tracking-wide")}
                      disabled={draft.locked}
                    />
                  </div>
                </Field>

                <Field
                  label="Confirm payment phone number"
                  required
                  hint="Type it again — both entries must match exactly."
                  error={errors.payConfirm}
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold text-forest/45">
                      +254
                    </span>
                    <input
                      inputMode="numeric"
                      value={draft.payConfirm}
                      onChange={(e) => set("payConfirm", digitsOnly(e.target.value))}
                      placeholder="0712 345 678"
                      className={cn(inputClass, "pl-[68px] text-[17px] font-extrabold tracking-wide")}
                      disabled={draft.locked}
                    />
                    {draft.payConfirm.length > 0 && !draft.locked && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        {draft.payConfirm === draft.payNumber ? (
                          <Icon name="checkCircle" className="h-5 w-5 text-brand" />
                        ) : (
                          <Icon name="alert" className="h-5 w-5 text-golddeep" />
                        )}
                      </span>
                    )}
                  </div>
                </Field>

                {/* ownership verification */}
                {!draft.locked ? (
                  <div className="rounded-3xl border border-forest/10 bg-mint/50 p-5">
                    <p className="flex items-center gap-2 text-[14px] font-extrabold text-deep">
                      <Icon name="shield" className="h-5 w-5 text-brand" />
                      Payment-number ownership verification
                    </p>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-forest/70">
                      Where technically supported, UZALINK verifies that you own this number with a
                      short code before it locks.
                    </p>

                    {!expectCode ? (
                      <button onClick={sendOtp} className={btnClass("deep", "md", "mt-4")}>
                        Send verification code
                        <Icon name="sms" className="h-4.5 w-4.5" />
                      </button>
                    ) : (
                      <div className="mt-4">
                        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-forest/10 bg-white px-4 py-3">
                          <Icon name="sms" className="h-5 w-5 text-brand" />
                          <p className="text-[13.5px] text-forest/75">
                            Demo code sent to{" "}
                            <span className="font-extrabold text-deep">+254 {draft.payNumber}</span>
                          </p>
                          <span className="ml-auto rounded-lg bg-mint px-2.5 py-1 font-mono text-[14px] font-extrabold tracking-[0.2em] text-brand">
                            {expectCode}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <input
                            value={otp}
                            inputMode="numeric"
                            onChange={(e) => setOtp(digitsOnly(e.target.value).slice(0, 4))}
                            placeholder="Enter 4-digit code"
                            className={cn(inputClass, "flex-1 tracking-[0.3em]")}
                          />
                          <button onClick={confirmOtp} className={btnClass("gold", "md", "shrink-0")}>
                            Verify number
                          </button>
                        </div>
                        {errors.otp && (
                          <p className="mt-3 flex items-center gap-2 text-[13.5px] font-semibold text-red-600">
                            <Icon name="alert" className="h-4 w-4" />
                            {errors.otp}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 rounded-3xl border-2 border-brand/30 bg-mint p-5 sm:flex-row sm:items-center">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-brand">
                      <Icon name="lock" className="h-7 w-7" />
                    </span>
                    <div className="flex-1">
                      <p className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-forest/55">
                        Verified Payment Number
                      </p>
                      <p className="mt-1.5 flex flex-wrap items-center gap-2.5 text-[24px] font-extrabold text-deep">
                        +254 {draft.payNumber}
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-deep px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-white">
                          <Icon name="lock" className="h-3.5 w-3.5 text-gold" />
                          Locked
                        </span>
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-forest/70">
                        Ownership verified. This number is now locked to your account for settlement
                        security and cannot be edited from this flow.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------------- STEP 5 ---------------- */}
          {step === 5 && (
            <div className="animate-fade-up text-center">
              <h2 className="text-[24px] text-deep sm:text-[30px]">Step 5 — Generate Magic Link</h2>
              <p className="mx-auto mt-2.5 max-w-xl text-[14.5px] leading-relaxed text-forest/70">
                Everything checks out. Generate your unique UZALINK URL and start sharing it
                immediately.
              </p>

              <div className="mt-7 grid gap-3 text-left sm:grid-cols-2">
                {[
                  { icon: "grid", label: draft.type ?? "Product type" },
                  { icon: "image", label: draft.name || "Product name" },
                  { icon: "tag", label: `${formatKsh(priceNumber)} · you keep ${formatKsh(sellerOf(priceNumber))}` },
                  {
                    icon: "lock",
                    label: `+254 ${draft.payNumber} · verified & locked`,
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center gap-3 rounded-2xl border border-forest/10 bg-mint/50 px-4 py-3.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand">
                      <Icon name={r.icon} className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13.5px] font-bold text-deep">
                      {r.label}
                    </span>
                    <Icon name="checkCircle" className="h-5 w-5 shrink-0 text-brand" />
                  </div>
                ))}
              </div>

              <div className="mt-8 overflow-hidden rounded-3xl brand-gradient p-6 text-white sm:p-8">
                <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-gold">
                  One tap to go
                </p>
                <p className="mt-3 text-[20px] font-extrabold leading-snug sm:text-[24px]">
                  Your Magic Link will look like this:
                </p>
                <p className="mt-4 inline-flex max-w-full items-center gap-2 overflow-hidden rounded-2xl bg-white/10 px-4 py-3 font-mono text-[13.5px] font-bold sm:text-[15px]">
                  <Icon name="link" className="h-4.5 w-4.5 shrink-0 text-gold" />
                  <span className="truncate">uzalink.co.ke/magic/••••••</span>
                </p>
                <button onClick={generate} className={btnClass("gold", "xl", "mt-7 w-full")}>
                  Generate Magic Link
                  <Icon name="arrowRight" className="h-5 w-5" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          )}

          {/* ---------------- nav ---------------- */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-forest/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            {step > 1 ? (
              <button
                onClick={back}
                className={btnClass("outline", "lg", "w-full sm:w-auto")}
              >
                <Icon name="arrowLeft" className="h-5 w-5" />
                Back
              </button>
            ) : (
              <Link to="/" className={btnClass("ghost", "lg", "w-full sm:w-auto")}>
                <Icon name="arrowLeft" className="h-5 w-5" />
                Home
              </Link>
            )}

            {step < 5 && (
              <button onClick={next} className={btnClass("gold", "xl", "w-full sm:w-auto")}>
                {step === 4 ? (draft.locked ? "Continue" : "Verify & continue") : "Continue"}
                <Icon name="arrowRight" className="h-5 w-5" strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>

        <Reveal>
          <p className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-3xl border border-forest/10 bg-white p-4 text-[13px] leading-relaxed text-forest/70">
            <Icon name="info" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand" />
            You are not creating an account. UZALINK only needs product details and a verified
            payment number to publish your Magic Link.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

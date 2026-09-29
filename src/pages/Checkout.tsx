import { useEffect, useState } from "react";
import { commissionOf, formatKsh, productByCode, type Product } from "@/lib/data";
import { Link } from "@/lib/router";
import { Icon } from "@/components/Icon";
import { Badge, Container, Field, btnClass, inputClass } from "@/components/ui";
import { api } from "@/lib/api";

const VERIFY_STEPS = ["M-Pesa payment confirmed", "Matching transaction reference", "Verifying amount received", "Crediting seller balance (95%)", "Preparing your purchase"];
function digitsOnly(value: string) { return value.replace(/\D/g, ""); }

export function Checkout({ code, product }: { code: string; product?: Product }) {
  const offer = product ?? productByCode(code);
  const [stage, setStage] = useState<"form" | "paying" | "success">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [accessError, setAccessError] = useState("");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!orderId || stage !== "paying") return;
    let cancelled = false;
    let attempts = 0;
    const check = async () => {
      try {
        const response = await api.order(orderId);
        const status = String(response?.order?.status ?? response?.status ?? "").toUpperCase();
        if (status === "PAID" || status === "FULFILLED") {
          setStep(VERIFY_STEPS.length - 1);
          try {
            const access = await api.downloadAccess(orderId, digitsOnly(phone));
            if (!cancelled) {
              setDownloadUrl(access?.url || "");
              setAccessError(access?.url ? "" : "Purchase confirmed. Fulfillment details will be available shortly.");
              setStage("success");
            }
          } catch (e: any) {
            if (!cancelled) { setAccessError(e?.message || "Payment confirmed. Fulfillment details will be prepared shortly."); setStage("success"); }
          }
          return;
        }
        if (["FAILED", "CANCELLED", "EXPIRED"].includes(status)) { setMessage(response?.order?.paymentError || response?.paymentError || "The M-Pesa payment could not be completed."); setStage("form"); return; }
        attempts += 1;
        setStep(Math.min(VERIFY_STEPS.length - 2, Math.floor(attempts / 2)));
        if (attempts < 40 && !cancelled) window.setTimeout(check, 3000);
        else if (!cancelled) { setMessage("We could not confirm the payment within the expected time. If money was deducted, keep your M-Pesa confirmation message and contact support."); setStage("form"); }
      } catch (e: any) {
        attempts += 1;
        if (attempts < 40 && !cancelled) window.setTimeout(check, 3000);
        else if (!cancelled) { setMessage(e?.message || "We could not confirm your payment. Please try again."); setStage("form"); }
      }
    };
    void check();
    return () => { cancelled = true; };
  }, [orderId, stage, phone]);

  if (!offer) return <main className="min-h-screen bg-mint/40 pb-16 pt-32"><Container className="max-w-2xl text-center"><h1 className="text-3xl font-extrabold text-deep">Offer unavailable</h1><p className="mt-3 text-forest/70">This offer could not be loaded. Return to the product page and try again.</p><Link to={`/magic/${code}`} className={btnClass("gold", "lg", "mt-6")}>Back to Product</Link></Container></main>;

  const commission = commissionOf(offer.price);
  const sellerAmount = Math.max(0, offer.price - commission);

  async function pay() {
    const next: string[] = [];
    if (!name.trim()) next.push("Enter your name.");
    const normalizedPhone = digitsOnly(phone);
    if (!normalizedPhone) next.push("Enter your M-Pesa phone number.");
    else if (normalizedPhone.length < 9) next.push("Enter a valid Kenyan phone number.");
    if (next.length) { setErrors(next); return; }
    setErrors([]); setMessage("");
    try {
      setStage("paying");
      const created = await api.createOrder({ productCode: offer.code, name: name.trim(), phone: normalizedPhone, email: email.trim() || undefined });
      const id = created?.order?.id;
      if (!id) throw new Error("We could not create your order. Please try again.");
      const returnedCode = created?.order?.items?.[0]?.product?.code ?? created?.order?.items?.[0]?.productCode;
      if (returnedCode && returnedCode !== offer.code) throw new Error("The selected offer changed before payment could start. Please return to the offer page and try again.");
      await api.payOrder(id);
      setOrderId(id);
    } catch (e: any) { setStage("form"); setMessage(e?.message || "We could not start the M-Pesa payment. Please try again."); }
  }

  if (stage === "success") return <main className="min-h-screen bg-mint/40 pb-16 pt-28"><Container className="max-w-3xl"><div className="rounded-[32px] border border-forest/10 bg-white p-7 text-center shadow-sm sm:p-10"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint text-brand"><Icon name="checkCircle" className="h-9 w-9" /></span><p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-brand">Payment confirmed</p><h1 className="mt-2 text-3xl font-extrabold text-deep">Your purchase is ready</h1><p className="mx-auto mt-3 max-w-xl text-forest/70">{accessError || "Your payment was confirmed and your purchase has been prepared."}</p>{downloadUrl && <a href={downloadUrl} target="_blank" rel="noreferrer" className={btnClass("gold", "xl", "mt-7")}>Access Purchase<Icon name="download" className="h-5 w-5" /></a>}<div className="mt-7 grid gap-3 text-left sm:grid-cols-3"><div className="rounded-2xl bg-mint/50 p-4"><p className="text-xs text-forest/50">Offer</p><p className="mt-1 font-bold text-deep">{offer.name}</p></div><div className="rounded-2xl bg-mint/50 p-4"><p className="text-xs text-forest/50">Amount</p><p className="mt-1 font-bold text-deep">{formatKsh(offer.price)}</p></div><div className="rounded-2xl bg-mint/50 p-4"><p className="text-xs text-forest/50">Seller earnings</p><p className="mt-1 font-bold text-deep">{formatKsh(sellerAmount)}</p></div></div><Link to={`/magic/${offer.code}`} className={btnClass("outline", "md", "mt-7")}>Back to Offer</Link></div></Container></main>;

  return <main className="min-h-screen bg-mint/40 pb-16 pt-28"><Container><div className="mx-auto max-w-5xl"><Link to={`/magic/${offer.code}`} className="inline-flex items-center gap-2 text-sm font-bold text-forest/70 hover:text-deep"><Icon name="arrowLeft" className="h-4 w-4" />Back to offer</Link><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]"><section className="rounded-3xl border border-forest/10 bg-white p-6 shadow-sm sm:p-8">{stage === "paying" ? <div className="py-10 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint"><span className="h-7 w-7 animate-spin rounded-full border-4 border-deep/15 border-t-deep" /></span><h1 className="mt-6 text-2xl font-extrabold text-deep">Complete payment on your phone</h1><p className="mt-3 text-forest/65">Follow the M-Pesa prompt. We are checking your payment automatically.</p><div className="mx-auto mt-8 max-w-sm space-y-2 text-left">{VERIFY_STEPS.map((item, index) => <div key={item} className={`flex items-center gap-3 rounded-xl p-3 text-sm ${index <= step ? "bg-mint text-deep" : "bg-forest/5 text-forest/45"}`}><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold">{index + 1}</span>{item}</div>)}</div></div> : <><Badge tone="gold"><Icon name="shield" className="h-3.5 w-3.5" />Secure M-Pesa checkout</Badge><h1 className="mt-4 text-3xl font-extrabold text-deep sm:text-4xl">Complete your purchase</h1><p className="mt-3 text-[15px] leading-relaxed text-forest/70">Enter your details and pay with M-Pesa. No customer account is required.</p>{message && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{message}</div>}{errors.length > 0 && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700"><ul className="list-disc pl-5">{errors.map(error => <li key={error}>{error}</li>)}</ul></div>}<div className="mt-7 space-y-5"><Field label="Your name" required><input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" autoComplete="name" /></Field><Field label="M-Pesa phone number" required hint="Use the number that should receive the payment prompt."><input className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} placeholder="07XX XXX XXX" inputMode="tel" autoComplete="tel" /></Field><Field label="Email address" hint="Optional — useful for your purchase receipt."><input className={inputClass} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" autoComplete="email" /></Field><button onClick={pay} className={btnClass("gold", "xl", "w-full")}>Pay {formatKsh(offer.price)} with M-Pesa<Icon name="arrowRight" className="h-5 w-5" /></button></div></>}</section><aside className="h-fit rounded-3xl border border-forest/10 bg-white p-6 shadow-sm"><p className="text-xs font-extrabold uppercase tracking-[0.15em] text-brand">Order summary</p><h2 className="mt-3 text-xl font-extrabold text-deep">{offer.name}</h2><p className="mt-2 text-sm text-forest/60">{offer.category} · {offer.type}</p><div className="mt-6 space-y-3 border-t border-forest/10 pt-5"><div className="flex justify-between text-sm"><span className="text-forest/60">Price</span><strong>{formatKsh(offer.price)}</strong></div><div className="flex justify-between text-sm"><span className="text-forest/60">UzaLink commission</span><span>{formatKsh(commission)}</span></div><div className="flex justify-between border-t border-forest/10 pt-3 text-base"><strong>Seller receives</strong><strong className="text-brand">{formatKsh(sellerAmount)}</strong></div></div><div className="mt-6 rounded-2xl bg-mint/50 p-4 text-sm text-forest/70">Payment is verified before fulfillment or secure digital access is released.</div></aside></div></div></Container></main>;
}

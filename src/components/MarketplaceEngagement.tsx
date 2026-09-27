import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Props = { code: string; sellerId?: string; priceCents?: number };

export function MarketplaceEngagement({ code, sellerId, priceCents }: Props) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [following, setFollowing] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponResult, setCouponResult] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.engagementReviews(code).then((r) => setReviews(r.reviews || [])).catch(() => {});
  }, [code]);

  async function toggleWishlist() {
    try {
      if (wishlisted) {
        await api.removeWishlist(code);
        setWishlisted(false);
      } else {
        await api.addWishlist(code);
        setWishlisted(true);
      }
    } catch (e: any) { setMessage(e.message); }
  }

  async function toggleFollow() {
    if (!sellerId) return;
    try {
      if (following) {
        await api.unfollowSeller(sellerId);
        setFollowing(false);
      } else {
        await api.followSeller(sellerId);
        setFollowing(true);
      }
    } catch (e: any) { setMessage(e.message); }
  }

  async function validateCoupon() {
    setCouponResult(null);
    try {
      const r = await api.coupon(coupon);
      if (r.coupon.sellerId && sellerId) {
        // The backend validates ownership again during checkout.
        if (r.coupon.sellerId !== sellerId) throw new Error("Coupon is not valid for this seller");
      }
      const saved = r.coupon.percentOff
        ? Math.floor((priceCents || 0) * r.coupon.percentOff / 100)
        : Math.min(priceCents || 0, r.coupon.amountOffCents || 0);
      setCouponResult({ ...r.coupon, saved });
    } catch (e: any) { setCouponResult({ error: e.message }); }
  }

  return <div className="mt-6 space-y-5">
    <div className="flex flex-wrap gap-2">
      <button onClick={toggleWishlist} className="rounded-full border px-4 py-2 text-sm font-bold">
        {wishlisted ? "♥ Saved" : "♡ Save to wishlist"}
      </button>
      {sellerId && <button onClick={toggleFollow} className="rounded-full border px-4 py-2 text-sm font-bold">
        {following ? "Following" : "Follow seller"}
      </button>}
    </div>

    <div className="rounded-2xl border p-4">
      <p className="font-bold">Have a discount code?</p>
      <div className="mt-2 flex gap-2">
        <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="COUPON CODE" className="min-w-0 flex-1 rounded-xl border px-3 py-2" />
        <button onClick={validateCoupon} className="rounded-xl bg-deep px-4 py-2 font-bold text-white">Apply</button>
      </div>
      {couponResult?.error && <p className="mt-2 text-sm text-red-600">{couponResult.error}</p>}
      {couponResult?.saved !== undefined && <p className="mt-2 text-sm text-green-700">Discount available: KSh {(couponResult.saved / 100).toLocaleString()}</p>}
    </div>

    {reviews.length > 0 && <div>
      <h3 className="text-xl font-bold text-deep">Buyer reviews</h3>
      <div className="mt-3 space-y-3">{reviews.slice(0, 5).map(r => <div key={r.id} className="rounded-2xl border p-4">
        <div className="font-bold">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
        {r.title && <p className="mt-1 font-semibold">{r.title}</p>}
        {r.body && <p className="mt-1 text-sm text-forest/70">{r.body}</p>}
        <p className="mt-2 text-xs text-forest/50">{r.user?.name || "Buyer"}</p>
      </div>)}</div>
    </div>}
    {message && <p className="text-sm text-red-600">{message}</p>}
  </div>;
}

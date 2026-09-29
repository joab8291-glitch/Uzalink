import { useEffect, useState } from "react";
import { Container, btnClass } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { Link } from "@/lib/router";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export function Wishlist() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [referral, setReferral] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    Promise.all([api.wishlist(), api.myReferrals()])
      .then(([w, r]) => {
        setItems(w.items || []);
        setReferral(r.referrals?.[0] || null);
      })
      .catch((e) => setError(e.message));
  }, [user]);

  if (loading) return <div className="min-h-screen pt-32 text-center">Loading…</div>;

  if (!user) {
    return (
      <section className="min-h-[70vh] bg-mint/30 pb-20 pt-32">
        <Container>
          <div className="mx-auto max-w-xl rounded-3xl border border-forest/10 bg-white p-8 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-brand"><Icon name="heart" className="h-7 w-7" /></span>
            <h1 className="mt-5 text-3xl font-extrabold text-deep">Your saved offers</h1>
            <p className="mt-3 text-forest/65">Sign in to manage your saved products and referral rewards.</p>
            <Link to="/seller-login" className={btnClass("deep", "md", "mt-6")}>Sign in</Link>
          </div>
        </Container>
      </section>
    );
  }

  const createReferral = async () => {
    try {
      const r = await api.createReferral();
      setReferral(r.referral);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <section className="min-h-screen bg-mint/30 pb-20 pt-28">
      <Container className="max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-brand">My UzaLink</p>
            <h1 className="mt-2 text-4xl font-extrabold text-deep">Saved offers & referrals</h1>
            <p className="mt-2 text-forest/65">Keep products you want to revisit and share your referral link.</p>
          </div>
          <Link to="/explore" className={btnClass("outline", "md")}><Icon name="compass" className="h-4 w-4" />Explore Marketplace</Link>
        </div>

        {error && <div className="mt-5 rounded-2xl bg-red-50 p-4 text-red-700">{error}</div>}

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-forest/10 bg-white p-5">
            <h2 className="text-xl font-extrabold text-deep">Saved products</h2>
            {items.length ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((item: any) => (
                  <article key={item.id} className="rounded-2xl border border-forest/10 p-4">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-mint">
                      <img src={`${import.meta.env.VITE_UZALINK_API || "https://uzalink-backend.onrender.com"}/api/products/${encodeURIComponent(item.product.code)}/cover`} className="h-full w-full object-cover" alt={item.product.name} />
                    </div>
                    <h3 className="mt-3 font-extrabold text-deep">{item.product.name}</h3>
                    <p className="mt-1 text-sm text-forest/60">KSh {(Number(item.product.priceCents || 0) / 100).toLocaleString()}</p>
                    <Link to={`/magic/${item.product.code}`} className={btnClass("deep", "sm", "mt-3 w-full")}>View Product</Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-mint/50 p-8 text-center text-forest/60">Your saved products list is empty. Save products from their UzaLink offer page.</div>
            )}
          </div>

          <aside className="rounded-3xl border border-forest/10 bg-white p-5">
            <h2 className="text-xl font-extrabold text-deep">Referral rewards</h2>
            <p className="mt-2 text-sm text-forest/65">Generate a unique referral code to share with friends.</p>
            {referral ? (
              <div className="mt-5 rounded-2xl bg-mint p-4">
                <p className="text-xs font-bold uppercase text-forest/50">Your code</p>
                <p className="mt-1 break-all text-lg font-extrabold text-deep">{referral.code}</p>
                <button onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/#/ref/${referral.code}`)} className={btnClass("gold", "md", "mt-3 w-full")}>Copy referral link</button>
              </div>
            ) : (
              <button onClick={createReferral} className={btnClass("deep", "md", "mt-5 w-full")}>Create referral link</button>
            )}
          </aside>
        </div>
      </Container>
    </section>
  );
}

import { useEffect, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/data";
import { api } from "@/lib/api";
import { Checkout } from "@/pages/Checkout";
import { Container, btnClass } from "@/components/ui";
import { Link } from "@/lib/router";

function mapBackendProduct(item: any): Product {
  const seller =
    item?.seller?.user?.name || item?.seller?.handle || "UzaLink Author";

  return {
    code: item.code,
    name: item.name,
    seller,
    handle: item?.seller?.handle || "",
    sellerAvatarSeed:
      seller
        .split(/\s+/)
        .filter(Boolean)
        .map((part: string) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "AU",
    type: "Digital Product",
    category: item.category || "Other",
    description: item.description || "Digital book",
    longDescription: item.description || "Digital book",
    price: Number(item.priceCents || 0) / 100,
    image:
      `${(import.meta.env.VITE_UZALINK_API || "https://uzalink-backend.onrender.com").replace(/\/$/, "")}/api/products/${encodeURIComponent(item.code)}/cover`,
    delivery: item.deliveryText || "Digital book",
    rating: Number(item.rating || 0),
    sales: Number(item.salesCount || 0),
    instant: Boolean(item.instant),
  };
}

function upsertProduct(product: Product) {
  const index = PRODUCTS.findIndex((item) => item.code === product.code);

  if (index >= 0) {
    PRODUCTS[index] = product;
  } else {
    PRODUCTS.push(product);
  }
}

export function LiveCheckout({ code }: { code: string }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError("");
        const result = await api.product(code);
        const product = result?.product;

        if (!product || product.code !== code) {
          throw new Error("This book could not be found.");
        }

        upsertProduct(mapBackendProduct(product));

        if (!cancelled) setReady(true);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "This book could not be loaded.");
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (ready) {
    return <Checkout code={code} />;
  }

  return (
    <main className="min-h-screen bg-mint/40 pb-16 pt-32">
      <Container className="max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
          <span className="h-7 w-7 animate-spin rounded-full border-4 border-deep/15 border-t-deep" />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold text-deep">
          {error ? "Book unavailable" : "Loading this book…"}
        </h1>

        <p className="mt-3 text-forest/70">
          {error || "Fetching the published book before opening secure checkout."}
        </p>

        {error && (
          <Link to={`/magic/${code}`} className={btnClass("gold", "lg", "mt-6")}>
            Back to Book
          </Link>
        )}
      </Container>
    </main>
  );
}

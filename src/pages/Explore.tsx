import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import {
  BUYER_FLOW,
  PRODUCTS,
  formatKsh,
  type Product,
} from "@/lib/data";
import { api } from "@/lib/api";
import { Link } from "@/lib/router";
import { Icon } from "@/components/Icon";
import {
  Badge,
  Container,
  Eyebrow,
  Reveal,
  SectionHeading,
  btnClass,
  inputClass,
} from "@/components/ui";
import { ProductCard } from "@/components/ProductCard";

type Sort = "popular" | "low" | "high" | "rating";

const SORTS: { key: Sort; label: string }[] = [
  { key: "popular", label: "Most popular" },
  { key: "low", label: "Price: low to high" },
  { key: "high", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
];

export function Explore() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("popular");
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadBooks = async () => {
      try {
        const result = await api.products();
        const products = Array.isArray(result?.products)
          ? result.products
          : [];

        const mapped: Product[] = products.map((product: any) => {
          const sellerName =
            product?.seller?.user?.name ||
            product?.seller?.handle ||
            "UzaLink Author";
          const initials = sellerName
            .split(/\\s+/)
            .filter(Boolean)
            .map((part: string) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return {
            code: product.code,
            name: product.name,
            seller: sellerName,
            handle: product?.seller?.handle || "",
            sellerAvatarSeed: initials || "AU",
            type: "Digital Product",
            category: product.category,
            description: product.description,
            longDescription: product.description,
            price: Number(product.priceCents || 0) / 100,
            image: `${import.meta.env.VITE_UZALINK_API || "https://uzalink-backend.onrender.com"}/api/products/${encodeURIComponent(product.code)}/cover`,
            delivery: product.deliveryText || "Digital book",
            rating: 0,
            sales: 0,
            instant: Boolean(product.instant),
          };
        });

        if (!cancelled) setLiveProducts(mapped);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Could not load books.");
        }
      } finally {
        if (!cancelled) setLoadingBooks(false);
      }
    };

    void loadBooks();
    return () => { cancelled = true; };
  }, [allBooks]);

  const allBooks = liveProducts;

import { cn } from "@/utils/cn";
import { formatKsh, type Product } from "@/lib/data";
import { Link } from "@/lib/router";
import { Icon } from "./Icon";
import { btnClass } from "./ui";

export function ProductCard({
  product,
  className,
  compact = false,
}: {
  product: Product;
  className?: string;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-[0_16px_40px_-32px_rgba(4,40,26,0.45)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/25 hover:shadow-[0_30px_60px_-32px_rgba(4,40,26,0.45)]",
        className,
      )}
    >
      <Link
        to={`/magic/${product.code}`}
        className="relative block aspect-[4/3] overflow-hidden bg-mint"
      >
        <img
          src={product.image}
          alt={`${product.name} book cover`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-deep/55 to-transparent" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-forest shadow-sm">
          <Icon name="book" className="h-3 w-3" />
          Digital Book
        </span>

        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full gold-gradient px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-deep shadow">
            {product.badge}
          </span>
        )}

        {product.instant && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-deep/85 px-2.5 py-1.5 text-[11px] font-bold text-white backdrop-blur">
            <Icon name="bolt" className="h-3 w-3 text-gold" />
            Instant access
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Author */}
        <div className="flex items-center gap-2 text-[12px] font-semibold text-forest/60">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint text-[10px] font-extrabold text-forest">
            {product.sellerAvatarSeed}
          </span>

          <span className="truncate">
            By {product.seller}
          </span>

          <span className="ml-auto inline-flex shrink-0 items-center gap-1 font-bold text-deep">
            <Icon
              name="star"
              className="h-3.5 w-3.5 text-gold"
              strokeWidth={0}
            />
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Book title */}
        <h3 className="mt-2.5 line-clamp-2 text-[16.5px] font-extrabold leading-snug text-deep">
          <Link to={`/magic/${product.code}`}>
            {product.name}
          </Link>
        </h3>

        {/* Category */}
        <p className="mt-1 text-[11.5px] font-bold uppercase tracking-wide text-forest/45">
          {product.category}
        </p>

        {!compact && (
          <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-forest/70">
            {product.description}
          </p>
        )}

        {/* Price and sales */}
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-[22px] font-extrabold leading-none text-deep">
              {formatKsh(product.price)}
            </p>

            <p className="mt-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-forest/50">
              {product.sales.toLocaleString()} readers
            </p>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-1.5 text-[10.5px] font-bold text-forest">
            <Icon name="download" className="h-3 w-3" />
            Digital
          </span>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to={`/magic/${product.code}`}
            className={btnClass(
              "outline",
              "md",
              "h-11! px-3! text-[13.5px]!",
            )}
          >
            View Book
          </Link>

          <Link
            to={`/magic/${product.code}/checkout`}
            className={btnClass(
              "deep",
              "md",
              "h-11! px-3! text-[13.5px]!",
            )}
          >
            <Icon
              name="bolt"
              className="h-4 w-4 text-gold"
              strokeWidth={0}
            />
            Buy Book
          </Link>
        </div>
      </div>
    </article>
  );
}

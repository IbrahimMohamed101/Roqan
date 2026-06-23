"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";
import { DiscountBadge } from "./DiscountBadge";
import { PriceDisplay } from "./PriceDisplay";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  const isMealProduct = () => {
    // Heuristic: check runtime flags or category/slug/name hints without changing backend
    // Accepts an optional runtime `isSubscription` property if present.
    // Also checks common keywords used for meal/subscription flows.
    // This is intentionally conservative to avoid changing business logic.
    const prodWithFlag = product as { isSubscription?: boolean };
    if (prodWithFlag.isSubscription) return true;
    if (product.categorySlug?.includes("meal")) return true;
    if (product.slug?.includes("meal") || product.slug?.includes("subscription")) return true;
    if (product.name?.includes("وجبة") || product.description?.includes("اشتراك")) return true;
    return false;
  };

  const ctaText = () => {
    if (product.stock <= 0) return "غير متوفر حاليا";
    if (added) return "تمت الإضافة";
    return isMealProduct() ? "ترقية الوجبة" : "أضف للسلة";
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-[var(--border)] bg-white shadow-soft transition duration-200 hover:-translate-y-1 hover:border-[rgba(17,155,181,0.45)] hover:shadow-[0_26px_56px_rgba(18,63,109,0.13)] sm:rounded-[24px]">
      <Link
        className="relative block aspect-square overflow-hidden bg-[linear-gradient(180deg,#f8fbfc_0%,#edf6f8_100%)] sm:aspect-[4/3]"
        href={`/product/${product.slug}`}
      >
        <Image
          alt={product.name}
          className="object-cover transition duration-300 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 390px) 50vw, 100vw"
          src={product.image}
        />
        <span className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3 product-badge product-badge--discount">
          <DiscountBadge discount={product.discount} />
        </span>
        {product.isNew ? (
          <span className="absolute left-2 top-2 z-10 product-badge product-badge--new sm:left-3 sm:top-3">
            جديد
          </span>
        ) : null}
        {product.bestSeller ? (
          <span className="absolute left-2 top-12 z-10 product-badge sm:left-3 sm:top-14 bg-[var(--soft-peach)] text-[var(--coral)]">
            الأكثر طلبًا
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-3 min-[390px]:p-2.5 sm:p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-10 text-[14px] font-black leading-5 text-[var(--text)] transition group-hover:text-[var(--primary)] sm:min-h-12 sm:text-base sm:leading-6">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 sm:mt-3">
          <PriceDisplay oldPrice={product.oldPrice} price={product.price} />
        </div>

        <p className="mt-1 text-xs text-[var(--muted)]">{product.stock > 0 ? "متوفر الآن" : "غير متوفر"}</p>

        <div className="mt-auto flex flex-col gap-2 pt-3">
          <button
            className="btn-primary w-full text-[12px] sm:text-sm"
            disabled={product.stock <= 0}
            onClick={handleAdd}
            type="button"
          >
            {ctaText()}
          </button>
          <Link
            className="inline-flex min-h-8 items-center justify-center rounded-[13px] text-center text-[11px] font-black text-[var(--teal)] transition hover:bg-[var(--light-cyan)] sm:min-h-10 sm:rounded-2xl sm:text-sm"
            href={`/product/${product.slug}`}
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </article>
  );
}

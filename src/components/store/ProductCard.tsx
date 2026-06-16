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

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[var(--border)] bg-white shadow-soft transition duration-200 hover:-translate-y-1 hover:border-[rgba(17,155,181,0.45)] hover:shadow-[0_26px_56px_rgba(18,63,109,0.13)] sm:rounded-[24px]">
      <Link
        className="relative block aspect-[4/3] overflow-hidden bg-[linear-gradient(180deg,#f8fbfc_0%,#edf6f8_100%)] min-[390px]:aspect-square"
        href={`/product/${product.slug}`}
      >
        <Image
          alt={product.name}
          className="object-cover transition duration-300 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 390px) 50vw, 100vw"
          src={product.image}
        />
        <span className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3">
          <DiscountBadge discount={product.discount} />
        </span>
        {product.isNew ? (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-black text-[var(--primary)] shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
            جديد
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-10 text-[13px] font-black leading-5 text-[var(--text)] transition group-hover:text-[var(--primary)] sm:min-h-12 sm:text-base sm:leading-6">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-black sm:gap-2 sm:text-xs">
          <span className="rounded-full bg-green-50 px-2 py-1 text-[var(--success)] sm:px-2.5">
            {product.stock > 0 ? "متوفر الآن" : "غير متوفر حاليا"}
          </span>
          {product.bestSeller ? (
            <span className="rounded-full bg-[var(--soft-peach)] px-2 py-1 text-[var(--coral)] sm:px-2.5">
              الأكثر طلبًا
            </span>
          ) : null}
        </div>
        <div className="mt-2 sm:mt-3">
          <PriceDisplay oldPrice={product.oldPrice} price={product.price} />
        </div>
        <div className="mt-auto flex flex-col gap-1.5 pt-3 sm:gap-2 sm:pt-4">
          <button
            className="btn-primary w-full text-xs sm:text-sm"
            disabled={product.stock <= 0}
            onClick={handleAdd}
            type="button"
          >
            {product.stock <= 0 ? "غير متوفر حاليا" : added ? "تمت الإضافة" : "أضف للسلة"}
          </button>
          <Link
            className="inline-flex min-h-9 items-center justify-center rounded-[14px] text-center text-xs font-black text-[var(--teal)] transition hover:bg-[var(--light-cyan)] sm:min-h-10 sm:rounded-2xl sm:text-sm"
            href={`/product/${product.slug}`}
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </article>
  );
}

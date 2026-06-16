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
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--border)] bg-white shadow-soft transition duration-200 hover:-translate-y-1 hover:border-[rgba(17,155,181,0.45)] hover:shadow-[0_26px_56px_rgba(18,63,109,0.13)]">
      <Link
        className="relative block aspect-square overflow-hidden bg-[linear-gradient(180deg,#f8fbfc_0%,#edf6f8_100%)]"
        href={`/product/${product.slug}`}
      >
        <Image
          alt={product.name}
          className="object-cover transition duration-300 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          src={product.image}
        />
        <span className="absolute right-3 top-3 z-10">
          <DiscountBadge discount={product.discount} />
        </span>
        {product.isNew ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[var(--primary)] shadow-sm">
            جديد
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-12 text-sm font-black leading-6 text-[var(--text)] transition group-hover:text-[var(--primary)] sm:text-base">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-black">
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-[var(--success)]">
            {product.stock > 0 ? "متوفر الآن" : "غير متوفر حاليا"}
          </span>
          {product.bestSeller ? (
            <span className="rounded-full bg-[var(--soft-peach)] px-2.5 py-1 text-[var(--coral)]">
              الأكثر طلبًا
            </span>
          ) : null}
        </div>
        <div className="mt-3">
          <PriceDisplay oldPrice={product.oldPrice} price={product.price} />
        </div>
        <div className="mt-auto flex flex-col gap-2 pt-4">
          <button
            className="btn-primary w-full text-sm"
            disabled={product.stock <= 0}
            onClick={handleAdd}
            type="button"
          >
            {product.stock <= 0 ? "غير متوفر حاليا" : added ? "تمت الإضافة" : "أضف للسلة"}
          </button>
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-2xl text-center text-sm font-black text-[var(--teal)] transition hover:bg-[var(--light-cyan)]"
            href={`/product/${product.slug}`}
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </article>
  );
}

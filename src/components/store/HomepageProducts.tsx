"use client";

import { useMemo, useState } from "react";
import type { Product, Category } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { CategoryChips } from "./CategoryChips";

export default function HomepageProducts({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const BATCH = 12;
  const [visibleCount, setVisibleCount] = useState(BATCH);

  // When no category selected, show a curated initial list to keep homepage short
  const displayed = useMemo(() => {
    if (!selected) return products.slice(0, visibleCount);
    // when category selected, show full category list
    return products.filter((p) => p.categorySlug === selected);
  }, [products, selected, visibleCount]);

  return (
    <div>
      <CategoryChips categories={categories} selected={selected} onSelect={setSelected} />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {displayed.length === 0 ? (
          <div className="rounded-[24px] border border-[var(--border)] bg-white p-6 text-center text-sm font-bold leading-7 text-[var(--muted)] shadow-soft">
            <p>لا توجد منتجات في هذا التصنيف حالياً</p>
            <p className="mt-1 text-sm text-[var(--muted)]">جرّب تصنيفاً آخر أو عد إلى كل المنتجات.</p>
          </div>
        ) : (
          displayed.map((product) => <ProductCard key={product.slug} product={product} />)
        )}
      </div>

      {/* show more button when in default (no category) and more products available */}
      {!selected && products.length > visibleCount ? (
        <div className="mt-4 text-center">
          <button
            className="btn-secondary px-4"
            onClick={() => setVisibleCount((c) => Math.min(products.length, c + BATCH))}
          >
            عرض المزيد
          </button>
        </div>
      ) : null}
    </div>
  );
}

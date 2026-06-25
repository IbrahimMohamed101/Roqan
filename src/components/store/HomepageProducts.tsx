"use client";

import { useMemo, useState } from "react";
import type { Product, Category } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { CategoryChips } from "./CategoryChips";

export default function HomepageProducts({
  products,
  categories,
  bestSellingProducts,
}: {
  products: Product[];
  categories: Category[];
  bestSellingProducts?: Product[];
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

      {!selected && bestSellingProducts && bestSellingProducts.length > 0 ? (
        <section className="mt-6 sm:mt-8">
          <div className="mb-3 sm:mb-5">
            <h2 className="text-lg font-black tracking-normal text-[var(--text)] min-[390px]:text-xl sm:text-3xl">
              الأكثر مبيعًا
            </h2>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)] sm:text-base sm:leading-7">
              منتجات اختارها عملاؤنا بكثرة
            </p>
          </div>
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-5 [&::-webkit-scrollbar]:hidden">
            {bestSellingProducts.map((product) => (
              <div className="w-[76vw] flex-none snap-start min-[390px]:w-[64vw] sm:w-auto" key={product.slug}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

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

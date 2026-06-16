import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-[24px] border border-[var(--border)] bg-white p-6 text-center text-sm font-bold leading-7 text-[var(--muted)] shadow-soft">
        لا توجد منتجات متاحة هنا حاليًا. جرّب فئة أخرى أو تواصل معنا عبر واتساب
        للمساعدة.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}

import Link from "next/link";
import type { Category } from "@/types/product";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      className="group flex min-h-[92px] gap-2.5 rounded-[16px] border border-[var(--border)] bg-white p-3 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-[var(--teal)] hover:shadow-[0_24px_50px_rgba(18,63,109,0.12)] min-[390px]:min-h-[112px] min-[390px]:flex-col sm:min-h-0 sm:gap-3 sm:rounded-[22px] sm:p-4"
      href={`/category/${category.slug}`}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-[13px] bg-[var(--light-cyan)] text-lg ring-4 ring-[var(--soft-surface)] transition group-hover:scale-105 sm:mb-2 sm:size-12 sm:rounded-2xl sm:text-2xl sm:ring-8">
        {category.icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[13px] font-black leading-5 text-[var(--text)] sm:text-base sm:leading-6">
          {category.name}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-5 text-[var(--muted)] sm:mt-2 sm:text-sm sm:leading-6">
          {category.description}
        </p>
        <p className="mt-1.5 text-[11px] font-black text-[var(--teal)] sm:mt-3 sm:text-sm">
          {category.productCount} منتجات
        </p>
      </div>
    </Link>
  );
}

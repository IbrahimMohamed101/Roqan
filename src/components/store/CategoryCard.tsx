import Link from "next/link";
import type { Category } from "@/types/product";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      className="group flex min-h-[116px] gap-3 rounded-[18px] border border-[var(--border)] bg-white p-3 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-[var(--teal)] hover:shadow-[0_24px_50px_rgba(18,63,109,0.12)] min-[390px]:block min-[390px]:min-h-[150px] sm:min-h-0 sm:rounded-[22px] sm:p-4"
      href={`/category/${category.slug}`}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[var(--light-cyan)] text-xl ring-4 ring-[var(--soft-surface)] transition group-hover:scale-105 min-[390px]:mb-3 sm:mb-5 sm:size-12 sm:rounded-2xl sm:text-2xl sm:ring-8">
        {category.icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-black leading-6 text-[var(--text)] sm:text-base">
          {category.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--muted)] sm:mt-2 sm:text-sm sm:leading-6">
          {category.description}
        </p>
        <p className="mt-2 text-xs font-black text-[var(--teal)] sm:mt-4 sm:text-sm">
          {category.productCount} منتجات
        </p>
      </div>
    </Link>
  );
}

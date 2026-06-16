import Link from "next/link";
import type { Category } from "@/types/product";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      className="group rounded-[22px] border border-[var(--border)] bg-white p-4 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-[var(--teal)] hover:shadow-[0_24px_50px_rgba(18,63,109,0.12)]"
      href={`/category/${category.slug}`}
    >
      <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-[var(--light-cyan)] text-2xl ring-8 ring-[var(--soft-surface)] transition group-hover:scale-105">
        {category.icon}
      </span>
      <h3 className="text-base font-black text-[var(--text)]">
        {category.name}
      </h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--muted)]">
        {category.description}
      </p>
      <p className="mt-4 text-sm font-black text-[var(--teal)]">
        {category.productCount} منتجات
      </p>
    </Link>
  );
}

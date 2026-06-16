import type { Category } from "@/types/product";
import { CategoryCard } from "./CategoryCard";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) {
    return (
      <div className="rounded-[24px] border border-[var(--border)] bg-white p-6 text-center text-sm font-bold leading-7 text-[var(--muted)] shadow-soft">
        لا توجد فئات متاحة حاليًا.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {categories.map((category) => (
        <CategoryCard category={category} key={category.slug} />
      ))}
    </div>
  );
}

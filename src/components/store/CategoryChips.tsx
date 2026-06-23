"use client";

import { useId } from "react";
import type { Category } from "@/types/product";

export function CategoryChips({
  categories,
  selected,
  onSelect,
}: {
  categories: Category[];
  selected?: string | null;
  onSelect?: (slug: string | null) => void;
}) {
  const id = useId();
  if (categories.length === 0) return null;

  return (
    <div className="category-chips -mx-2 overflow-x-auto pb-1">
      <div className="flex gap-3 px-2">
        <button
          onClick={() => onSelect?.(null)}
          aria-pressed={!selected}
          className={`chip flex-shrink-0 ${!selected ? "chip--active" : ""}`}
        >
          كل المنتجات
        </button>
        {categories.map((cat) => {
          const active = selected === cat.slug;
          return (
            <button
              key={`${id}-${cat.slug}`}
              onClick={() => onSelect?.(cat.slug)}
              aria-pressed={active}
              className={`chip flex-shrink-0 ${active ? "chip--active" : ""}`}
              aria-label={cat.name}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryChips;

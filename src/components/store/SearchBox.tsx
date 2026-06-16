"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SearchBoxProps = {
  compact?: boolean;
  initialQuery?: string;
  placeholder?: string;
};

export function SearchBox({
  compact,
  initialQuery = "",
  placeholder = "ابحث عن منتج، فئة، أو عرض...",
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    router.push(trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : "/search");
  };

  return (
    <form
      className={`flex w-full min-w-0 items-center rounded-[16px] border border-[var(--border)] bg-white/95 shadow-soft transition focus-within:border-[var(--teal)] focus-within:ring-4 focus-within:ring-[var(--ring)] sm:gap-2 sm:rounded-[20px] sm:p-2 ${
        compact ? "min-h-10 gap-1 p-1 sm:min-h-12" : "min-h-12 gap-1.5 p-1.5 sm:min-h-14"
      }`}
      onSubmit={onSubmit}
      role="search"
    >
      <span className="hidden size-8 shrink-0 place-items-center rounded-[13px] bg-[var(--light-cyan)] text-[var(--teal)] min-[360px]:grid sm:size-9 sm:rounded-2xl">
        ⌕
      </span>
      <input
        aria-label="بحث عن المنتجات"
        className="min-w-0 flex-1 bg-transparent px-1 text-[13px] font-semibold text-[var(--text)] outline-none placeholder:text-[var(--muted)] sm:text-sm"
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        value={query}
      />
      <button
        className={`btn-primary shrink-0 rounded-[13px] px-3 text-xs sm:rounded-[18px] sm:px-4 sm:text-sm ${
          compact ? "min-h-8 sm:min-h-11" : "min-h-9 sm:min-h-11"
        }`}
        type="submit"
      >
        بحث
      </button>
    </form>
  );
}

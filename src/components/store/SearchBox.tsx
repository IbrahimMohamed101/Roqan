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
      className={`flex w-full items-center gap-2 rounded-[20px] border border-[var(--border)] bg-white/95 p-2 shadow-soft transition focus-within:border-[var(--teal)] focus-within:ring-4 focus-within:ring-[var(--ring)] ${
        compact ? "min-h-12" : "min-h-14"
      }`}
      onSubmit={onSubmit}
      role="search"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-[var(--light-cyan)] text-[var(--teal)]">
        ⌕
      </span>
      <input
        aria-label="بحث عن المنتجات"
        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        value={query}
      />
      <button className="btn-primary min-h-11 px-4 text-sm" type="submit">
        بحث
      </button>
    </form>
  );
}

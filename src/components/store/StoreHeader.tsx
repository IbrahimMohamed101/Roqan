"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { LogoBrand } from "./LogoBrand";
import { SearchBox } from "./SearchBox";

const navLinks = [
  { href: "/categories", label: "الفئات" },
  { href: "/offers", label: "العروض" },
  { href: "/contact", label: "تواصل معنا" },
];

export function StoreHeader() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/90 backdrop-blur-xl">
      <div className="container-shell py-1.5 sm:py-4">
        <div className="grid gap-1.5 sm:gap-3 xl:grid-cols-[auto_minmax(0,1fr)_minmax(280px,420px)_auto] xl:items-center">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <LogoBrand />
            <Link
              className="btn-secondary !min-h-8 shrink-0 rounded-[13px] !px-2.5 !py-1 text-[11px] sm:!min-h-11 sm:!px-4 sm:!py-2 sm:text-sm xl:!hidden"
              href="/cart"
            >
              السلة
              <span className="grid size-5 place-items-center rounded-full bg-[var(--coral)] text-[10px] text-white sm:size-6 sm:text-xs">
                {totalItems}
              </span>
            </Link>
          </div>
          <nav
            aria-label="روابط المتجر"
            className="flex w-full min-w-0 items-center gap-1 overflow-x-auto py-0.5 [scrollbar-width:none] sm:gap-2 sm:rounded-2xl sm:bg-[var(--soft-surface)] sm:p-1 xl:justify-center xl:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            {navLinks.map((link) => (
              <Link
                className="min-h-7 shrink-0 rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[11px] font-black text-[var(--text)] shadow-sm transition hover:bg-white hover:text-[var(--primary)] sm:min-h-10 sm:rounded-2xl sm:border-0 sm:bg-transparent sm:px-4 sm:py-2.5 sm:text-sm sm:shadow-none sm:hover:shadow-sm"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="w-full min-w-0">
            <SearchBox compact />
          </div>
          <Link className="btn-secondary !hidden min-h-11 shrink-0 px-4 xl:!inline-flex" href="/cart">
            السلة
            <span className="grid size-6 place-items-center rounded-full bg-[var(--coral)] text-xs text-white">
              {totalItems}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

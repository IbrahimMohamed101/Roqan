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
      <div className="container-shell py-3 sm:py-4">
        <div className="grid gap-3 xl:grid-cols-[auto_minmax(0,1fr)_minmax(280px,420px)_auto] xl:items-center">
          <div className="flex min-w-0 items-center justify-between gap-3">
          <LogoBrand />
            <Link
              className="btn-secondary min-h-11 shrink-0 px-3 text-sm sm:px-4 xl:!hidden"
              href="/cart"
            >
              السلة
              <span className="grid size-6 place-items-center rounded-full bg-[var(--coral)] text-xs text-white">
                {totalItems}
              </span>
            </Link>
          </div>
          <nav
            aria-label="روابط المتجر"
            className="flex w-full items-center gap-1 overflow-x-auto rounded-[18px] bg-[var(--soft-surface)] p-1 sm:gap-2 xl:justify-center xl:overflow-visible"
          >
            {navLinks.map((link) => (
              <Link
                className="min-h-10 shrink-0 rounded-2xl px-3 py-2.5 text-sm font-black text-[var(--text)] transition hover:bg-white hover:text-[var(--primary)] hover:shadow-sm sm:px-4"
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

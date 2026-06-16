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
      <div className="container-shell py-3">
        <div className="grid items-center gap-3 lg:grid-cols-[auto_auto_1fr_auto]">
          <LogoBrand />
          <nav
            aria-label="روابط المتجر"
            className="order-3 flex w-full items-center gap-2 overflow-x-auto rounded-[18px] bg-[var(--soft-surface)] p-1 lg:order-none lg:w-auto"
          >
            {navLinks.map((link) => (
              <Link
                className="min-h-10 shrink-0 rounded-2xl px-4 py-2.5 text-sm font-black text-[var(--text)] transition hover:bg-white hover:text-[var(--primary)] hover:shadow-sm"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="order-4 w-full lg:order-none">
            <SearchBox compact />
          </div>
          <Link className="btn-secondary mr-auto min-h-11 px-4 lg:mr-0" href="/cart">
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

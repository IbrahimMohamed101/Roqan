"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "الطلبات" },
  { href: "/dashboard/shipping", label: "أسعار التوصيل" },
  { href: "/dashboard/products", label: "المنتجات" },
  { href: "/dashboard/categories", label: "الفئات" },
  { href: "/dashboard/settings", label: "إعدادات المتجر" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 text-sm font-black text-[var(--primary)]">
      {links.map((link) => {
        const active =
          link.href === "/dashboard"
            ? pathname === link.href
            : pathname.startsWith(link.href);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={`link-pill min-h-10 px-4 ${
              active ? "border-[var(--teal)] bg-[var(--light-cyan)]" : ""
            }`}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function MobileBottomNav() {
  const path = usePathname() || "/";

  const hiddenPrefixes = [
    "/cart",
    "/checkout",
    "/order-confirmation",
    "/dashboard",
    "/terms",
    "/privacy",
    "/privacy-policy",
    "/dashboard/login",
  ];

  const isHidden = hiddenPrefixes.some((p) => path === p || path.startsWith(p + "/") || path === p.replace(/\/$/, ""));

  useEffect(() => {
    // add a document class only when nav is visible so layout can apply conditional padding
    const cls = "has-mobile-nav";
    if (!isHidden) {
      document.documentElement.classList.add(cls);
    }
    return () => {
      document.documentElement.classList.remove(cls);
    };
  }, [isHidden]);

  if (isHidden) return null;

  return (
    <nav className="mobile-bottom-nav fixed left-0 right-0 z-40 mx-auto max-w-3xl px-4 sm:hidden" aria-label="bottom navigation">
      <div className="rounded-xl bg-white/95 backdrop-blur-sm border border-[var(--border)] shadow-soft flex items-center justify-between px-3 py-2" style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + 8px)` }}>
        <Link href="/" aria-label="الرئيسية" className={`nav-item ${path === "/" ? "active" : ""}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>الرئيسية</span>
        </Link>
        <Link href="/categories" aria-label="الفئات" className={`nav-item ${path === "/categories" ? "active" : ""}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>
          <span>الفئات</span>
        </Link>
        <Link href="/products" aria-label="المنتجات" className={`nav-item ${path === "/products" ? "active" : ""}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>المنتجات</span>
        </Link>
        <Link href="/cart" aria-label="السلة" className={`nav-item ${path === "/cart" ? "active" : ""}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h14l-1.5 9h-11z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
          <span>السلة</span>
        </Link>
        <Link href="/contact" aria-label="تواصل" className={`nav-item ${path === "/contact" ? "active" : ""}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 10a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-3.8-11.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>تواصل</span>
        </Link>
      </div>
    </nav>
  );
}

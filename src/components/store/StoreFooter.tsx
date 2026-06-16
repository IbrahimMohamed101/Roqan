import Link from "next/link";
import { storeConfig } from "@/lib/storeConfig";
import { LogoBrand } from "./LogoBrand";

export function StoreFooter() {
  return (
    <footer className="mt-10 border-t border-[var(--border)] bg-white/90 sm:mt-16">
      <div className="container-shell grid gap-6 py-8 sm:gap-8 sm:py-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <LogoBrand />
          <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)] sm:mt-4">
            روقان متجر عربي بسيط للمنتجات المنزلية والعصرية. نركز على اختيارات
            عملية، أسعار واضحة، وتجربة شراء هادئة من أول بحث حتى تأكيد الطلب.
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-base font-black text-[var(--text)] sm:mb-4">
            روابط مفيدة
          </h3>
          <div className="grid gap-1 text-sm font-bold text-[var(--muted)]">
            <Link className="inline-flex min-h-9 items-center transition hover:text-[var(--primary)] sm:min-h-11" href="/categories">
              كل الفئات
            </Link>
            <Link className="inline-flex min-h-9 items-center transition hover:text-[var(--primary)] sm:min-h-11" href="/offers">
              العروض
            </Link>
            <Link className="inline-flex min-h-9 items-center transition hover:text-[var(--primary)] sm:min-h-11" href="/cart">
              السلة
            </Link>
            <Link className="inline-flex min-h-9 items-center transition hover:text-[var(--primary)] sm:min-h-11" href="/contact">
              تواصل معنا
            </Link>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-base font-black text-[var(--text)] sm:mb-4">
            السياسات
          </h3>
          <div className="grid gap-1 text-sm font-bold text-[var(--muted)]">
            <Link className="inline-flex min-h-9 items-center transition hover:text-[var(--primary)] sm:min-h-11" href="/shipping-policy">
              سياسة الشحن
            </Link>
            <Link className="inline-flex min-h-9 items-center transition hover:text-[var(--primary)] sm:min-h-11" href="/returns-policy">
              الاستبدال والاسترجاع
            </Link>
            <Link className="inline-flex min-h-9 items-center transition hover:text-[var(--primary)] sm:min-h-11" href="/privacy-policy">
              سياسة الخصوصية
            </Link>
            <Link className="inline-flex min-h-9 items-center transition hover:text-[var(--primary)] sm:min-h-11" href="/terms">
              الشروط والأحكام
            </Link>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-base font-black text-[var(--text)] sm:mb-4">
            بيانات التواصل
          </h3>
          <div className="grid gap-2 text-sm leading-7 text-[var(--muted)]">
            <span>واتساب: {storeConfig.whatsapp}</span>
            <span>البريد: {storeConfig.email}</span>
            <span>{storeConfig.address}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-4 text-center text-xs font-bold text-[var(--muted)]">
        © 2026 روقان. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}

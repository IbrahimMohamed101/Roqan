import Link from "next/link";
import { storeConfig } from "@/lib/storeConfig";
import { LogoBrand } from "./LogoBrand";

export function StoreFooter() {
  return (
    <footer className="mt-6 border-t border-[var(--border)] bg-white/90 sm:mt-16">
      <div className="container-shell grid gap-5 py-6 sm:gap-8 sm:py-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <LogoBrand />
          <p className="mt-2 max-w-md text-xs leading-6 text-[var(--muted)] sm:mt-4 sm:text-sm sm:leading-7">
            روقان متجر عربي بسيط للمنتجات المنزلية والعصرية. نركز على اختيارات
            عملية، أسعار واضحة، وتجربة شراء هادئة من أول بحث حتى تأكيد الطلب.
          </p>
        </div>
        <div>
          <h3 className="mb-1.5 text-sm font-black text-[var(--text)] sm:mb-4 sm:text-base">
            روابط مفيدة
          </h3>
          <div className="grid gap-0.5 text-xs font-bold text-[var(--muted)] sm:gap-1 sm:text-sm">
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
          <h3 className="mb-1.5 text-sm font-black text-[var(--text)] sm:mb-4 sm:text-base">
            السياسات
          </h3>
          <div className="grid gap-0.5 text-xs font-bold text-[var(--muted)] sm:gap-1 sm:text-sm">
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
          <h3 className="mb-1.5 text-sm font-black text-[var(--text)] sm:mb-4 sm:text-base">
            بيانات التواصل
          </h3>
          <div className="grid gap-1.5 text-xs leading-6 text-[var(--muted)] sm:gap-2 sm:text-sm sm:leading-7">
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

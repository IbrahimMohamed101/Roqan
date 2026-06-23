import Link from "next/link";
import { storeConfig } from "@/lib/storeConfig";
import { LogoBrand } from "./LogoBrand";

export function StoreFooter() {
  return (
    <footer className="mt-4 border-t border-[var(--border)] bg-white/90">
      <div className="container-shell py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <LogoBrand />
            <p className="mt-2 text-xs leading-6 text-[var(--muted)] truncate sm:text-sm">
              روقان متجر عربي بسيط للمنتجات المنزلية والعصرية.
            </p>
          </div>

          <div className="flex-shrink-0 text-sm text-[var(--muted)]">
            <div className="font-black text-[var(--text)] mb-1">بيانات التواصل</div>
            <div className="text-xs leading-6">
              <div>واتساب: {storeConfig.whatsapp}</div>
              <div>البريد: {storeConfig.email}</div>
              <div>{storeConfig.address}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs font-bold text-[var(--muted)]">
            <Link className="px-2 py-1 inline-block" href="/terms">
              شروط الاستخدام
            </Link>
            <Link className="px-2 py-1 inline-block" href="/privacy-policy">
              سياسة الخصوصية
            </Link>
          </div>

          <div className="text-xs font-bold text-[var(--muted)]">© 2026 روقان</div>
        </div>
      </div>
    </footer>
  );
}

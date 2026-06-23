import Link from "next/link";
import { LogoBrand } from "./LogoBrand";
import type { StoreSettings } from "@/lib/storeSettings";

export function StoreFooter({ settings }: { settings: StoreSettings }) {
  return (
    <footer className="mt-4 border-t border-[var(--border)] bg-white/90 pb-0">
      <div className="container-shell container-shell-wide py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <LogoBrand name={settings.storeName} description={settings.storeDescription} logoUrl={settings.storeLogoUrl} />
            <p className="mt-2 text-xs leading-6 text-[var(--muted)] sm:text-sm">
              {settings.storeDescription}
            </p>
          </div>

          <div className="flex-shrink-0 text-sm text-[var(--muted)]">
            <div className="font-black text-[var(--text)] mb-1">بيانات التواصل</div>
            <div className="text-xs leading-6">
              <div>واتساب: {settings.whatsappNumber}</div>
              {settings.phoneNumber ? <div>الهاتف: {settings.phoneNumber}</div> : null}
              {settings.email ? <div>البريد: {settings.email}</div> : null}
              <div>{settings.location}{settings.address ? ` · ${settings.address}` : ""}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs font-bold text-[var(--muted)]">
            <Link className="px-2 py-1 inline-block" href={settings.termsUrl}>
              شروط الاستخدام
            </Link>
            <Link className="px-2 py-1 inline-block" href={settings.privacyUrl}>
              سياسة الخصوصية
            </Link>
          </div>

          <div className="text-xs font-bold text-[var(--muted)]">© {new Date().getFullYear()} {settings.storeName}</div>
        </div>
        {[settings.facebookUrl, settings.instagramUrl, settings.tiktokUrl].some(Boolean) ? (
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-black text-[var(--teal)]">
            {settings.facebookUrl ? <a href={settings.facebookUrl} rel="noreferrer" target="_blank">فيسبوك</a> : null}
            {settings.instagramUrl ? <a href={settings.instagramUrl} rel="noreferrer" target="_blank">إنستجرام</a> : null}
            {settings.tiktokUrl ? <a href={settings.tiktokUrl} rel="noreferrer" target="_blank">تيك توك</a> : null}
          </div>
        ) : null}
      </div>
    </footer>
  );
}

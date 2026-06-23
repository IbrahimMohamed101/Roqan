import type { Metadata } from "next";
import { createWhatsAppUrl } from "@/lib/storeConfig";
import { getStoreSettings } from "@/lib/storeSettings";

export const metadata: Metadata = {
  title: "تواصل معنا | روقان",
  description: "تواصل مع متجر روقان عبر واتساب أو البريد الإلكتروني.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    description: "تواصل مع متجر روقان عبر واتساب أو البريد الإلكتروني.",
    title: "تواصل معنا | روقان",
    type: "website",
    url: "/contact",
  },
};

export default async function ContactPage() {
  const settings = await getStoreSettings();
  const whatsappUrl = createWhatsAppUrl(
    `مرحبًا ${settings.storeName}، أريد الاستفسار عن منتج.`,
    settings.whatsappNumber,
  );
  return (
    <div className="container-shell section-y">
      <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr] lg:items-start">
        <div className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-black text-[var(--teal)]">خدمة العملاء</p>
          <h1 className="mt-2 text-3xl font-black text-[var(--primary)]">
            نحن قريبون منك.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
            ارسل لنا اسم المنتج أو صورة المنتج المطلوب، وسنساعدك بتأكيد السعر
            والتوفر وطريقة الشحن.
          </p>
          <a
            className="btn-primary mt-6"
            href={whatsappUrl || undefined}
            rel="noreferrer"
            target="_blank"
          >
            {whatsappUrl ? "تواصل عبر واتساب" : "واتساب غير متاح حاليًا"}
          </a>
        </div>
        <div className="rounded-[28px] border border-[rgba(17,155,181,0.2)] bg-[var(--light-cyan)] p-6 shadow-soft sm:p-8">
          <h2 className="text-xl font-black text-[var(--text)]">بيانات {settings.storeName}</h2>
          <div className="mt-5 grid gap-4 text-sm font-bold leading-7 text-[var(--muted)]">
            <div className="rounded-2xl bg-white p-4 shadow-sm">واتساب: {settings.whatsappNumber}</div>
            {settings.phoneNumber ? <div className="rounded-2xl bg-white p-4 shadow-sm">الهاتف: {settings.phoneNumber}</div> : null}
            {settings.email ? <div className="rounded-2xl bg-white p-4 shadow-sm">البريد: {settings.email}</div> : null}
            <div className="rounded-2xl bg-white p-4 shadow-sm">العنوان: {settings.location}{settings.address ? ` · ${settings.address}` : ""}</div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              مواعيد الرد: يوميًا من 10 صباحًا إلى 10 مساءً
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

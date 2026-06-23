import { saveStoreSettings } from "../actions";
import { Notice } from "@/components/dashboard/Notice";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import { ProductImageField } from "@/components/dashboard/ProductImageField";
import { getStoreSettings } from "@/lib/storeSettings";

const inputClass =
  "min-h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text)] outline-none transition focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--ring)]";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="grid gap-2 text-sm font-black text-[var(--text)]">
    {label}
    {children}
  </label>
);

type SettingsPageProps = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [params, settings] = await Promise.all([searchParams, getStoreSettings()]);

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-5">
        <p className="text-sm font-black text-[var(--teal)]">الهوية وبيانات التواصل</p>
        <h1 className="mt-1 text-3xl font-black text-[var(--text)]">إعدادات المتجر</h1>
        <p className="mt-2 text-sm font-bold leading-7 text-[var(--muted)]">
          تظهر هذه البيانات في رأس المتجر وتذييله وصفحات التواصل وروابط واتساب.
        </p>
      </div>
      <Notice message={params.success} />
      <Notice message={params.error} type="error" />

      <form action={saveStoreSettings} className="grid gap-5" encType="multipart/form-data">
        <fieldset className="grid gap-4 rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-soft md:grid-cols-2">
          <legend className="px-2 text-lg font-black text-[var(--primary)]">بيانات المتجر</legend>
          <Field label="اسم المتجر *">
            <input className={inputClass} defaultValue={settings.storeName} name="storeName" required />
          </Field>
          <Field label="الموقع / المدينة">
            <input className={inputClass} defaultValue={settings.location} name="location" />
          </Field>
          <Field label="الوصف المختصر">
            <textarea className={`${inputClass} min-h-24`} defaultValue={settings.storeDescription} name="storeDescription" />
          </Field>
          <Field label="العنوان التفصيلي">
            <textarea className={`${inputClass} min-h-24`} defaultValue={settings.address} name="address" />
          </Field>
          <Field label="رابط الشعار">
            <input className={inputClass} defaultValue={settings.storeLogoUrl} name="storeLogoUrl" />
          </Field>
          <Field label="أو ارفع شعارًا جديدًا">
            <ProductImageField defaultValue={settings.storeLogoUrl} inputClass={inputClass} urlName="storeLogoUrl" fileName="storeLogoFile" previewAlt="معاينة الشعار" />
          </Field>
        </fieldset>

        <fieldset className="grid gap-4 rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-soft md:grid-cols-2">
          <legend className="px-2 text-lg font-black text-[var(--primary)]">بيانات التواصل</legend>
          <Field label="رقم واتساب مع كود الدولة *">
            <input className={inputClass} defaultValue={settings.whatsappNumber} dir="ltr" inputMode="tel" name="whatsappNumber" required />
          </Field>
          <Field label="رقم الهاتف">
            <input className={inputClass} defaultValue={settings.phoneNumber} dir="ltr" inputMode="tel" name="phoneNumber" />
          </Field>
          <Field label="البريد الإلكتروني">
            <input className={inputClass} defaultValue={settings.email} dir="ltr" name="email" type="email" />
          </Field>
        </fieldset>

        <fieldset className="grid gap-4 rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-soft md:grid-cols-2">
          <legend className="px-2 text-lg font-black text-[var(--primary)]">روابط وسياسات</legend>
          <Field label="رابط الشروط والأحكام">
            <input className={inputClass} defaultValue={settings.termsUrl} dir="ltr" name="termsUrl" />
          </Field>
          <Field label="رابط سياسة الخصوصية">
            <input className={inputClass} defaultValue={settings.privacyUrl} dir="ltr" name="privacyUrl" />
          </Field>
        </fieldset>

        <fieldset className="grid gap-4 rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-soft md:grid-cols-3">
          <legend className="px-2 text-lg font-black text-[var(--primary)]">روابط السوشيال ميديا</legend>
          <Field label="فيسبوك">
            <input className={inputClass} defaultValue={settings.facebookUrl} dir="ltr" name="facebookUrl" type="url" />
          </Field>
          <Field label="إنستجرام">
            <input className={inputClass} defaultValue={settings.instagramUrl} dir="ltr" name="instagramUrl" type="url" />
          </Field>
          <Field label="تيك توك">
            <input className={inputClass} defaultValue={settings.tiktokUrl} dir="ltr" name="tiktokUrl" type="url" />
          </Field>
        </fieldset>

        <SubmitButton className="btn-primary min-h-12 w-full sm:w-auto sm:min-w-48" pendingText="جار حفظ الإعدادات...">
          حفظ الإعدادات
        </SubmitButton>
      </form>
    </section>
  );
}

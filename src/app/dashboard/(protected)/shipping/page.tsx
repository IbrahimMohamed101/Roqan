import { deactivateShippingGovernorate, saveShippingGovernorate } from "../actions";
import { ConfirmSubmitButton } from "@/components/dashboard/ConfirmSubmitButton";
import { Notice } from "@/components/dashboard/Notice";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import { getActiveGovernorates } from "@/lib/shipping";

const inputClass =
  "min-h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text)] outline-none transition focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--ring)]";

const GovernorateField = ({ children, label, className = "" }: { children: React.ReactNode; label: string; className?: string }) => (
  <label className={`grid min-w-0 gap-2 text-sm font-black text-[var(--text)] ${className}`}>{label}{children}</label>
);

export default async function DashboardShippingPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string; q?: string }>; }) {
  const params = await searchParams;
  const governorates = await getActiveGovernorates();

  return (
    <section>
      <div className="mb-5">
        <p className="text-sm font-black text-[var(--teal)]">إدارة التوصيل</p>
        <h1 className="mt-1 text-3xl font-black text-[var(--text)]">أسعار التوصيل</h1>
      </div>
      <Notice message={params.success} />
      <Notice message={params.error} type="error" />

      <form action={saveShippingGovernorate} className="mb-5 grid gap-4 rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-soft md:grid-cols-2 lg:grid-cols-3">
        <input name="returnTo" type="hidden" value="/dashboard/shipping" />
        <GovernorateField label="اسم المحافظة">
          <input className={inputClass} name="name" required />
        </GovernorateField>
        <GovernorateField label="slug (اختياري - يتم إنشاؤه تلقائياً)">
          <input className={inputClass} dir="ltr" name="slug" />
          <p className="text-xs text-[var(--muted)] mt-1">
            يمكنك ترك هذا الحقل فارغاً، وسيقوم النظام بإنشاء الرابط تلقائياً.
          </p>
        </GovernorateField>
        <GovernorateField label="سعر التوصيل">
          <input className={inputClass} name="deliveryFee" type="number" defaultValue={60} />
        </GovernorateField>
        <label className="flex min-h-11 items-center gap-2 self-end text-sm font-bold">
          <input defaultChecked name="isActive" type="checkbox" /> نشطة
        </label>
        <GovernorateField className="md:col-span-2 lg:col-span-3" label="الترتيب">
          <input className={inputClass} name="sortOrder" type="number" />
        </GovernorateField>
        <SubmitButton className="btn-primary md:col-span-2 lg:col-span-3">إضافة محافظة</SubmitButton>
      </form>

      <p className="mb-4 text-sm font-bold text-[var(--muted)]">إجمالي النتائج: {governorates.length}</p>

      <div className="grid gap-4">
        {governorates.map((g, index) => (
          <article key={g.slug} className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[var(--text)]">{g.name}</h2>
                <p className="text-sm font-bold text-[var(--muted)]">{g.slug} · السعر: {g.deliveryFee}</p>
              </div>
              <span className={`self-start rounded-full px-3 py-1 text-xs font-black ${g.isActive === false ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                {g.isActive === false ? "غير نشطة" : "نشطة"}
              </span>
            </div>

            <form action={saveShippingGovernorate} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <input name="returnTo" type="hidden" value="/dashboard/shipping" />
              <input name="id" type="hidden" value={g.id} />
              <GovernorateField label="اسم المحافظة">
                <input className={inputClass} defaultValue={g.name} name="name" required />
              </GovernorateField>
              <GovernorateField label="slug (اختياري)">
                <input className={inputClass} defaultValue={g.slug} dir="ltr" name="slug" />
                <p className="text-xs text-[var(--muted)] mt-1">
                  اختياري - سيتم الحفاظ على الرابط الحالي إذا لم تغيره.
                </p>
              </GovernorateField>
              <GovernorateField label="سعر التوصيل">
                <input className={inputClass} defaultValue={String(g.deliveryFee)} name="deliveryFee" type="number" />
              </GovernorateField>
              <label className="flex min-h-11 items-center gap-2 self-end text-sm font-bold">
                <input defaultChecked={g.isActive !== false} name="isActive" type="checkbox" /> نشطة
              </label>
              <GovernorateField className="md:col-span-2 lg:col-span-3" label="الترتيب">
                <input className={inputClass} defaultValue={g.sortOrder ?? index} name="sortOrder" type="number" />
              </GovernorateField>
              <SubmitButton className="btn-primary md:col-span-2 lg:col-span-3">حفظ</SubmitButton>
            </form>

            <form action={deactivateShippingGovernorate} className="mt-3">
              <input name="returnTo" type="hidden" value="/dashboard/shipping" />
              <input name="id" type="hidden" value={g.id} />
              <ConfirmSubmitButton className="btn-secondary text-[var(--danger)]" message="هل تريد تغيير حالة المحافظة؟">تبديل الحالة</ConfirmSubmitButton>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}

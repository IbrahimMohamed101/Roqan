import { deactivateCategory, saveCategory } from "../actions";
import { ConfirmSubmitButton } from "@/components/dashboard/ConfirmSubmitButton";
import { Notice } from "@/components/dashboard/Notice";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import { getCategories } from "@/lib/catalog";

const inputClass =
  "min-h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text)] outline-none transition focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--ring)]";

type DashboardCategoriesPageProps = {
  searchParams: Promise<{
    q?: string;
    success?: string;
    error?: string;
  }>;
};

const getCategoriesHref = (query: string) => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  const search = params.toString();
  return search ? `/dashboard/categories?${search}` : "/dashboard/categories";
};

export default async function DashboardCategoriesPage({
  searchParams,
}: DashboardCategoriesPageProps) {
  const params = await searchParams;
  const query = String(params.q ?? "").trim().toLowerCase();
  const categories = await getCategories(true);
  const filteredCategories = categories.filter(
    (category) =>
      !query ||
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query),
  );
  const currentPath = getCategoriesHref(query);

  return (
    <section>
      <div className="mb-5">
        <p className="text-sm font-black text-[var(--teal)]">إدارة الفئات</p>
        <h1 className="mt-1 text-3xl font-black text-[var(--text)]">الفئات</h1>
      </div>
      <Notice message={params.success} />
      <Notice message={params.error} type="error" />

      <form className="mb-5 grid gap-3 rounded-[24px] border border-[var(--border)] bg-white p-4 shadow-soft sm:grid-cols-[1fr_auto]" method="get">
        <input className={inputClass} defaultValue={query} name="q" placeholder="بحث باسم الفئة أو slug" />
        <button className="btn-primary min-h-11 px-4" type="submit">
          بحث
        </button>
      </form>

      <form
        action={saveCategory}
        className="mb-5 grid gap-3 rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-soft lg:grid-cols-5"
      >
        <input name="returnTo" type="hidden" value={currentPath} />
        <input className={inputClass} name="name" placeholder="اسم الفئة" required />
        <input className={inputClass} name="slug" placeholder="slug" required />
        <input className={inputClass} name="icon" placeholder="الأيقونة" />
        <input className={inputClass} name="sortOrder" placeholder="الترتيب" type="number" />
        <label className="flex items-center gap-2 text-sm font-bold">
          <input defaultChecked name="isActive" type="checkbox" /> نشطة
        </label>
        <textarea className={`${inputClass} min-h-20 lg:col-span-5`} name="description" placeholder="الوصف" />
        <SubmitButton className="btn-primary lg:col-span-5" pendingText="جار إضافة الفئة...">
          إضافة فئة
        </SubmitButton>
      </form>

      <p className="mb-4 text-sm font-bold text-[var(--muted)]">
        إجمالي النتائج: {filteredCategories.length}
      </p>

      {filteredCategories.length === 0 ? (
        <div className="rounded-[24px] border border-[var(--border)] bg-white p-6 text-sm font-bold text-[var(--muted)] shadow-soft">
          لا توجد فئات مطابقة للبحث الحالي.
        </div>
      ) : (
        <div className="grid gap-4">
        {filteredCategories.map((category, index) => (
          <article
            className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-soft"
            key={category.slug}
          >
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-[var(--text)]">
                  {category.icon} {category.name}
                </h2>
                <p className="text-sm font-bold text-[var(--muted)]">
                  {category.slug} · المنتجات: {category.productCount}
                </p>
              </div>
              <span className={`self-start rounded-full px-3 py-1 text-xs font-black ${category.isActive === false ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                {category.isActive === false ? "غير نشطة" : "نشطة"}
              </span>
            </div>
          <form
            action={saveCategory}
            className="grid gap-3 lg:grid-cols-5"
          >
            <input name="returnTo" type="hidden" value={currentPath} />
            <input name="id" type="hidden" value={category.id} />
            <input className={inputClass} defaultValue={category.name} name="name" required />
            <input className={inputClass} defaultValue={category.slug} name="slug" required />
            <input className={inputClass} defaultValue={category.icon} name="icon" />
            <input className={inputClass} defaultValue={index} name="sortOrder" type="number" />
            <label className="flex items-center gap-2 text-sm font-bold">
              <input defaultChecked={category.isActive !== false} name="isActive" type="checkbox" /> نشطة
            </label>
            <textarea className={`${inputClass} min-h-20 lg:col-span-5`} defaultValue={category.description} name="description" />
            <SubmitButton className="btn-primary lg:col-span-4" pendingText="جار حفظ الفئة...">
              حفظ الفئة
            </SubmitButton>
          </form>
            <form action={deactivateCategory} className="mt-3">
              <input name="returnTo" type="hidden" value={currentPath} />
              <input name="id" type="hidden" value={category.id} />
              <ConfirmSubmitButton
                className="btn-secondary text-[var(--danger)]"
                message="هل تريد إلغاء تفعيل هذه الفئة؟"
              >
                إلغاء تفعيل الفئة
              </ConfirmSubmitButton>
            </form>
          </article>
        ))}
        </div>
      )}
    </section>
  );
}

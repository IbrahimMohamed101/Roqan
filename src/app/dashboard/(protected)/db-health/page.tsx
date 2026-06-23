import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type DatabaseHealthRow = {
  current_database: string;
  current_schema: string;
  category_image_url_exists: boolean;
  category_image_url_type: string | null;
  category_image_url_nullable: string | null;
  store_settings_exists: boolean;
  order_alternate_phone_exists: boolean;
};

const statusClass = (healthy: boolean) =>
  healthy ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700";

export default async function DatabaseHealthPage() {
  let health: DatabaseHealthRow | null = null;

  try {
    const result = await query<DatabaseHealthRow>(
      `
        select
          current_database() as current_database,
          current_schema() as current_schema,
          exists (
            select 1
            from information_schema.columns
            where table_schema = 'public'
              and table_name = 'categories'
              and column_name = 'image_url'
          ) as category_image_url_exists,
          (
            select data_type
            from information_schema.columns
            where table_schema = 'public'
              and table_name = 'categories'
              and column_name = 'image_url'
          ) as category_image_url_type,
          (
            select is_nullable
            from information_schema.columns
            where table_schema = 'public'
              and table_name = 'categories'
              and column_name = 'image_url'
          ) as category_image_url_nullable,
          to_regclass('public.store_settings') is not null as store_settings_exists,
          exists (
            select 1
            from information_schema.columns
            where table_schema = 'public'
              and table_name = 'orders'
              and column_name = 'alternate_phone'
          ) as order_alternate_phone_exists
      `,
    );
    health = result.rows[0] ?? null;
  } catch (error) {
    console.error("Dashboard database health check failed.", error);
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-5">
        <p className="text-sm font-black text-[var(--teal)]">تشخيص آمن</p>
        <h1 className="mt-1 text-3xl font-black text-[var(--text)]">
          حالة قاعدة البيانات
        </h1>
        <p className="mt-2 text-sm font-bold leading-7 text-[var(--muted)]">
          تعرض هذه الصفحة معلومات المخطط فقط، ولا تعرض رابط الاتصال أو أي بيانات سرية.
        </p>
      </div>

      {!health ? (
        <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-red-700">
          تعذر التحقق من قاعدة البيانات. راجع سجلات الخادم وإعدادات الاتصال.
        </p>
      ) : (
        <dl className="grid gap-3 rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <dt className="font-black text-[var(--text)]">قاعدة البيانات الحالية</dt>
            <dd className="font-mono text-sm font-bold text-[var(--muted)]">
              {health.current_database}
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <dt className="font-black text-[var(--text)]">المخطط الحالي</dt>
            <dd className="font-mono text-sm font-bold text-[var(--muted)]">
              {health.current_schema}
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <dt className="font-black text-[var(--text)]">نوع categories.image_url</dt>
            <dd className="font-mono text-sm font-bold text-[var(--muted)]">
              {health.category_image_url_type ?? "غير موجود"}
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <dt className="font-black text-[var(--text)]">قابلية NULL</dt>
            <dd className="font-mono text-sm font-bold text-[var(--muted)]">
              {health.category_image_url_nullable ?? "غير موجود"}
            </dd>
          </div>
          {[
            ["categories.image_url", health.category_image_url_exists],
            ["store_settings", health.store_settings_exists],
            ["orders.alternate_phone", health.order_alternate_phone_exists],
          ].map(([label, healthy]) => (
            <div className="flex flex-wrap items-center justify-between gap-3" key={String(label)}>
              <dt className="font-black text-[var(--text)]">{String(label)}</dt>
              <dd
                className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(Boolean(healthy))}`}
              >
                {healthy ? "موجود" : "غير موجود"}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

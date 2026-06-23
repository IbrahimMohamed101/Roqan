import { updateOrderStatus } from "./actions";
import { Notice } from "@/components/dashboard/Notice";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import { getOrders, buildWhatsAppOrderMessage } from "@/lib/orders";
import { getActiveGovernorates } from "@/lib/shipping";
import { createWhatsAppUrl, formatPrice } from "@/lib/storeConfig";
import { getStoreSettings } from "@/lib/storeSettings";
import type { OrderStatus } from "@/types/order";

const statusLabels = {
  new: "جديد",
  confirmed: "تم التأكيد",
  shipped: "تم الشحن",
  cancelled: "ملغي",
};

const statusBadgeClass = {
  new: "bg-blue-50 text-blue-700",
  confirmed: "bg-green-50 text-green-700",
  shipped: "bg-purple-50 text-purple-700",
  cancelled: "bg-red-50 text-red-700",
};

type DashboardOrdersPageProps = {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    from?: string;
    to?: string;
    governorate?: string;
    sort?: string;
    success?: string;
    error?: string;
  }>;
};

const getPageHref = ({
  page,
  query,
  status,
  from,
  to,
  governorate,
  sort,
}: {
  page: number;
  query: string;
  status: string;
  from?: string;
  to?: string;
  governorate?: string;
  sort?: string;
}) => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (status && status !== "all") params.set("status", status);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (governorate) params.set("governorate", governorate);
  if (sort) params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/dashboard?${search}` : "/dashboard";
};

export default async function DashboardOrdersPage({
  searchParams,
}: DashboardOrdersPageProps) {
  const params = await searchParams;
  const query = String(params.q ?? "").trim();
  const statusValues = ["all", ...Object.keys(statusLabels)];
  const status = statusValues.includes(String(params.status))
    ? String(params.status)
    : "all";
  const page = Math.max(Number(params.page ?? 1) || 1, 1);
  const from = params.from ? String(params.from) : undefined;
  const to = params.to ? String(params.to) : undefined;
  const governorate = params.governorate ? String(params.governorate) : "";
  const sort = params.sort ? String(params.sort) : "created_desc";
  const [governorates, settingsResult] = await Promise.all([
    getActiveGovernorates(),
    getStoreSettings(),
  ]);

  const castSort = sort as "created_desc" | "created_asc" | "total_desc" | "total_asc";
  const [{ orders, total, totalPages, summary }, settings] = await Promise.all([
    getOrders({ page, query, status: status as OrderStatus | "all", fromDate: from, toDate: to, governorate: governorate || undefined, sort: castSort }),
    settingsResult,
  ]);
  const currentFilteredPath = getPageHref({ page, query, status, from, to, governorate, sort });

  return (
    <section>
      <div className="mb-5">
        <p className="text-sm font-black text-[var(--teal)]">إدارة الطلبات</p>
        <h1 className="mt-1 text-3xl font-black text-[var(--text)]">الطلبات</h1>
      </div>
      <Notice message={params.success} />
      <Notice message={params.error} type="error" />

      <form className="mb-5 grid gap-3 rounded-[24px] border border-[var(--border)] bg-white p-4 shadow-soft md:grid-cols-[1fr_220px_auto]" method="get">
        <div className="flex gap-2">
          <input
          className="min-h-11 rounded-2xl border border-[var(--border)] px-3 text-sm font-bold"
          defaultValue={query}
          name="q"
          placeholder="ابحث برقم الطلب، الاسم، أو الهاتف"
        />
          <select
          className="min-h-11 rounded-2xl border border-[var(--border)] bg-white px-3 text-sm font-bold"
          defaultValue={status}
          name="status"
        >
          <option value="all">كل الحالات</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            className="min-h-11 rounded-2xl border border-[var(--border)] px-3 text-sm font-bold"
            defaultValue={from}
            name="from"
            type="date"
            placeholder="من تاريخ"
          />
          <input
            className="min-h-11 rounded-2xl border border-[var(--border)] px-3 text-sm font-bold"
            defaultValue={to}
            name="to"
            type="date"
            placeholder="إلى تاريخ"
          />
        </div>
        <div className="flex gap-2">
          <select name="governorate" defaultValue={governorate} className="min-h-11 rounded-2xl border border-[var(--border)] bg-white px-3 text-sm font-bold">
            <option value="">كل المحافظات</option>
            {governorates.map((g) => (
              <option key={g.slug} value={g.name}>{g.name}</option>
            ))}
          </select>
          <select name="sort" defaultValue={sort} className="min-h-11 rounded-2xl border border-[var(--border)] bg-white px-3 text-sm font-bold">
            <option value="created_desc">الأحدث أولاً</option>
            <option value="created_asc">الأقدم أولاً</option>
            <option value="total_desc">الأعلى قيمة</option>
            <option value="total_asc">الأقل قيمة</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-primary min-h-11 px-4" type="submit">تطبيق</button>
          <a className="btn-secondary min-h-11 px-4" href="/dashboard">إعادة ضبط</a>
          <a className="btn-ghost min-h-11 px-4" href={getPageHref({ page: 1, query: '', status: 'all', from: new Date().toISOString().slice(0,10), to: new Date().toISOString().slice(0,10) })}>طلبات اليوم</a>
        </div>
      </form>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[16px] border border-[var(--border)] bg-white p-4 text-sm font-black text-[var(--muted)] shadow-soft">
          <div className="text-[var(--muted)]">إجمالي الطلبات</div>
          <div className="mt-1 text-2xl text-[var(--text)]">{summary?.total ?? total}</div>
        </div>
        <div className="rounded-[16px] border border-[var(--border)] bg-white p-4 text-sm font-black text-[var(--muted)] shadow-soft">
          <div className="text-[var(--muted)]">إجمالي المبيعات</div>
          <div className="mt-1 text-2xl text-[var(--text)]">{summary ? formatPrice(summary.totalSales) : formatPrice(0)}</div>
        </div>
        <div className="rounded-[16px] border border-[var(--border)] bg-white p-4 text-sm font-black text-[var(--muted)] shadow-soft">
          <div className="text-[var(--muted)]">إجمالي رسوم التوصيل</div>
          <div className="mt-1 text-2xl text-[var(--text)]">{summary ? formatPrice(summary.totalShipping) : formatPrice(0)}</div>
        </div>
      </div>

      <p className="mb-4 text-sm font-bold text-[var(--muted)]">إجمالي النتائج: {total}</p>

      {orders.length === 0 ? (
        <div className="rounded-[24px] border border-[var(--border)] bg-white p-6 text-sm font-bold text-[var(--muted)] shadow-soft">
          لا توجد طلبات مطابقة للبحث الحالي.
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <details
              className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-soft"
              key={order.id}
            >
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-black text-[var(--teal)]">
                        {order.publicId}
                      </p>
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${statusBadgeClass[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <h2 className="mt-1 text-xl font-black text-[var(--text)]">
                      {order.customerName}
                    </h2>
                    <p className="mt-2 text-sm font-bold leading-7 text-[var(--muted)]">
                      {order.customerPhone} · {order.governorate}
                      {order.city ? ` · ${order.city}` : ""}
                    </p>
                    {order.alternatePhone ? (
                      <p className="text-sm font-bold leading-7 text-[var(--muted)]">
                        رقم إضافي: {order.alternatePhone}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid gap-2 text-sm font-black text-[var(--primary)]">
                    <span>{formatPrice(order.total)}</span>
                    <span>{new Date(order.createdAt).toLocaleString("ar-EG")}</span>
                  </div>
                </div>
              </summary>

              <div className="mt-4 grid gap-4 border-t border-[var(--border)] pt-4">
                <div>
                  <p className="mt-2 text-sm font-bold leading-7 text-[var(--muted)]">
                    الهاتف: {order.customerPhone}
                    {order.alternatePhone ? ` - رقم إضافي: ${order.alternatePhone}` : ""}
                    <br />
                    العنوان: {order.governorate}
                    {order.city ? ` - ${order.city}` : ""} - {order.address}
                  </p>
                  {order.notes ? (
                    <p className="mt-2 rounded-2xl bg-[var(--soft-surface)] p-3 text-sm font-bold text-[var(--muted)]">
                      ملاحظات: {order.notes}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-2 rounded-2xl bg-[var(--soft-surface)] p-4 text-sm font-bold text-[var(--muted)]">
                  {order.items.map((item) => (
                    <div className="grid gap-1 sm:grid-cols-[1fr_auto_auto_auto]" key={item.productSlug}>
                      <span>{item.productName}</span>
                      <span>الكمية: {item.quantity}</span>
                      <span>{formatPrice(item.unitPrice)}</span>
                      <span>{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))}
                  <div className="mt-2 grid gap-1 border-t border-[var(--border)] pt-3 text-[var(--primary)] sm:grid-cols-3">
                    <span>الفرعي: {formatPrice(order.subtotal)}</span>
                    <span>الشحن: {formatPrice(order.shipping)}</span>
                    <span>الإجمالي: {formatPrice(order.total)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form action={updateOrderStatus} className="flex flex-wrap gap-2">
                  <input name="id" type="hidden" value={order.id} />
                  <input name="returnTo" type="hidden" value={currentFilteredPath} />
                  <select
                    className="min-h-11 rounded-2xl border border-[var(--border)] bg-white px-3 text-sm font-bold"
                    defaultValue={order.status}
                    name="status"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <SubmitButton className="btn-secondary min-h-11 px-4" pendingText="جار الحفظ...">
                    حفظ
                  </SubmitButton>
                </form>
                <a
                  className="btn-primary min-h-11 px-4"
                  href={createWhatsAppUrl(buildWhatsAppOrderMessage(order, settings.storeName), settings.whatsappNumber)}
                  rel="noreferrer"
                  target="_blank"
                >
                  واتساب
                </a>
              </div>
              </div>
            </details>
          ))}
        </div>
      )}
      {totalPages > 1 ? (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {page > 1 ? (
            <a className="btn-secondary min-h-10 px-4" href={getPageHref({ page: page - 1, query, status })}>
              السابق
            </a>
          ) : null}
          <span className="grid min-h-10 place-items-center rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-black text-[var(--muted)]">
            صفحة {page} من {totalPages}
          </span>
          {page < totalPages ? (
            <a className="btn-secondary min-h-10 px-4" href={getPageHref({ page: page + 1, query, status })}>
              التالي
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

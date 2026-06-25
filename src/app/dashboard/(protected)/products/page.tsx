import Image from "next/image";
import { deactivateProduct, saveProduct } from "../actions";
import { ConfirmSubmitButton } from "@/components/dashboard/ConfirmSubmitButton";
import { Notice } from "@/components/dashboard/Notice";
import { ProductImageField } from "@/components/dashboard/ProductImageField";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import { getCategories, getProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/storeConfig";

const inputClass =
  "min-h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text)] outline-none transition focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--ring)]";

type DashboardProductsPageProps = {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
    active?: string;
    stock?: string;
    success?: string;
    error?: string;
  }>;
};

const pageSize = 12;

const getProductsHref = ({
  page,
  query,
  category,
  active,
  stock,
}: {
  page: number;
  query: string;
  category: string;
  active: string;
  stock: string;
}) => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category && category !== "all") params.set("category", category);
  if (active && active !== "all") params.set("active", active);
  if (stock && stock !== "all") params.set("stock", stock);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `/dashboard/products?${search}` : "/dashboard/products";
};

export default async function DashboardProductsPage({
  searchParams,
}: DashboardProductsPageProps) {
  const params = await searchParams;
  const query = String(params.q ?? "").trim().toLowerCase();
  const category = String(params.category ?? "all");
  const active = ["all", "active", "inactive"].includes(String(params.active))
    ? String(params.active)
    : "all";
  const stock = ["all", "low", "out"].includes(String(params.stock))
    ? String(params.stock)
    : "all";
  const page = Math.max(Number(params.page ?? 1) || 1, 1);
  const [categories, products] = await Promise.all([
    getCategories(true),
    getProducts(true),
  ]);
  const filteredProducts = products.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.slug.toLowerCase().includes(query);
    const matchesCategory = category === "all" || product.categorySlug === category;
    const matchesActive =
      active === "all" ||
      (active === "active" && product.isActive !== false) ||
      (active === "inactive" && product.isActive === false);
    const matchesStock =
      stock === "all" ||
      (stock === "low" && product.stock > 0 && product.stock <= 5) ||
      (stock === "out" && product.stock === 0);
    return matchesQuery && matchesCategory && matchesActive && matchesStock;
  });
  const totalPages = Math.max(Math.ceil(filteredProducts.length / pageSize), 1);
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const currentPath = getProductsHref({ page: currentPage, query, category, active, stock });

  return (
    <section>
      <div className="mb-5">
        <p className="text-sm font-black text-[var(--teal)]">إدارة المنتجات</p>
        <h1 className="mt-1 text-3xl font-black text-[var(--text)]">المنتجات</h1>
      </div>
      <Notice message={params.success} />
      <Notice message={params.error} type="error" />

      <form className="mb-5 grid gap-3 rounded-[24px] border border-[var(--border)] bg-white p-4 shadow-soft md:grid-cols-[1fr_repeat(3,180px)_auto]" method="get">
        <input className={inputClass} defaultValue={query} name="q" placeholder="بحث بالاسم أو slug" />
        <select className={inputClass} defaultValue={category} name="category">
          <option value="all">كل الفئات</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select className={inputClass} defaultValue={active} name="active">
          <option value="all">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>
        <select className={inputClass} defaultValue={stock} name="stock">
          <option value="all">كل المخزون</option>
          <option value="low">مخزون منخفض</option>
          <option value="out">نفد المخزون</option>
        </select>
        <button className="btn-primary min-h-11 px-4" type="submit">
          تطبيق
        </button>
      </form>

      <form
        action={saveProduct}
        className="mb-5 grid gap-3 rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-soft lg:grid-cols-4"
      >
        <input name="returnTo" type="hidden" value={currentPath} />
        <input className={inputClass} name="name" placeholder="اسم المنتج" required />
        <div className="grid gap-1">
          <input className={inputClass} dir="ltr" name="slug" placeholder="slug (اختياري - يتم إنشاؤه تلقائياً)" />
          <p className="text-xs text-[var(--muted)]">
            يمكنك ترك هذا الحقل فارغاً، وسيقوم النظام بإنشاء الرابط تلقائياً من اسم المنتج.
          </p>
        </div>
        <select className={inputClass} name="categoryId" required>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input className={inputClass} name="price" placeholder="السعر" required type="number" />
        <input className={inputClass} name="oldPrice" placeholder="السعر قبل الخصم" type="number" />
        <input className={inputClass} name="stock" placeholder="المخزون" type="number" />
        <ProductImageField inputClass={inputClass} />
        <textarea className={`${inputClass} min-h-24 lg:col-span-4`} name="description" placeholder="الوصف" />
        <label className="flex items-center gap-2 text-sm font-bold">
          <input defaultChecked name="isActive" type="checkbox" /> نشط
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input name="featured" type="checkbox" /> مميز
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input name="bestSeller" type="checkbox" /> الأكثر طلبًا
        </label>
        <label className="grid gap-1 text-sm font-bold lg:col-span-2">
          <span className="flex items-center gap-2">
            <input name="isBestSeller" type="checkbox" /> الأكثر مبيعًا
          </span>
          <span className="text-xs font-semibold leading-5 text-[var(--muted)]">
            يظهر المنتج في قسم الأكثر مبيعًا في الصفحة الرئيسية عند تفعيل هذا الخيار.
          </span>
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input name="isNew" type="checkbox" /> جديد
        </label>
        <SubmitButton className="btn-primary lg:col-span-4" pendingText="جار إضافة المنتج...">
          إضافة منتج
        </SubmitButton>
      </form>

      <p className="mb-4 text-sm font-bold text-[var(--muted)]">
        إجمالي النتائج: {filteredProducts.length}
      </p>

      {visibleProducts.length === 0 ? (
        <div className="rounded-[24px] border border-[var(--border)] bg-white p-6 text-sm font-bold text-[var(--muted)] shadow-soft">
          لا توجد منتجات مطابقة للفلاتر الحالية.
        </div>
      ) : (
        <div className="grid gap-4">
        {visibleProducts.map((product) => (
          <details
            className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-soft"
            key={product.slug}
          >
            <summary className="grid cursor-pointer list-none gap-3 sm:grid-cols-[72px_1fr_auto] sm:items-center">
              <div className="relative size-16 overflow-hidden rounded-2xl bg-[var(--soft-surface)]">
                <Image alt={product.name} className="object-cover" fill sizes="64px" src={product.image} />
              </div>
              <div>
                <h2 className="text-lg font-black text-[var(--text)]">{product.name}</h2>
                <p className="text-sm font-bold text-[var(--muted)]">
                  {product.slug} · {formatPrice(product.price)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-black">
                <span className={`rounded-full px-3 py-1 ${product.isActive === false ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                  {product.isActive === false ? "غير نشط" : "نشط"}
                </span>
                <span className={`rounded-full px-3 py-1 ${product.stock === 0 ? "bg-red-50 text-red-700" : product.stock <= 5 ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                  المخزون: {product.stock}
                </span>
                {product.isBestSeller ? (
                  <span className="rounded-full bg-[var(--soft-peach)] px-3 py-1 text-[var(--coral)]">
                    الأكثر مبيعًا
                  </span>
                ) : null}
              </div>
            </summary>
            <form action={saveProduct} className="mt-4 grid gap-3 lg:grid-cols-4">
              <input name="returnTo" type="hidden" value={currentPath} />
              <input name="id" type="hidden" value={product.id} />
              <input className={inputClass} defaultValue={product.name} name="name" required />
              <div className="grid gap-1">
                <input className={inputClass} defaultValue={product.slug} dir="ltr" name="slug" />
                <p className="text-xs text-[var(--muted)]">
                  اختياري - سيتم الحفاظ على الرابط الحالي إذا لم تغيره.
                </p>
              </div>
              <select className={inputClass} defaultValue={categories.find((category) => category.slug === product.categorySlug)?.id} name="categoryId" required>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input className={inputClass} defaultValue={product.price} name="price" required type="number" />
              <input className={inputClass} defaultValue={product.oldPrice} name="oldPrice" type="number" />
              <input className={inputClass} defaultValue={product.stock} name="stock" type="number" />
              <ProductImageField defaultValue={product.image} inputClass={inputClass} />
              <textarea className={`${inputClass} min-h-24 lg:col-span-4`} defaultValue={product.description} name="description" />
              <label className="flex items-center gap-2 text-sm font-bold">
                <input defaultChecked={product.isActive !== false} name="isActive" type="checkbox" /> نشط
              </label>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input defaultChecked={product.featured} name="featured" type="checkbox" /> مميز
              </label>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input defaultChecked={product.bestSeller} name="bestSeller" type="checkbox" /> الأكثر طلبًا
              </label>
              <label className="grid gap-1 text-sm font-bold lg:col-span-2">
                <span className="flex items-center gap-2">
                  <input defaultChecked={product.isBestSeller} name="isBestSeller" type="checkbox" /> الأكثر مبيعًا
                </span>
                <span className="text-xs font-semibold leading-5 text-[var(--muted)]">
                  يظهر المنتج في قسم الأكثر مبيعًا في الصفحة الرئيسية عند تفعيل هذا الخيار.
                </span>
              </label>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input defaultChecked={product.isNew} name="isNew" type="checkbox" /> جديد
              </label>
              <SubmitButton className="btn-primary lg:col-span-3" pendingText="جار حفظ التعديل...">
                حفظ التعديل
              </SubmitButton>
            </form>
            <form action={deactivateProduct} className="mt-3">
              <input name="returnTo" type="hidden" value={currentPath} />
              <input name="id" type="hidden" value={product.id} />
              <ConfirmSubmitButton
                className="btn-secondary text-[var(--danger)]"
                message="هل تريد إلغاء تفعيل هذا المنتج؟"
              >
                إلغاء تفعيل المنتج
              </ConfirmSubmitButton>
            </form>
          </details>
        ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {currentPage > 1 ? (
            <a className="btn-secondary min-h-10 px-4" href={getProductsHref({ page: currentPage - 1, query, category, active, stock })}>
              السابق
            </a>
          ) : null}
          <span className="grid min-h-10 place-items-center rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-black text-[var(--muted)]">
            صفحة {currentPage} من {totalPages}
          </span>
          {currentPage < totalPages ? (
            <a className="btn-secondary min-h-10 px-4" href={getProductsHref({ page: currentPage + 1, query, category, active, stock })}>
              التالي
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

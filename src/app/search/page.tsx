import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SearchBox } from "@/components/store/SearchBox";
import { SectionHeader } from "@/components/store/SectionHeader";
import { searchProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "البحث | روقان",
  description: "ابحث في منتجات روقان المحلية.",
  alternates: {
    canonical: "/search",
  },
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const results = await searchProducts(query);

  return (
    <div className="container-shell container-shell-wide section-y">
      <SectionHeader
        description="اكتب اسم المنتج أو الفئة، وسنعرض لك النتائج من بيانات المتجر الحالية."
        eyebrow="بحث المنتجات"
        title={query ? `نتائج البحث عن: ${q}` : "ابحث في روقان"}
      />
      <div className="mb-6 max-w-2xl">
        <SearchBox initialQuery={q} />
      </div>
      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : (
        <EmptyState
          description="لم نجد منتجات مطابقة الآن. جرّب كلمة أبسط مثل مطبخ أو تنظيف."
          title="لا توجد نتائج"
        />
      )}
    </div>
  );
}

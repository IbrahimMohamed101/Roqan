import type { Metadata } from "next";
import { CategoryGrid } from "@/components/store/CategoryGrid";
import { SectionHeader } from "@/components/store/SectionHeader";
import { getCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "الفئات | روقان",
  description: "تصفح فئات منتجات روقان المنزلية والعصرية.",
  alternates: {
    canonical: "/categories",
  },
  openGraph: {
    description: "تصفح فئات منتجات روقان المنزلية والعصرية.",
    title: "الفئات | روقان",
    type: "website",
    url: "/categories",
  },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container-shell container-shell-wide section-y">
      <SectionHeader
        description="كل فئة مصممة لتسهيل وصولك للمنتج المناسب بسرعة."
        eyebrow="فئات المتجر"
        title="كل فئات روقان"
      />
      <CategoryGrid categories={categories} />
    </div>
  );
}

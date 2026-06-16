import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SectionHeader } from "@/components/store/SectionHeader";
import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/catalog";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  return {
    title: category ? `${category.name} | روقان` : "فئة غير موجودة | روقان",
    description: category?.description,
    alternates: {
      canonical: category ? `/category/${category.slug}` : undefined,
    },
    openGraph: category
      ? {
          description: category.description,
          title: `${category.name} | روقان`,
          type: "website",
          url: `/category/${category.slug}`,
        }
      : undefined,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = await getProductsByCategory(category.slug);

  return (
    <div className="container-shell section-y">
      <SectionHeader
        description={category.description}
        eyebrow={category.icon}
        title={category.name}
      />
      <ProductGrid products={categoryProducts} />
    </div>
  );
}

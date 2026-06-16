import type { Metadata } from "next";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SectionHeader } from "@/components/store/SectionHeader";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "العروض | روقان",
  description: "أفضل عروض وخصومات روقان على المنتجات المنزلية والعصرية.",
  alternates: {
    canonical: "/offers",
  },
  openGraph: {
    description: "أفضل عروض وخصومات روقان على المنتجات المنزلية والعصرية.",
    title: "العروض | روقان",
    type: "website",
    url: "/offers",
  },
};

export default async function OffersPage() {
  const products = await getProducts();
  const offerProducts = products.filter((product) => product.discount);

  return (
    <div className="container-shell section-y">
      <SectionHeader
        description="منتجات عليها خصومات حقيقية وأسعار مناسبة للبيت المصري."
        eyebrow="خصومات مختارة"
        title="عروض روقان"
      />
      <ProductGrid products={offerProducts} />
    </div>
  );
}

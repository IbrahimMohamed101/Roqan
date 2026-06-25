import { HeroSection } from "@/components/store/HeroSection";
import { SectionHeader } from "@/components/store/SectionHeader";
import HomepageProducts from "@/components/store/HomepageProducts";
import { getBestSellingProducts, getCatalog } from "@/lib/catalog";
import { getStoreSettings } from "@/lib/storeSettings";

export default async function Home() {
  const [{ categories, products }, bestSellingProducts, settings] = await Promise.all([
    getCatalog(),
    getBestSellingProducts(8),
    getStoreSettings(),
  ]);
  

  return (
    <div className="container-shell container-shell-wide">
      <div className="section-y">
        <HeroSection settings={settings} />
      </div>

      <section className="section-y">
        <SectionHeader
          action="كل الفئات"
          href="/categories"
          title="تسوق حسب الفئة"
        />
        <HomepageProducts
          products={products}
          categories={categories}
          bestSellingProducts={bestSellingProducts}
        />
      </section>

      
    </div>
  );
}

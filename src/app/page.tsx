import { HeroSection } from "@/components/store/HeroSection";
import { SectionHeader } from "@/components/store/SectionHeader";
import HomepageProducts from "@/components/store/HomepageProducts";
import { getCatalog } from "@/lib/catalog";

export default async function Home() {
  const { categories, products } = await getCatalog();
  

  return (
    <div className="container-shell">
      <div className="section-y">
        <HeroSection />
      </div>

      <section className="section-y">
        <SectionHeader
          action="كل الفئات"
          href="/categories"
          title="تسوق حسب الفئة"
        />
        <HomepageProducts products={products} categories={categories} />
      </section>

      
    </div>
  );
}

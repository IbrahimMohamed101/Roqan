import { CategoryGrid } from "@/components/store/CategoryGrid";
import { HeroSection } from "@/components/store/HeroSection";
import { ProductGrid } from "@/components/store/ProductGrid";
import { SectionHeader } from "@/components/store/SectionHeader";
import { getCatalog } from "@/lib/catalog";
import { createWhatsAppUrl } from "@/lib/storeConfig";

export default async function Home() {
  const { categories, products } = await getCatalog();
  const featuredProducts = products.filter((product) => product.featured);
  const bestSellerProducts = products.filter((product) => product.bestSeller);
  const newProducts = products.filter((product) => product.isNew);
  const offerProducts = products.filter((product) => product.discount);

  return (
    <div className="container-shell">
      <div className="section-y">
        <HeroSection />
      </div>

      <section className="section-y">
        <SectionHeader
          action="كل الفئات"
          description="اختيارات منظمة حسب استخدامك اليومي، من البيت والمطبخ إلى التقنية واللياقة."
          href="/categories"
          title="تسوق حسب الفئة"
        />
        <CategoryGrid categories={categories} />
      </section>

      <section className="section-y">
        <SectionHeader
          action="عرض المزيد"
          description="منتجات مختارة لتبدأ منها التسوق بسرعة."
          href="/categories"
          title="منتجات مميزة"
        />
        <ProductGrid products={featuredProducts.slice(0, 8)} />
      </section>

      <section className="section-y">
        <SectionHeader
          action="شاهد العروض"
          description="الأكثر طلبًا من عملاء روقان هذا الأسبوع."
          href="/offers"
          title="الأكثر مبيعًا"
        />
        <ProductGrid products={bestSellerProducts.slice(0, 4)} />
      </section>

      <section className="section-y">
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,var(--primary-dark)_0%,var(--primary)_58%,#17647f_100%)] p-5 text-white shadow-soft [--border:rgba(255,255,255,0.24)] [--muted:rgba(255,255,255,0.76)] [--text:#ffffff] sm:p-8">
          <SectionHeader
            action="كل العروض"
            description="خصومات واضحة على منتجات عملية بدون زحمة أو مبالغة."
            href="/offers"
            title="عروض روقان"
          />
          <ProductGrid products={offerProducts.slice(0, 4)} />
        </div>
      </section>

      <section className="section-y">
        <SectionHeader
          description="وصل حديثًا للمتجر، مناسب للهدايا والاستخدام اليومي."
          title="وصل حديثًا"
        />
        <ProductGrid products={newProducts.slice(0, 8)} />
      </section>

      <section className="section-y">
        <div className="rounded-[28px] border border-[rgba(17,155,181,0.2)] bg-[linear-gradient(135deg,#E8F8FB_0%,#FFFFFF_100%)] p-6 shadow-soft sm:p-8">
          <p className="text-sm font-black text-[var(--teal)]">تحتاج مساعدة؟</p>
          <h2 className="mt-2 text-2xl font-black text-[var(--primary)] sm:text-3xl">
            اطلب المنتج أو اسألنا على واتساب.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            فريق روقان يساعدك تختار المنتج المناسب، ويؤكد تفاصيل الطلب قبل
            الشحن.
          </p>
          <a
            className="btn-primary mt-5"
            href={createWhatsAppUrl("مرحبًا روقان، أحتاج مساعدة في اختيار منتج.")}
            rel="noreferrer"
            target="_blank"
          >
            تواصل عبر واتساب
          </a>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DiscountBadge } from "@/components/store/DiscountBadge";
import { PriceDisplay } from "@/components/store/PriceDisplay";
import { ProductGrid } from "@/components/store/ProductGrid";
import { ProductActions } from "@/components/store/ProductActions";
import { SectionHeader } from "@/components/store/SectionHeader";
import {
  getCategoryBySlug,
  getProductBySlug,
  getProducts,
  getProductsByCategory,
} from "@/lib/catalog";
import { createWhatsAppUrl, storeConfig } from "@/lib/storeConfig";
import { getStoreSettings } from "@/lib/storeSettings";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product ? `${product.name} | روقان` : "منتج غير موجود | روقان",
    description: product?.description,
    alternates: {
      canonical: product ? `/product/${product.slug}` : undefined,
    },
    openGraph: product
      ? {
          description: product.description,
          images: [{ alt: product.name, url: product.image }],
          title: `${product.name} | ${storeConfig.nameAr}`,
          type: "website",
          url: `/product/${product.slug}`,
        }
      : undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [category, categoryProducts, settings] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getProductsByCategory(product.categorySlug),
    getStoreSettings(),
  ]);
  const relatedProducts = categoryProducts
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    description: product.description,
    image: product.image,
    name: product.name,
    offers: {
      "@type": "Offer",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      price: product.price,
      priceCurrency: "EGP",
      url: `${storeConfig.siteUrl}/product/${product.slug}`,
    },
  };

  return (
    <div className="container-shell section-y">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        type="application/ld+json"
      />
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--border)] bg-white shadow-soft">
          <Image
            alt={product.name}
            className="object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={product.image}
          />
          <span className="absolute right-4 top-4">
            <DiscountBadge discount={product.discount} />
          </span>
        </div>
        <section className="rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-soft sm:p-7">
          {category ? (
            <Link
              className="mb-4 inline-flex rounded-full border border-[rgba(17,155,181,0.16)] bg-[var(--light-cyan)] px-4 py-2 text-sm font-black text-[var(--teal)]"
              href={`/category/${category.slug}`}
            >
              {category.icon} {category.name}
            </Link>
          ) : null}
          <h1 className="text-3xl font-black leading-[1.25] text-[var(--text)] sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">
            {product.description}
          </p>
          <div className="mt-5">
            <PriceDisplay oldPrice={product.oldPrice} price={product.price} />
          </div>
          <p className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1.5 text-sm font-black text-[var(--success)]">
            {product.stock > 0 ? `متوفر (${product.stock} قطعة)` : "غير متوفر حاليا"}
          </p>
          {product.stock <= 0 ? (
            <p className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-[var(--danger)]">
              هذا المنتج غير متوفر حاليًا. يمكنك التواصل معنا عبر واتساب لمعرفة
              موعد التوفر أو اقتراح بديل.
            </p>
          ) : null}
          <div className="mt-5 grid gap-3 rounded-2xl bg-[var(--soft-surface)] p-4 text-sm font-bold leading-6 text-[var(--muted)] sm:grid-cols-3">
            <span>تأكيد قبل الشحن</span>
            <span>دفع عند الاستلام</span>
            <span>دعم واتساب</span>
          </div>
          <div className="mt-6">
            <ProductActions product={product} />
          </div>
          <a
            className="btn-secondary mt-3 w-full"
            href={createWhatsAppUrl(`مرحبًا ${settings.storeName}، أريد طلب ${product.name}`, settings.whatsappNumber) || undefined}
            rel="noreferrer"
            target="_blank"
          >
            {product.stock > 0 ? "طلب سريع عبر واتساب" : "اسأل عن موعد التوفر"}
          </a>
        </section>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="section-y">
          <SectionHeader title="منتجات مشابهة" />
          <ProductGrid products={relatedProducts} />
        </section>
      ) : null}
    </div>
  );
}

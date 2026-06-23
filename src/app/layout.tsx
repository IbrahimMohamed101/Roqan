import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { StoreFooter } from "@/components/store/StoreFooter";
import { StoreHeader } from "@/components/store/StoreHeader";
import MobileBottomNav from "@/components/ui/MobileBottomNav";
import { getProducts } from "@/lib/catalog";
import { storeConfig } from "@/lib/storeConfig";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(storeConfig.siteUrl),
  title: "روقان | متجر المنتجات المتنوعة والعصرية",
  description:
    "تسوق منتجات منزلية وعصرية من روقان بتجربة عربية بسيطة، دفع عند الاستلام، وشحن سريع داخل مصر.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "روقان | متجر المنتجات المتنوعة والعصرية",
    description:
      "منتجات منزلية وعصرية بتجربة عربية بسيطة، دفع عند الاستلام، وتأكيد عبر واتساب.",
    locale: "ar_EG",
    siteName: storeConfig.nameAr,
    type: "website",
    url: "/",
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getProducts();

  return (
    <html dir="rtl" lang="ar">
      <body className={`${cairo.variable} antialiased`}>
        <CartProvider products={products}>
          <StoreHeader />
          <main className="pb-20 sm:pb-0">{children}</main>
          <StoreFooter />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}

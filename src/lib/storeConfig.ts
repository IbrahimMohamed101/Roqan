export const storeConfig = {
  nameAr: "روقان",
  nameEn: "Rooqan",
  tagline: "متجر المنتجات المتنوعة والعصرية",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://rooqan.store",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201000000000",
  phone: "01000000000",
  email: "hello@rooqan.store",
  address: "القاهرة، مصر",
};

export const SHIPPING_FEE = 60;

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);

export const createWhatsAppUrl = (message: string) =>
  `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(message)}`;

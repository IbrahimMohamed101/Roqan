import type { Category } from "@/types/product";

export const categories: Category[] = [
  {
    slug: "home-tools",
    name: "أدوات منزلية",
    icon: "🏠",
    description: "حلول ذكية ومريحة لتنظيم البيت اليومي.",
    productCount: 3,
  },
  {
    slug: "kitchen",
    name: "مستلزمات المطبخ",
    icon: "🍳",
    description: "قطع عملية تجعل تجهيز الطعام أسهل وأنظف.",
    productCount: 3,
  },
  {
    slug: "cleaning",
    name: "مستلزمات التنظيف",
    icon: "🧽",
    description: "أدوات تنظيف خفيفة، قوية، وسهلة الاستخدام.",
    productCount: 3,
  },
  {
    slug: "personal-care",
    name: "العناية الشخصية",
    icon: "🧴",
    description: "منتجات يومية بتفاصيل لطيفة وجودة موثوقة.",
    productCount: 3,
  },
  {
    slug: "car",
    name: "مستلزمات السيارة",
    icon: "🚗",
    description: "إكسسوارات عملية للعناية بالسيارة وتنظيمها.",
    productCount: 3,
  },
  {
    slug: "tech",
    name: "إكسسوارات التكنولوجيا",
    icon: "🎧",
    description: "إضافات صغيرة تفرق في استخدامك اليومي.",
    productCount: 3,
  },
  {
    slug: "fitness",
    name: "الرياضة واللياقة",
    icon: "🏋️",
    description: "مستلزمات بسيطة لتمرين أسهل في البيت.",
    productCount: 3,
  },
  {
    slug: "toys",
    name: "ألعاب وترفيه",
    icon: "🎲",
    description: "اختيارات مرحة وخفيفة لكل أفراد الأسرة.",
    productCount: 3,
  },
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((category) => category.slug === slug);

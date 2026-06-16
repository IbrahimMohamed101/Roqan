import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import pg from "pg";

const { Pool } = pg;

const loadEnvLocal = () => {
  const envPath = resolve(process.cwd(), ".env.local");

  let file;
  try {
    file = readFileSync(envPath, "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }

  for (const line of file.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").trim();

    if (!process.env[key]) {
      process.env[key] = value.replace(/^['"]|['"]$/g, "");
    }
  }
};

loadEnvLocal();

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL. Add it to .env.local before running the seed.");
  process.exit(1);
}

if (process.env.SEED_DATABASE !== "true") {
  console.error(
    "Refusing to seed without explicit confirmation. Run with SEED_DATABASE=true npm run db:seed",
  );
  process.exit(1);
}

const image = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

const categories = [
  {
    slug: "kitchen-tools",
    name: "أدوات المطبخ",
    icon: "م",
    description: "منتجات عملية لتجهيز المطبخ وتنظيمه وتسهيل الطبخ اليومي.",
    sortOrder: 10,
    isActive: true,
  },
  {
    slug: "home-organization",
    name: "تنظيم المنزل",
    icon: "ت",
    description: "حلول تخزين وترتيب تساعد على استغلال المساحات الصغيرة بذكاء.",
    sortOrder: 20,
    isActive: true,
  },
  {
    slug: "cleaning",
    name: "التنظيف",
    icon: "ن",
    description: "أدوات تنظيف خفيفة ومناسبة للاستخدام اليومي في كل ركن بالبيت.",
    sortOrder: 30,
    isActive: true,
  },
  {
    slug: "personal-care",
    name: "العناية الشخصية",
    icon: "ع",
    description: "اختيارات يومية للعناية والراحة داخل البيت وخارجه.",
    sortOrder: 40,
    isActive: true,
  },
  {
    slug: "home-accessories",
    name: "إكسسوارات المنزل",
    icon: "ك",
    description: "إضافات صغيرة تمنح البيت لمسة منظمة وأنيقة.",
    sortOrder: 50,
    isActive: true,
  },
  {
    slug: "offers",
    name: "منتجات العروض",
    icon: "ض",
    description: "منتجات مختارة بأسعار تجريبية مناسبة للعروض والاختبارات.",
    sortOrder: 60,
    isActive: true,
  },
];

const products = [
  {
    slug: "fridge-storage-box",
    name: "علبة تنظيم الثلاجة",
    categorySlug: "kitchen-tools",
    description: "علبة شفافة تساعد على ترتيب الخضار والفواكه واستغلال مساحة الثلاجة.",
    imageUrl: image("1588964895597-cfccd6e2dbf9"),
    price: 249,
    oldPrice: 329,
    stock: 36,
    featured: true,
    bestSeller: true,
    isNew: false,
    isActive: true,
  },
  {
    slug: "foldable-kitchen-shelf",
    name: "رف مطبخ قابل للطي",
    categorySlug: "kitchen-tools",
    description: "رف معدني صغير لترتيب الأطباق والبرطمانات بدون شغل مساحة كبيرة.",
    imageUrl: image("1556911220-bff31c812dba"),
    price: 315,
    oldPrice: 399,
    stock: 22,
    featured: true,
    bestSeller: false,
    isNew: true,
    isActive: true,
  },
  {
    slug: "silicone-sink-strainer",
    name: "مصفاة حوض سيليكون",
    categorySlug: "kitchen-tools",
    description: "مصفاة مرنة تمنع بقايا الطعام وتحافظ على الحوض نظيفا بعد الطبخ.",
    imageUrl: image("1556911220-bff31c812dba"),
    price: 95,
    oldPrice: null,
    stock: 70,
    featured: false,
    bestSeller: false,
    isNew: true,
    isActive: true,
  },
  {
    slug: "glass-spice-jars",
    name: "عبوات بهارات زجاجية",
    categorySlug: "kitchen-tools",
    description: "طقم عبوات زجاجية بغطاء محكم لتنظيم التوابل داخل درج أو رف المطبخ.",
    imageUrl: image("1519996529931-28324d5a630e"),
    price: 260,
    oldPrice: 330,
    stock: 28,
    featured: false,
    bestSeller: true,
    isNew: false,
    isActive: true,
  },
  {
    slug: "silicone-spoon-set",
    name: "طقم ملاعق سيليكون",
    categorySlug: "kitchen-tools",
    description: "ملاعق طبخ مقاومة للحرارة وتحافظ على الأواني من الخدوش.",
    imageUrl: image("1556911220-bff31c812dba"),
    price: 340,
    oldPrice: 420,
    stock: 31,
    featured: false,
    bestSeller: false,
    isNew: false,
    isActive: true,
  },
  {
    slug: "oil-spray-bottle",
    name: "بخاخ زيت للمطبخ",
    categorySlug: "kitchen-tools",
    description: "بخاخ عملي للتحكم في كمية الزيت أثناء الطبخ والشوي والتحمير.",
    imageUrl: image("1556911220-bff31c812dba"),
    price: 155,
    oldPrice: 199,
    stock: 55,
    featured: true,
    bestSeller: true,
    isNew: true,
    isActive: true,
  },
  {
    slug: "metal-clothes-stand",
    name: "ستاند ملابس معدني",
    categorySlug: "home-organization",
    description: "ستاند ثابت لتعليق الملابس اليومية مع رف سفلي للأحذية أو الصناديق.",
    imageUrl: image("1595428774223-ef52624120d2"),
    price: 899,
    oldPrice: 1199,
    stock: 15,
    featured: true,
    bestSeller: true,
    isNew: false,
    isActive: true,
  },
  {
    slug: "multi-use-drawer-organizer",
    name: "منظم أدراج متعدد الاستخدام",
    categorySlug: "home-organization",
    description: "فواصل عملية لترتيب الملابس الصغيرة والإكسسوارات داخل الأدراج.",
    imageUrl: image("1586023492125-27b2c045efd7"),
    price: 210,
    oldPrice: 280,
    stock: 44,
    featured: false,
    bestSeller: false,
    isNew: true,
    isActive: true,
  },
  {
    slug: "fabric-storage-basket",
    name: "سلة تخزين قماش",
    categorySlug: "home-organization",
    description: "سلة خفيفة للغرف والدولاب مناسبة للبطاطين والألعاب والملابس.",
    imageUrl: image("1586023492125-27b2c045efd7"),
    price: 180,
    oldPrice: null,
    stock: 38,
    featured: false,
    bestSeller: true,
    isNew: false,
    isActive: true,
  },
  {
    slug: "over-door-hooks",
    name: "علاقة أبواب متعددة",
    categorySlug: "home-organization",
    description: "علاقة سهلة التركيب خلف الأبواب لتعليق الشنط والمناشف والملابس.",
    imageUrl: image("1584622650111-993a426fbf0a"),
    price: 165,
    oldPrice: 220,
    stock: 48,
    featured: false,
    bestSeller: false,
    isNew: false,
    isActive: true,
  },
  {
    slug: "compact-shoe-organizer",
    name: "منظم أحذية صغير",
    categorySlug: "home-organization",
    description: "منظم يوفر مساحة داخل الجزامة أو أسفل السرير ويحافظ على شكل الأحذية.",
    imageUrl: image("1586023492125-27b2c045efd7"),
    price: 230,
    oldPrice: 299,
    stock: 27,
    featured: false,
    bestSeller: false,
    isNew: true,
    isActive: true,
  },
  {
    slug: "practical-cleaning-mop",
    name: "مساحة تنظيف عملية",
    categorySlug: "cleaning",
    description: "مساحة سهلة العصر مناسبة للأرضيات والسيراميك والاستخدام اليومي.",
    imageUrl: image("1527515637462-cff94eecc1ac"),
    price: 310,
    oldPrice: 410,
    stock: 33,
    featured: true,
    bestSeller: true,
    isNew: false,
    isActive: true,
  },
  {
    slug: "glass-cleaning-brush",
    name: "فرشاة تنظيف الزجاج",
    categorySlug: "cleaning",
    description: "فرشاة بمسكة مريحة لتنظيف الزجاج والمرايا والوصول للحواف بسهولة.",
    imageUrl: image("1585421514284-efb74c2b69ba"),
    price: 185,
    oldPrice: 240,
    stock: 42,
    featured: false,
    bestSeller: false,
    isNew: true,
    isActive: true,
  },
  {
    slug: "microfiber-towel",
    name: "منشفة مايكروفايبر",
    categorySlug: "cleaning",
    description: "منشفة ناعمة وسريعة الامتصاص للتنظيف بدون ترك آثار أو خدوش.",
    imageUrl: image("1527515637462-cff94eecc1ac"),
    price: 120,
    oldPrice: null,
    stock: 90,
    featured: false,
    bestSeller: true,
    isNew: false,
    isActive: true,
  },
  {
    slug: "sports-water-bottle",
    name: "زجاجة مياه رياضية",
    categorySlug: "personal-care",
    description: "زجاجة خفيفة مناسبة للعمل والتمرين والخروج اليومي.",
    imageUrl: image("1523362628745-0c100150b504"),
    price: 220,
    oldPrice: 280,
    stock: 40,
    featured: true,
    bestSeller: false,
    isNew: true,
    isActive: true,
  },
  {
    slug: "travel-care-organizer",
    name: "منظم عناية للسفر",
    categorySlug: "personal-care",
    description: "حقيبة صغيرة لترتيب أدوات العناية الشخصية في السفر أو النادي.",
    imageUrl: image("1522335789203-aabd1fc54bc9"),
    price: 285,
    oldPrice: 350,
    stock: 24,
    featured: false,
    bestSeller: false,
    isNew: false,
    isActive: true,
  },
  {
    slug: "silicone-face-brush",
    name: "فرشاة سيليكون للوجه",
    categorySlug: "personal-care",
    description: "فرشاة لطيفة للتنظيف اليومي بملمس ناعم وسهلة الغسل.",
    imageUrl: image("1571781926291-c477ebfd024b"),
    price: 145,
    oldPrice: null,
    stock: 50,
    featured: false,
    bestSeller: false,
    isNew: true,
    isActive: true,
  },
  {
    slug: "elegant-tissue-holder",
    name: "حامل مناديل أنيق",
    categorySlug: "home-accessories",
    description: "حامل بسيط يضيف لمسة مرتبة لطاولة السفرة أو المكتب.",
    imageUrl: image("1513519245088-0e12902e5a38"),
    price: 190,
    oldPrice: 250,
    stock: 32,
    featured: true,
    bestSeller: false,
    isNew: false,
    isActive: true,
  },
  {
    slug: "desk-phone-stand",
    name: "حامل موبايل للمكتب",
    categorySlug: "home-accessories",
    description: "حامل قابل للطي للمكالمات والفيديو والعمل على المكتب براحة.",
    imageUrl: image("1516321318423-f06f85e504b3"),
    price: 185,
    oldPrice: null,
    stock: 46,
    featured: false,
    bestSeller: true,
    isNew: false,
    isActive: true,
  },
  {
    slug: "cable-organizer",
    name: "منظم كابلات",
    categorySlug: "home-accessories",
    description: "قطع صغيرة لتثبيت الشواحن والكابلات وتقليل فوضى المكتب.",
    imageUrl: image("1558618666-fcd25c85cd64"),
    price: 120,
    oldPrice: 160,
    stock: 85,
    featured: false,
    bestSeller: false,
    isNew: true,
    isActive: true,
  },
  {
    slug: "weekly-kitchen-bundle",
    name: "باقة مطبخ أسبوعية",
    categorySlug: "offers",
    description: "مجموعة اختبارية من أدوات المطبخ الأكثر طلبا بسعر عرض مناسب.",
    imageUrl: image("1519996529931-28324d5a630e"),
    price: 499,
    oldPrice: 680,
    stock: 18,
    featured: true,
    bestSeller: true,
    isNew: false,
    isActive: true,
  },
  {
    slug: "home-organization-bundle",
    name: "باقة تنظيم المنزل",
    categorySlug: "offers",
    description: "مجموعة منتجات تنظيم خفيفة لتجربة شكل المتجر والخصومات.",
    imageUrl: image("1586023492125-27b2c045efd7"),
    price: 599,
    oldPrice: 790,
    stock: 16,
    featured: true,
    bestSeller: false,
    isNew: true,
    isActive: true,
  },
];

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
});

const categoryUpsertSql = `
  insert into categories (
    slug,
    name,
    icon,
    description,
    sort_order,
    is_active,
    updated_at
  )
  values ($1, $2, $3, $4, $5, $6, now())
  on conflict (slug) do update set
    name = excluded.name,
    icon = excluded.icon,
    description = excluded.description,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active,
    updated_at = now()
  returning id, slug
`;

const productUpsertSql = `
  insert into products (
    category_id,
    slug,
    name,
    description,
    image_url,
    price,
    old_price,
    stock,
    featured,
    best_seller,
    is_new,
    is_active,
    updated_at
  )
  values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now())
  on conflict (slug) do update set
    category_id = excluded.category_id,
    name = excluded.name,
    description = excluded.description,
    image_url = excluded.image_url,
    price = excluded.price,
    old_price = excluded.old_price,
    stock = excluded.stock,
    featured = excluded.featured,
    best_seller = excluded.best_seller,
    is_new = excluded.is_new,
    is_active = excluded.is_active,
    updated_at = now()
`;

const seed = async () => {
  const client = await pool.connect();

  try {
    await client.query("begin");

    const categoryIds = new Map();

    for (const category of categories) {
      const result = await client.query(categoryUpsertSql, [
        category.slug,
        category.name,
        category.icon,
        category.description,
        category.sortOrder,
        category.isActive,
      ]);

      categoryIds.set(result.rows[0].slug, result.rows[0].id);
    }

    for (const product of products) {
      const categoryId = categoryIds.get(product.categorySlug);

      if (!categoryId) {
        throw new Error(`Missing category for product ${product.slug}: ${product.categorySlug}`);
      }

      await client.query(productUpsertSql, [
        categoryId,
        product.slug,
        product.name,
        product.description,
        product.imageUrl,
        product.price,
        product.oldPrice,
        product.stock,
        product.featured,
        product.bestSeller,
        product.isNew,
        product.isActive,
      ]);
    }

    await client.query("commit");

    console.log(`Seed complete: ${categories.length} categories and ${products.length} products upserted.`);
  } catch (error) {
    await client.query("rollback");
    console.error("Seed failed. No changes were committed.");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

seed();

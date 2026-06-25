import "server-only";

import type { Category, Product } from "@/types/product";
import { categories as fallbackCategories } from "@/data/categories";
import { products as fallbackProducts } from "@/data/products";
import { hasDatabaseUrl, query } from "@/lib/db";

type CategoryRow = {
  id: number;
  slug: string;
  name: string;
  icon: string | null;
  image_url?: string | null;
  description: string | null;
  product_count: string;
  sort_order?: number;
  is_active?: boolean;
};

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  category_slug: string;
  price: string;
  old_price: string | null;
  image_url: string;
  description: string | null;
  stock: number;
  featured: boolean;
  best_seller: boolean;
  is_best_seller: boolean;
  is_new: boolean;
  is_active: boolean;
};

const mapCategory = (row: CategoryRow): Category => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  icon: row.icon ?? "•",
  image: row.image_url ?? undefined,
  description: row.description ?? "",
  productCount: Number(row.product_count),
  sortOrder: row.sort_order,
  isActive: row.is_active,
});

const mapProduct = (row: ProductRow): Product => {
  const price = Number(row.price);
  const oldPrice = row.old_price ? Number(row.old_price) : undefined;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categorySlug: row.category_slug,
    price,
    oldPrice,
    discount:
      oldPrice && oldPrice > price
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : undefined,
    image: row.image_url,
    description: row.description ?? "",
    stock: row.stock,
    featured: row.featured,
    bestSeller: row.best_seller,
    isBestSeller: row.is_best_seller,
    isNew: row.is_new,
    isActive: row.is_active,
  };
};

const fallbackCatalog = () => ({
  categories: fallbackCategories,
  products: fallbackProducts,
});

let hasProductIsBestSellerColumn: boolean | null = null;

const isProduction = () => process.env.NODE_ENV === "production";

const getFallbackCategories = () => {
  if (isProduction()) {
    throw new Error("DATABASE_URL is required to load categories in production.");
  }

  return fallbackCategories;
};

const getFallbackProducts = () => {
  if (isProduction()) {
    throw new Error("DATABASE_URL is required to load products in production.");
  }

  return fallbackProducts;
};

const handleCatalogError = (message: string, error: unknown) => {
  if (isProduction()) {
    console.error(message);
    throw error;
  }

  console.error(message, error);
};

const productIsBestSellerSelect = async () => {
  if (hasProductIsBestSellerColumn === true) {
    return "p.is_best_seller";
  }

  const result = await query<{ exists: boolean }>(
    `
      select exists (
        select 1
        from information_schema.columns
        where table_schema = 'public'
          and table_name = 'products'
          and column_name = 'is_best_seller'
      ) as exists
    `,
  );

  hasProductIsBestSellerColumn = result.rows[0]?.exists === true;

  return hasProductIsBestSellerColumn ? "p.is_best_seller" : "false";
};

export const getCategories = async (includeInactive = false): Promise<Category[]> => {
  if (!hasDatabaseUrl()) {
    const categories = getFallbackCategories();
    return includeInactive ? categories : categories.filter((category) => category.isActive !== false);
  }

  try {
    // Check if image_url column exists (migration might not be applied yet)
    const colCheck = await query<{ column_name: string }>(
      `select column_name from information_schema.columns where table_name = 'categories' and column_name = 'image_url' limit 1`
    );
    const selectImage = colCheck.rows.length > 0 ? "c.image_url," : "";

    const result = await query<CategoryRow>(
      `
        select
          c.id,
          c.slug,
          c.name,
          c.icon,
          ${selectImage}
          c.description,
          c.sort_order,
          c.is_active,
          count(p.id) as product_count
        from categories c
        left join products p
          on p.category_id = c.id
          and ($1::boolean = true or p.is_active = true)
        where ($1::boolean = true or c.is_active = true)
        group by c.id
        order by c.sort_order asc, c.name asc
      `,
      [includeInactive],
    );

    return result.rows.map(mapCategory);
  } catch (error) {
    handleCatalogError("Failed to load categories from database.", error);
    return fallbackCategories;
  }
};

export const getProducts = async (includeInactive = false): Promise<Product[]> => {
  if (!hasDatabaseUrl()) {
    return getFallbackProducts();
  }

  try {
    const isBestSellerSelect = await productIsBestSellerSelect();
    const result = await query<ProductRow>(
      `
        select
          p.id,
          p.slug,
          p.name,
          c.slug as category_slug,
          p.price,
          p.old_price,
          p.image_url,
          p.description,
          p.stock,
          p.featured,
          p.best_seller,
          ${isBestSellerSelect} as is_best_seller,
          p.is_new,
          p.is_active
        from products p
        join categories c on c.id = p.category_id
        where ($1::boolean = true or (p.is_active = true and c.is_active = true))
        order by p.created_at desc, p.id desc
      `,
      [includeInactive],
    );

    return result.rows.map(mapProduct);
  } catch (error) {
    handleCatalogError("Failed to load products from database.", error);
    return fallbackProducts;
  }
};

export const getBestSellingProducts = async (limit = 8): Promise<Product[]> => {
  if (!hasDatabaseUrl()) {
    return getFallbackProducts()
      .filter((product) => product.isActive !== false && product.isBestSeller)
      .slice(0, limit);
  }

  try {
    const isBestSellerSelect = await productIsBestSellerSelect();
    if (isBestSellerSelect === "false") {
      return [];
    }

    const result = await query<ProductRow>(
      `
        select
          p.id,
          p.slug,
          p.name,
          c.slug as category_slug,
          p.price,
          p.old_price,
          p.image_url,
          p.description,
          p.stock,
          p.featured,
          p.best_seller,
          ${isBestSellerSelect} as is_best_seller,
          p.is_new,
          p.is_active
        from products p
        join categories c on c.id = p.category_id
        where p.is_active = true
          and c.is_active = true
          and p.is_best_seller = true
        order by p.created_at desc, p.id desc
        limit $1
      `,
      [limit],
    );

    return result.rows.map(mapProduct);
  } catch (error) {
    handleCatalogError("Failed to load best-selling products from database.", error);
    return fallbackProducts
      .filter((product) => product.isActive !== false && product.isBestSeller)
      .slice(0, limit);
  }
};

export const getCatalog = async () => {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return { categories, products };
};

export const getProductBySlug = async (slug: string) => {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
};

export const getCategoryBySlug = async (slug: string) => {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug);
};

export const getProductsByCategory = async (slug: string) => {
  const products = await getProducts();
  return products.filter((product) => product.categorySlug === slug);
};

export const searchProducts = async (term: string) => {
  const queryText = term.trim().toLowerCase();
  const { categories, products } = await getCatalog();

  if (!queryText) {
    return products;
  }

  return products.filter((product) => {
    const category = categories.find((item) => item.slug === product.categorySlug);
    return [product.name, product.description, category?.name]
      .join(" ")
      .toLowerCase()
      .includes(queryText);
  });
};

export const getFallbackCatalog = fallbackCatalog;

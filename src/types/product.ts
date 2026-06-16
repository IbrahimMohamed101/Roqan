export type Category = {
  id?: number;
  slug: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
  sortOrder?: number;
  isActive?: boolean;
};

export type Product = {
  id?: number;
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  description: string;
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  isActive?: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

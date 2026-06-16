import type { CartItem } from "@/types/product";

export type OrderStatus = "new" | "confirmed" | "shipped" | "cancelled";

export type CheckoutPayload = {
  name: string;
  phone: string;
  alternatePhone?: string;
  governorate: string;
  city?: string;
  address: string;
  notes?: string;
  items: {
    slug: string;
    quantity: number;
  }[];
};

export type OrderItemRecord = {
  productSlug: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type OrderRecord = {
  id: number;
  publicId: string;
  customerName: string;
  customerPhone: string;
  alternatePhone?: string;
  governorate: string;
  city?: string;
  address: string;
  notes?: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItemRecord[];
};

export const cartItemsToCheckoutItems = (items: CartItem[]) =>
  items.map((item) => ({
    slug: item.product.slug,
    quantity: item.quantity,
  }));

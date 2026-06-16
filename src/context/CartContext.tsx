"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product } from "@/types/product";

type StoredCartItem = {
  slug: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  increaseItem: (slug: string) => void;
  decreaseItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "rooqan-cart";

const readStoredItems = (): StoredCartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item): item is StoredCartItem =>
          typeof item?.slug === "string" &&
          Number.isFinite(item?.quantity) &&
          item.quantity > 0,
      )
      .map((item) => ({
        slug: item.slug,
        quantity: Math.min(Math.floor(item.quantity), 99),
      }));
  } catch {
    return [];
  }
};

const hydrateStoredItems = (
  storedItems: StoredCartItem[],
  products: Product[],
): CartItem[] =>
  storedItems
    .map((storedItem) => {
      const product = products.find((item) => item.slug === storedItem.slug);
      if (!product) {
        return null;
      }

      return {
        product,
        quantity: Math.min(storedItem.quantity, Math.max(product.stock, 0), 99),
      };
    })
    .filter((item): item is CartItem => item !== null && item.quantity > 0);

export function CartProvider({
  children,
  products,
}: {
  children: React.ReactNode;
  products: Product[];
}) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(hydrateStoredItems(readStoredItems(), products));
  }, [products]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedItems = items.map((item) => ({
      slug: item.product.slug,
      quantity: item.quantity,
    }));

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedItems));
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.slug === product.slug,
      );
      const nextQuantity = Math.max(quantity, 1);

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.slug === product.slug
            ? {
                ...item,
                quantity: Math.min(item.quantity + nextQuantity, product.stock, 99),
              }
            : item,
        );
      }

      return [...currentItems, { product, quantity: Math.min(nextQuantity, product.stock, 99) }];
    });
  }, []);

  const increaseItem = useCallback((slug: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.slug === slug
          ? {
              ...item,
              quantity:
                item.product.stock <= 0
                  ? item.quantity
                  : Math.min(item.quantity + 1, item.product.stock, 99),
            }
          : item,
      ),
    );
  }, []);

  const decreaseItem = useCallback((slug: string) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.product.slug === slug
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.slug !== slug),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart,
      totalItems: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      ),
    }),
    [addItem, clearCart, decreaseItem, increaseItem, items, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};

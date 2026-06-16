"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

export function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (product.stock <= 0) {
      return;
    }

    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
      <div className="inline-flex min-h-12 items-center rounded-2xl border border-[var(--border)] bg-white p-1 shadow-sm">
        <button
          aria-label="تقليل الكمية"
          className="grid size-10 place-items-center rounded-xl text-lg font-black text-[var(--primary)] transition hover:bg-[var(--light-cyan)]"
          onClick={() => setQuantity((current) => Math.max(current - 1, 1))}
          type="button"
        >
          -
        </button>
        <span className="min-w-12 text-center text-sm font-black text-[var(--text)]">
          {quantity}
        </span>
        <button
          aria-label="زيادة الكمية"
          className="grid size-10 place-items-center rounded-xl text-lg font-black text-[var(--primary)] transition hover:bg-[var(--light-cyan)]"
          disabled={product.stock <= 0}
          onClick={() => setQuantity((current) => Math.min(current + 1, product.stock, 20))}
          type="button"
        >
          +
        </button>
      </div>
      <button
        className="btn-primary w-full"
        disabled={product.stock <= 0}
        onClick={handleAdd}
        type="button"
      >
        {product.stock <= 0 ? "غير متوفر حاليا" : added ? "تمت الإضافة للسلة" : "أضف للسلة"}
      </button>
    </div>
  );
}

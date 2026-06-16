"use client";

import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderSummary } from "@/components/store/OrderSummary";
import { QuantityControl } from "@/components/store/QuantityControl";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/storeConfig";

export default function CartPage() {
  const { clearCart, decreaseItem, increaseItem, items, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-shell section-y">
        <EmptyState
          description="ابدأ بإضافة منتجات من الأقسام أو العروض، وستظهر هنا قبل الدفع."
          title="سلة روقان فارغة"
        />
      </div>
    );
  }

  return (
    <div className="container-shell section-y">
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-[var(--teal)]">سلة التسوق</p>
          <h1 className="mt-1 text-3xl font-black text-[var(--text)] sm:text-4xl">
            منتجاتك
          </h1>
          <p className="mt-2 text-sm font-bold text-[var(--muted)]">
            راجع المنتجات والكميات قبل إتمام الطلب. يتم تأكيد الطلب عبر الهاتف أو واتساب.
          </p>
        </div>
        <button className="btn-secondary self-start" onClick={clearCart} type="button">
          تفريغ السلة
        </button>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-3">
          {items.map((item) => (
            <article
              className="grid grid-cols-[92px_1fr] gap-4 rounded-[24px] border border-[var(--border)] bg-white p-3 shadow-soft transition hover:border-[rgba(17,155,181,0.45)] sm:grid-cols-[120px_1fr_auto] sm:p-4"
              key={item.product.slug}
            >
              <Link
                className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--soft-surface)]"
                href={`/product/${item.product.slug}`}
              >
                <Image
                  alt={item.product.name}
                  className="object-cover"
                  fill
                  sizes="120px"
                  src={item.product.image}
                />
              </Link>
              <div className="min-w-0">
                <Link
                  className="text-base font-black leading-7 text-[var(--text)]"
                  href={`/product/${item.product.slug}`}
                >
                  {item.product.name}
                </Link>
                <p className="mt-1 text-sm font-black text-[var(--primary)]">
                  {formatPrice(item.product.price)}
                </p>
                {item.product.stock <= 0 ? (
                  <p className="mt-1 text-xs font-black text-[var(--danger)]">
                    غير متوفر حاليا
                  </p>
                ) : item.quantity > item.product.stock ? (
                  <p className="mt-1 text-xs font-black text-[var(--danger)]">
                    المتاح حاليا {item.product.stock} فقط
                  </p>
                ) : null}
                <div className="mt-3">
                  <QuantityControl
                    onDecrease={() => decreaseItem(item.product.slug)}
                    onIncrease={() => increaseItem(item.product.slug)}
                    quantity={item.quantity}
                  />
                </div>
              </div>
              <button
                className="col-span-2 min-h-11 rounded-2xl border border-[var(--border)] px-4 text-sm font-black text-[var(--danger)] transition hover:border-red-200 hover:bg-red-50 sm:col-span-1 sm:self-center"
                onClick={() => removeItem(item.product.slug)}
                type="button"
              >
                حذف
              </button>
            </article>
          ))}
        </div>
        <OrderSummary showCheckoutButton />
      </div>
    </div>
  );
}

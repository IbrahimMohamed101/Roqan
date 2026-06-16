"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, SHIPPING_FEE } from "@/lib/storeConfig";

type OrderSummaryProps = {
  checkoutFormId?: string;
  showConfirmButton?: boolean;
  showCheckoutButton?: boolean;
};

export function OrderSummary({
  checkoutFormId,
  showCheckoutButton,
  showConfirmButton,
}: OrderSummaryProps) {
  const { items, subtotal, totalItems } = useCart();
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;

  return (
    <aside className="rounded-[26px] border border-[var(--border)] bg-white p-5 shadow-soft lg:sticky lg:top-28">
      <h2 className="text-xl font-black text-[var(--text)]">سلة التسوق</h2>
      <div className="mt-5 grid gap-3">
        {items.length === 0 ? (
          <p className="rounded-2xl bg-[var(--soft-surface)] p-4 text-sm font-bold text-[var(--muted)]">
            السلة فارغة. أضف منتجات قبل تأكيد الطلب.
          </p>
        ) : (
          items.map((item) => (
            <div
              className="grid grid-cols-[64px_1fr_auto] gap-3 rounded-2xl bg-[var(--soft-surface)] p-3"
              key={item.product.slug}
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                <Image
                  alt={item.product.name}
                  className="object-cover"
                  fill
                  sizes="64px"
                  src={item.product.image}
                />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-black leading-6 text-[var(--text)]">
                  {item.product.name}
                </p>
                <p className="mt-1 text-xs font-bold text-[var(--muted)]">
                  الكمية: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-black text-[var(--primary)]">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 grid gap-3 border-t border-[var(--border)] pt-5 text-sm font-bold text-[var(--muted)]">
        <div className="flex justify-between gap-4">
          <span>عدد القطع</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>الإجمالي الفرعي</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>الشحن التقديري</span>
          <span>{formatPrice(shipping)}</span>
        </div>
      </div>
      <div className="mt-5 flex justify-between gap-4 rounded-2xl bg-[var(--soft-surface)] px-4 py-4 text-lg font-black text-[var(--primary)]">
        <span>الإجمالي</span>
        <span>{formatPrice(total)}</span>
      </div>
      <p className="mt-3 text-xs leading-6 text-[var(--muted)]">
        الدفع عند الاستلام فقط في هذه المرحلة. سيتم تأكيد الطلب عبر الهاتف أو
        واتساب.
      </p>
      {showConfirmButton ? (
        <>
          <button
            className="btn-primary mt-5 w-full bg-[linear-gradient(135deg,#f59e0b_0%,#ea580c_100%)] shadow-[0_18px_34px_rgba(234,88,12,0.22)]"
            disabled={items.length === 0}
            form={checkoutFormId}
            type="submit"
          >
            تأكيد الطلب
          </button>
          <p className="mt-3 text-center text-xs font-bold leading-6 text-[var(--muted)]">
            بالضغط على تأكيد الطلب، أنت توافق على{" "}
            <Link className="text-[var(--primary)]" href="/terms">
              الشروط والأحكام
            </Link>
          </p>
        </>
      ) : null}
      {showCheckoutButton && items.length > 0 ? (
        <Link className="btn-primary mt-5 w-full" href="/checkout">
          إتمام الطلب
        </Link>
      ) : null}
    </aside>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppOrderButton } from "@/components/store/WhatsAppOrderButton";
import { buildWhatsAppOrderMessage, getOrderByPublicId } from "@/lib/orders";
import { createWhatsAppUrl, formatPrice } from "@/lib/storeConfig";
import { getStoreSettings } from "@/lib/storeSettings";

type OrderConfirmationProps = {
  params: Promise<{ orderId: string }>;
};

export const metadata: Metadata = {
  title: "تم استلام الطلب | روقان",
  description: "رسالة تأكيد طلب روقان.",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationProps) {
  const { orderId } = await params;
  const [order, settings] = await Promise.all([
    getOrderByPublicId(orderId),
    getStoreSettings(),
  ]);
  const message = order
    ? buildWhatsAppOrderMessage(order, settings.storeName)
    : `مرحبًا ${settings.storeName}، أريد متابعة الطلب رقم ${orderId}`;

  return (
    <div className="container-shell section-y pb-6 sm:pb-10">
      <section className="mx-auto w-full max-w-sm sm:max-w-2xl rounded-[24px] border border-[var(--border)] bg-white p-4 text-center shadow-soft sm:p-10">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-green-50 text-3xl">
          ✓
        </div>
        <p className="mt-5 text-sm font-black text-[var(--teal)]">
          تم استلام طلبك بنجاح
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-black text-[var(--primary)]">
          <span className="block">رقم الطلب:</span>
          <span className="order-code mt-2 inline-block text-lg sm:text-2xl">{orderId}</span>
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
          سيتم تأكيد الطلب معك عبر الهاتف أو واتساب قبل الشحن. احتفظ برقم الطلب
          للمتابعة.
        </p>
        {order ? (
          <div className="mt-6 rounded-2xl bg-[var(--soft-surface)] p-4 text-start">
            <h2 className="text-base font-black text-[var(--text)]">ملخص الطلب</h2>
            <div className="mt-3 grid gap-2 text-sm font-bold text-[var(--muted)]">
              {order.items.map((item) => (
                <div className="flex justify-between gap-3" key={item.productSlug}>
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-3 text-[var(--muted)]">
                <span>المحافظة</span>
                <span>{order.governorate}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>سعر التوصيل</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-3 text-[var(--primary)]">
                <span>الإجمالي شامل التوصيل</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        ) : null}
        <p className="mt-3 text-xs font-bold leading-6 text-[var(--muted)]">
          راجع{" "}
          <Link className="text-[var(--primary)]" href="/shipping-policy">
            سياسة الشحن
          </Link>{" "}
          و{" "}
          <Link className="text-[var(--primary)]" href="/returns-policy">
            الاستبدال والاسترجاع
          </Link>{" "}
          لمعرفة التفاصيل العامة.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <WhatsAppOrderButton
            fallbackUrl={createWhatsAppUrl(message, settings.whatsappNumber)}
            orderId={orderId}
          />
          <Link className="btn-secondary" href="/">
            العودة للرئيسية
          </Link>
        </div>
      </section>
    </div>
  );
}

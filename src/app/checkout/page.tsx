import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/store/CheckoutForm";
import { OrderSummary } from "@/components/store/OrderSummary";

export const metadata: Metadata = {
  title: "إتمام الطلب | روقان",
  description: "أكمل بيانات الشحن والدفع عند الاستلام.",
  alternates: {
    canonical: "/checkout",
  },
};

export default function CheckoutPage() {
  return (
    <div>
      <div className="bg-[linear-gradient(135deg,#119b7d_0%,#0f8f76_100%)] py-2.5 text-center text-xs font-black text-white sm:py-3 sm:text-sm">
        متاح المعاينة قبل الاستلام
      </div>
      <div className="container-shell section-y">
        <div className="mb-4 text-center sm:mb-7">
          <h1 className="text-2xl font-black text-[var(--text)] sm:text-4xl">
            إتمام الطلب
          </h1>
          <p className="mt-1.5 text-xs font-bold leading-6 text-[var(--muted)] sm:mt-2 sm:text-sm">
            املأ بياناتك وسيتم تأكيد الطلب معك قبل الشحن.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <CheckoutForm />
          <div className="grid gap-4 self-start">
            <OrderSummary checkoutFormId="checkout-form" showConfirmButton />
          <div className="rounded-[22px] border border-[var(--border)] bg-white p-4 text-xs font-bold leading-6 text-[var(--muted)] shadow-soft">
            بإرسال الطلب، سيتم التواصل معك لتأكيد البيانات قبل الشحن. يمكنك
            مراجعة{" "}
            <Link className="font-black text-[var(--primary)]" href="/shipping-policy">
              سياسة الشحن
            </Link>{" "}
            و{" "}
            <Link className="font-black text-[var(--primary)]" href="/returns-policy">
              الاستبدال والاسترجاع
            </Link>
            .
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

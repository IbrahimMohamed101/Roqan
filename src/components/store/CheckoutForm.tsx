"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { submitCheckout } from "@/app/checkout/actions";
import { cartItemsToCheckoutItems } from "@/types/order";

const inputClass =
  "min-h-11 w-full rounded-[15px] border border-[var(--border)] bg-white px-3 py-2.5 text-sm font-semibold text-[var(--text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--ring)] sm:min-h-12 sm:rounded-2xl sm:px-4 sm:py-3";

const governorates = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحر الأحمر",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "القليوبية",
  "الوادي الجديد",
  "السويس",
  "أسوان",
  "أسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "الشرقية",
  "جنوب سيناء",
  "كفر الشيخ",
  "مطروح",
  "الأقصر",
  "قنا",
  "شمال سيناء",
  "سوهاج",
];

function StepCard({
  children,
  step,
  title,
}: {
  children: React.ReactNode;
  step: number;
  title: string;
}) {
  return (
    <section className="rounded-[20px] border border-[var(--border)] bg-white p-4 shadow-soft sm:rounded-[24px] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
        <h2 className="text-lg font-black text-[var(--text)] sm:text-xl">{title}</h2>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--teal)] text-xs font-black text-white sm:size-9 sm:text-sm">
          {step}
        </span>
      </div>
      {children}
    </section>
  );
}

function HelperText({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-bold leading-6 text-[var(--muted)]">{children}</span>;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const requiredFields = ["name", "phone", "governorate", "address"];
    const missingField = requiredFields.some(
      (field) => String(formData.get(field) ?? "").trim().length < 2,
    );

    if (items.length === 0) {
      setError("السلة فارغة. أضف منتجًا قبل إرسال الطلب.");
      return;
    }

    if (missingField) {
      setError("من فضلك أكمل الاسم، رقم الهاتف، المحافظة، والعنوان التفصيلي.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const result = await submitCheckout({
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      alternatePhone: String(formData.get("alternatePhone") ?? ""),
      governorate: String(formData.get("governorate") ?? ""),
      city: "",
      address: String(formData.get("address") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      items: cartItemsToCheckoutItems(items),
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    window.sessionStorage.setItem(
      `rooqan-whatsapp-${result.orderId}`,
      result.whatsappUrl,
    );
    clearCart();
    router.push(`/order-confirmation/${result.orderId}`);
  };

  return (
    <form
      className="grid gap-4 sm:gap-5"
      id="checkout-form"
      onSubmit={onSubmit}
    >
      {error ? (
        <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-[var(--danger)]">
          {error}
        </p>
      ) : null}

      <StepCard step={1} title="معلومات التواصل">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <label className="grid gap-2 text-sm font-bold text-[var(--text)]">
            الاسم *
            <input className={inputClass} name="name" placeholder="مثال: أحمد محمد" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[var(--text)]">
            رقم الموبايل *
            <input
              className={inputClass}
              inputMode="tel"
              name="phone"
              placeholder="010xxxxxxxx"
            />
            <HelperText>اكتب رقم يبدأ بـ 01 حتى نقدر نأكد الطلب.</HelperText>
          </label>
          <label className="grid gap-2 text-sm font-bold text-[var(--text)] sm:col-span-2">
            رقم تاني لو عندك
            <input
              className={inputClass}
              inputMode="tel"
              name="alternatePhone"
              placeholder="010xxxxxxxx"
            />
          </label>
        </div>
      </StepCard>

      <StepCard step={2} title="عنوان الشحن">
        <div className="grid gap-3 sm:gap-4">
          <label className="grid gap-2 text-sm font-bold text-[var(--text)]">
            المحافظة *
            <select className={inputClass} defaultValue="" name="governorate">
              <option disabled value="">
                اضغط هنا واختر محافظتك
              </option>
              {governorates.map((governorate) => (
                <option key={governorate} value={governorate}>
                  {governorate}
                </option>
              ))}
            </select>
            <HelperText>رسوم الشحن ثابتة حاليًا، وسيتم تأكيد التفاصيل قبل الشحن.</HelperText>
          </label>
          <label className="grid gap-2 text-sm font-bold text-[var(--text)]">
            العنوان بالتفصيل *
            <textarea
              className={`${inputClass} min-h-24 resize-y sm:min-h-28`}
              name="address"
              placeholder="مثال: 15 شارع الجمهورية - عمارة 7 - الدور 3 - شقة 12"
            />
            <HelperText>اكتب العنوان بالتفصيل علشان المندوب يوصل بسهولة.</HelperText>
          </label>
          <label className="grid gap-2 text-sm font-bold text-[var(--text)]">
            ملاحظات إضافية للطلب
            <textarea
              className={`${inputClass} min-h-20 resize-y sm:min-h-24`}
              name="notes"
              placeholder="أي ملاحظة تخص الطلب أو وقت التواصل"
            />
          </label>
        </div>
      </StepCard>

      <StepCard step={3} title="طريقة الدفع">
        <div className="rounded-2xl border-2 border-[var(--teal)] bg-[rgba(17,155,181,0.07)] p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-5 place-items-center rounded-full border-2 border-[var(--teal)]">
              <span className="size-2 rounded-full bg-[var(--teal)]" />
            </span>
            <div>
              <h3 className="text-sm font-black text-[var(--text)]">
                الدفع عند الاستلام
              </h3>
              <p className="mt-1 text-xs font-bold text-[var(--muted)]">
                ادفع نقدا عند استلام طلبك
              </p>
            </div>
          </div>
        </div>
      </StepCard>
    </form>
  );
}

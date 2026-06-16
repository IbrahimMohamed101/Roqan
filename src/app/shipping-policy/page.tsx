import type { Metadata } from "next";
import { PolicyPage } from "@/components/store/PolicyPage";

export const metadata: Metadata = {
  title: "سياسة الشحن | روقان",
  description: "تعرف على سياسة الشحن والتوصيل في متجر روقان.",
  alternates: {
    canonical: "/shipping-policy",
  },
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      description="هذه سياسة عامة قابلة للتعديل حسب مناطق الشحن النهائية ورسوم التوصيل التي يحددها صاحب المتجر."
      eyebrow="سياسات المتجر"
      sections={[
        {
          title: "مناطق التوصيل",
          body: "نوفر التوصيل داخل المناطق التي يتم تأكيدها مع العميل قبل شحن الطلب. قد تختلف مدة التوصيل حسب المحافظة والمنطقة.",
        },
        {
          title: "رسوم الشحن",
          body: "تظهر رسوم الشحن أثناء إتمام الطلب، ويتم تأكيدها مع العميل عبر الهاتف أو واتساب قبل الشحن.",
        },
        {
          title: "تأكيد الطلب",
          body: "لا يتم شحن الطلب إلا بعد مراجعة بيانات العميل وتأكيد الطلب. في حال تعذر التواصل، قد يتم تأجيل أو إلغاء الطلب.",
        },
      ]}
      title="سياسة الشحن"
    />
  );
}

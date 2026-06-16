import type { Metadata } from "next";
import { PolicyPage } from "@/components/store/PolicyPage";

export const metadata: Metadata = {
  title: "الشروط والأحكام | روقان",
  description: "الشروط العامة لاستخدام متجر روقان وإرسال الطلبات.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <PolicyPage
      description="باستخدام المتجر وإرسال طلب، يقر العميل بمراجعة بياناته وقبول التواصل لتأكيد الطلب قبل الشحن."
      eyebrow="سياسات المتجر"
      sections={[
        {
          title: "الأسعار والتوفر",
          body: "نحاول عرض الأسعار والتوفر بدقة، وقد يتم تأكيد التفاصيل النهائية قبل الشحن في حال حدوث أي تغيير.",
        },
        {
          title: "الدفع",
          body: "الدفع المتاح حاليًا هو الدفع عند الاستلام فقط، ولا يطلب المتجر بيانات بطاقات دفع إلكترونية.",
        },
        {
          title: "إلغاء الطلب",
          body: "يمكن إلغاء الطلب قبل الشحن من خلال التواصل معنا، وقد يتم إلغاء الطلب إذا تعذر تأكيد بيانات العميل.",
        },
      ]}
      title="الشروط والأحكام"
    />
  );
}

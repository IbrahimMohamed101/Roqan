import type { Metadata } from "next";
import { PolicyPage } from "@/components/store/PolicyPage";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | روقان",
  description: "كيف يتعامل متجر روقان مع بيانات العملاء الأساسية.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      description="نستخدم بيانات الطلب فقط لتأكيد الطلب وتوصيله والتواصل مع العميل بخصوص الخدمة."
      eyebrow="سياسات المتجر"
      sections={[
        {
          title: "البيانات التي نطلبها",
          body: "نطلب الاسم ورقم الهاتف والعنوان وملاحظات الطلب عند الحاجة حتى نتمكن من تأكيد الطلب وتوصيله.",
        },
        {
          title: "استخدام البيانات",
          body: "تستخدم البيانات لأغراض تنفيذ الطلب، التواصل عبر الهاتف أو واتساب، وتحسين خدمة العملاء.",
        },
        {
          title: "مشاركة البيانات",
          body: "لا نبيع بيانات العملاء. قد تتم مشاركة بيانات الشحن الضرورية فقط مع جهة التوصيل عند الحاجة.",
        },
      ]}
      title="سياسة الخصوصية"
    />
  );
}

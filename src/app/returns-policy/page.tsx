import type { Metadata } from "next";
import { PolicyPage } from "@/components/store/PolicyPage";

export const metadata: Metadata = {
  title: "سياسة الاستبدال والاسترجاع | روقان",
  description: "سياسة عامة للاستبدال والاسترجاع في متجر روقان.",
  alternates: {
    canonical: "/returns-policy",
  },
};

export default function ReturnsPolicyPage() {
  return (
    <PolicyPage
      description="هذه الصياغة عامة ويجب مراجعتها وتعديلها بما يناسب سياسة صاحب المتجر وطبيعة المنتجات."
      eyebrow="سياسات المتجر"
      sections={[
        {
          title: "طلب الاستبدال أو الاسترجاع",
          body: "يمكن للعميل التواصل معنا خلال مدة يحددها صاحب المتجر من تاريخ الاستلام، مع توضيح رقم الطلب وسبب الطلب.",
        },
        {
          title: "حالة المنتج",
          body: "يجب أن يكون المنتج بحالته الأصلية وبكامل ملحقاته وتغليفه قدر الإمكان، ما لم يكن سبب الطلب عيبًا واضحًا في المنتج.",
        },
        {
          title: "الرسوم والمراجعة",
          body: "يتم مراجعة الطلب قبل الموافقة النهائية، وقد تختلف رسوم الشحن أو الاستبدال حسب سبب الطلب والمنطقة.",
        },
      ]}
      title="سياسة الاستبدال والاسترجاع"
    />
  );
}

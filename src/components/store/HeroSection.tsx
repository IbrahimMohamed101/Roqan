import Image from "next/image";
import Link from "next/link";
import { SearchBox } from "./SearchBox";
import { TrustBadges } from "./TrustBadges";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white bg-[linear-gradient(135deg,#E9F9FC_0%,#FFFFFF_48%,#FFF0E7_100%)] p-5 shadow-soft ring-1 ring-[var(--border)] sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -left-20 top-8 size-64 rounded-full bg-white/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-[rgba(17,155,181,0.13)] blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="text-center lg:text-start">
          <p className="mb-4 inline-flex rounded-full border border-white/80 bg-white/85 px-4 py-2 text-sm font-black text-[var(--teal)] shadow-sm">
            روقان لكل بيت هادي ومنظم
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-[1.22] text-[var(--primary)] sm:text-5xl lg:mx-0 lg:text-6xl">
            منتجات منزلية وعصرية مختارة بعناية لتجربة شراء بسيطة ومريحة.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg lg:mx-0">
            تسوق أدوات البيت والمطبخ والتنظيف والإكسسوارات اليومية بأسعار واضحة
            ودفع عند الاستلام.
          </p>
          <div className="mt-5 flex justify-center lg:justify-start">
            <TrustBadges />
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link className="btn-primary" href="/categories">
              تسوق الآن
            </Link>
            <Link className="btn-secondary" href="/offers">
              شاهد العروض
            </Link>
          </div>
          <div className="mx-auto mt-7 max-w-2xl lg:mx-0">
            <SearchBox placeholder="جرّب: ستاند ملابس، مساحة، منظم ثلاجة..." />
          </div>
        </div>
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-[30px] border border-white bg-white/80 p-4 text-center shadow-soft backdrop-blur">
            <div className="relative overflow-hidden rounded-[24px] bg-[var(--soft-surface)]">
              <Image
                alt="شعار روقان"
                className="mx-auto h-auto w-full"
                height={360}
                priority
                src="/rooqan-logo.jpeg"
                width={520}
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/90 px-4 py-3 text-sm font-black text-[var(--primary)] shadow-sm backdrop-blur">
                اختيارات خفيفة، شكل نظيف، وخدمة واتساب قريبة منك.
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {["أسعار واضحة", "دفع عند الاستلام", "تأكيد سريع"].map((item) => (
                <span
                  className="rounded-2xl bg-[var(--light-cyan)] px-2 py-3 text-xs font-black leading-5 text-[var(--primary)]"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

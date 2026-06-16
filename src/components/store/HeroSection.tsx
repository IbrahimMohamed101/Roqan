import Image from "next/image";
import Link from "next/link";
import { SearchBox } from "./SearchBox";
import { TrustBadges } from "./TrustBadges";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white bg-[linear-gradient(135deg,#E9F9FC_0%,#FFFFFF_48%,#FFF0E7_100%)] px-4 py-6 shadow-soft ring-1 ring-[var(--border)] sm:rounded-[28px] sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -left-20 top-8 size-64 rounded-full bg-white/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-[rgba(17,155,181,0.13)] blur-3xl" />
      <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1.14fr)_minmax(280px,0.86fr)] lg:items-center xl:gap-10">
        <div className="text-center lg:text-start">
          <p className="mb-4 inline-flex max-w-full rounded-full border border-white/80 bg-white/85 px-3 py-2 text-xs font-black leading-5 text-[var(--teal)] shadow-sm sm:px-4 sm:text-sm">
            روقان لكل بيت هادي ومنظم
          </p>
          <h1 className="mx-auto max-w-3xl text-[2rem] font-black leading-[1.3] text-[var(--primary)] sm:text-5xl lg:mx-0 lg:text-[3.35rem] xl:text-6xl">
            منتجات منزلية وعصرية مختارة بعناية لتجربة شراء بسيطة ومريحة.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:mt-5 sm:text-lg sm:leading-8 lg:mx-0">
            تسوق أدوات البيت والمطبخ والتنظيف والإكسسوارات اليومية بأسعار واضحة
            ودفع عند الاستلام.
          </p>
          <div className="mt-5 flex justify-center lg:justify-start">
            <TrustBadges />
          </div>
          <div className="mt-6 grid gap-3 sm:inline-grid sm:grid-flow-col sm:justify-center lg:justify-start">
            <Link className="btn-primary w-full sm:w-auto" href="/categories">
              تسوق الآن
            </Link>
            <Link className="btn-secondary w-full sm:w-auto" href="/offers">
              شاهد العروض
            </Link>
          </div>
          <div className="mx-auto mt-7 hidden max-w-2xl lg:block lg:mx-0">
            <SearchBox placeholder="جرّب: ستاند ملابس، مساحة، منظم ثلاجة..." />
          </div>
        </div>
        <div className="mx-auto hidden w-full max-w-sm sm:block lg:max-w-md">
          <div className="rounded-[28px] border border-white bg-white/80 p-3 text-center shadow-soft backdrop-blur sm:p-4">
            <div className="relative overflow-hidden rounded-[22px] bg-[var(--soft-surface)]">
              <Image
                alt="شعار روقان"
                className="mx-auto aspect-[4/3] h-auto w-full object-cover"
                height={360}
                priority
                src="/rooqan-logo.jpeg"
                width={520}
              />
              <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/90 px-3 py-2 text-xs font-black leading-5 text-[var(--primary)] shadow-sm backdrop-blur sm:inset-x-4 sm:bottom-4 sm:px-4 sm:py-3 sm:text-sm">
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

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/product";

export function CategoryCard({ category }: { category: Category }) {
  const hasImage = !!category.image;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="relative block overflow-hidden rounded-[16px] shadow-soft transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[var(--ring)]"
    >
      <div className="relative h-[160px] sm:h-[200px] lg:h-[220px] w-full rounded-[16px] overflow-hidden">
        {hasImage ? (
          <Image
            alt={category.name}
            src={category.image as string}
            fill
            className="object-cover transition-transform duration-400 group-hover:scale-105"
            sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 100vw"
          />
        ) : (
          <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#123f6d_0%,#119bb5_62%,#68c7d4_100%)]">
            <span className="absolute -left-8 -top-10 size-36 rounded-full bg-white/15 blur-sm" />
            <span className="absolute -bottom-16 -right-10 size-44 rounded-full bg-[var(--coral)]/25 blur-md" />
          </div>
        )}

        <div className={`absolute inset-0 ${hasImage ? "bg-gradient-to-t from-black/55 via-black/30 to-transparent" : "bg-gradient-to-t from-[rgba(11,43,77,0.72)] via-transparent to-white/5"}`} />

        <div className="absolute inset-0 flex flex-col justify-end p-4 text-right">
          <h3 className="text-lg font-black leading-6 text-white drop-shadow-sm">{category.name}</h3>
          <p className="mt-1 text-sm font-bold text-white/90 line-clamp-2">{category.description}</p>
        </div>

        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[var(--text)]">
            {category.productCount} منتجات
          </span>
        </div>
      </div>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import { storeConfig } from "@/lib/storeConfig";

export function LogoBrand() {
  return (
    <Link className="flex min-w-0 items-center gap-3" href="/">
      <Image
        src="/rooqan-logo.jpeg"
        alt="شعار روقان"
        width={54}
        height={54}
        priority
        className="size-12 rounded-2xl border border-[var(--border)] bg-white object-cover shadow-sm"
      />
      <span className="min-w-0">
        <span className="block text-lg font-black text-[var(--primary)]">
          {storeConfig.nameAr}
        </span>
        <span className="block truncate text-xs font-semibold text-[var(--muted)]">
          {storeConfig.tagline}
        </span>
      </span>
    </Link>
  );
}

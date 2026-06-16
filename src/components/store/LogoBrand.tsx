import Image from "next/image";
import Link from "next/link";
import { storeConfig } from "@/lib/storeConfig";

export function LogoBrand() {
  return (
    <Link className="flex min-w-0 items-center gap-2 sm:gap-3" href="/">
      <Image
        src="/rooqan-logo.jpeg"
        alt="شعار روقان"
        width={54}
        height={54}
        priority
        className="size-9 rounded-[13px] border border-[var(--border)] bg-white object-cover shadow-sm min-[390px]:size-10 sm:size-12 sm:rounded-2xl"
      />
      <span className="min-w-0">
        <span className="block text-sm font-black leading-5 text-[var(--primary)] min-[390px]:text-base sm:text-lg sm:leading-normal">
          {storeConfig.nameAr}
        </span>
        <span className="block max-w-[142px] truncate text-[10px] font-semibold leading-4 text-[var(--muted)] min-[390px]:max-w-[190px] min-[390px]:text-[11px] sm:max-w-none sm:text-xs">
          {storeConfig.tagline}
        </span>
      </span>
    </Link>
  );
}

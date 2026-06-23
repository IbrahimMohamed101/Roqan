import Image from "next/image";
import Link from "next/link";

type LogoBrandProps = {
  name: string;
  description: string;
  logoUrl: string;
};

export function LogoBrand({ name, description, logoUrl }: LogoBrandProps) {
  return (
    <Link className="flex min-w-0 items-center gap-1.5 sm:gap-3" href="/">
      <Image
        src={logoUrl}
        alt={`شعار ${name}`}
        width={54}
        height={54}
        priority
        className="size-8 rounded-[12px] border border-[var(--border)] bg-white object-cover shadow-sm min-[390px]:size-9 sm:size-12 sm:rounded-2xl"
        unoptimized={logoUrl.startsWith("http")}
      />
      <span className="min-w-0">
        <span className="block text-[13px] font-black leading-5 text-[var(--primary)] min-[390px]:text-sm sm:text-lg sm:leading-normal">
          {name}
        </span>
        <span className="block max-w-[132px] truncate text-[10px] font-semibold leading-4 text-[var(--muted)] min-[390px]:max-w-[176px] sm:max-w-none sm:text-xs">
          {description}
        </span>
      </span>
    </Link>
  );
}

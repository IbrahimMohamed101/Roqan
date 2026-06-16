import Link from "next/link";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  action?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-3 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
      <div>
        {eyebrow ? (
          <p className="mb-1.5 text-xs font-black text-[var(--teal)] sm:mb-2 sm:text-sm">{eyebrow}</p>
        ) : null}
        <h2 className="text-lg font-black tracking-normal text-[var(--text)] min-[390px]:text-xl sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-xs leading-5 text-[var(--muted)] sm:mt-2 sm:text-base sm:leading-7">
            {description}
          </p>
        ) : null}
      </div>
      {href && action ? (
        <Link className="link-pill min-h-9 self-start px-3 text-xs sm:self-auto sm:min-h-10 sm:px-4 sm:text-base" href={href}>
          {action}
        </Link>
      ) : null}
    </div>
  );
}

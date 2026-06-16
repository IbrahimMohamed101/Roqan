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
    <div className="mb-4 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
      <div>
        {eyebrow ? (
          <p className="mb-1.5 text-xs font-black text-[var(--teal)] sm:mb-2 sm:text-sm">{eyebrow}</p>
        ) : null}
        <h2 className="text-xl font-black tracking-normal text-[var(--text)] min-[390px]:text-2xl sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-xs leading-6 text-[var(--muted)] sm:mt-2 sm:text-base sm:leading-7">
            {description}
          </p>
        ) : null}
      </div>
      {href && action ? (
        <Link className="link-pill min-h-10 self-start px-4 text-sm sm:self-auto sm:text-base" href={href}>
          {action}
        </Link>
      ) : null}
    </div>
  );
}

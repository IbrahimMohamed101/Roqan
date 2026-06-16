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
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-sm font-black text-[var(--teal)]">{eyebrow}</p>
        ) : null}
        <h2 className="text-2xl font-black tracking-normal text-[var(--text)] sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {href && action ? (
        <Link className="link-pill self-start sm:self-auto" href={href}>
          {action}
        </Link>
      ) : null}
    </div>
  );
}

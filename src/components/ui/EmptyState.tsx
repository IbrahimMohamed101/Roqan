import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel = "العودة للتسوق",
  actionHref = "/",
}: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-white px-5 py-12 text-center shadow-soft">
      <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-[var(--light-cyan)] text-2xl ring-8 ring-[var(--soft-surface)]">
        ✦
      </div>
      <h2 className="text-2xl font-black text-[var(--text)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[var(--muted)]">
        {description}
      </p>
      <Link className="btn-primary mt-6 inline-flex" href={actionHref}>
        {actionLabel}
      </Link>
    </div>
  );
}

type PolicySection = {
  title: string;
  body: string;
};

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: PolicySection[];
};

export function PolicyPage({
  eyebrow,
  title,
  description,
  sections,
}: PolicyPageProps) {
  return (
    <div className="container-shell section-y">
      <article className="mx-auto max-w-3xl rounded-[24px] border border-[var(--border)] bg-white p-6 shadow-soft sm:p-8">
        <p className="text-sm font-black text-[var(--teal)]">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black text-[var(--text)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
          {description}
        </p>
        <div className="mt-7 grid gap-5">
          {sections.map((section) => (
            <section
              className="rounded-2xl bg-[var(--soft-surface)] p-4"
              key={section.title}
            >
              <h2 className="text-lg font-black text-[var(--primary)]">
                {section.title}
              </h2>
              <p className="mt-2 text-sm font-bold leading-7 text-[var(--muted)]">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

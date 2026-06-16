const badges = ["دفع عند الاستلام", "شحن سريع", "دعم واتساب"];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 lg:justify-start">
      {badges.map((badge) => (
        <span
          className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[var(--primary)] sm:px-4 sm:py-2 sm:text-sm"
          key={badge}
        >
          {badge}
        </span>
      ))}
    </div>
  );
}

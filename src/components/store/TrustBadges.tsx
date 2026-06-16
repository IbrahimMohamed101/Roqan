const badges = ["دفع عند الاستلام", "شحن سريع", "دعم واتساب"];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold text-[var(--primary)]"
          key={badge}
        >
          {badge}
        </span>
      ))}
    </div>
  );
}

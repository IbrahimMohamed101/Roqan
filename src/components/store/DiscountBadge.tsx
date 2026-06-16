type DiscountBadgeProps = {
  discount?: number;
};

export function DiscountBadge({ discount }: DiscountBadgeProps) {
  if (!discount) {
    return null;
  }

  return (
    <span className="rounded-full bg-[var(--coral)] px-3 py-1 text-xs font-black text-white">
      خصم {discount}%
    </span>
  );
}

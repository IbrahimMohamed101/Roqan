import { formatPrice } from "@/lib/storeConfig";

type PriceDisplayProps = {
  price: number;
  oldPrice?: number;
};

export function PriceDisplay({ price, oldPrice }: PriceDisplayProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-lg font-black text-[var(--primary)]">
        {formatPrice(price)}
      </span>
      {oldPrice ? (
        <span className="text-sm font-semibold text-[var(--muted)] line-through">
          {formatPrice(oldPrice)}
        </span>
      ) : null}
    </div>
  );
}

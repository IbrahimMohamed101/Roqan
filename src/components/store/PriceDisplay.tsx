import { formatPrice } from "@/lib/storeConfig";

type PriceDisplayProps = {
  price: number;
  oldPrice?: number;
};

export function PriceDisplay({ price, oldPrice }: PriceDisplayProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      <span className="text-base font-black text-[var(--primary)] sm:text-lg">
        {formatPrice(price)}
      </span>
      {oldPrice ? (
        <span className="text-xs font-semibold text-[var(--muted)] line-through sm:text-sm">
          {formatPrice(oldPrice)}
        </span>
      ) : null}
    </div>
  );
}

"use client";

type QuantityControlProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}: QuantityControlProps) {
  return (
    <div className="inline-flex min-h-11 items-center rounded-2xl border border-[var(--border)] bg-white p-1 shadow-sm">
      <button
        aria-label="تقليل الكمية"
        className="grid size-9 place-items-center rounded-xl text-lg font-black text-[var(--primary)] transition hover:bg-[var(--light-cyan)]"
        onClick={onDecrease}
        type="button"
      >
        -
      </button>
      <span className="min-w-10 text-center text-sm font-black text-[var(--text)]">
        {quantity}
      </span>
      <button
        aria-label="زيادة الكمية"
        className="grid size-9 place-items-center rounded-xl text-lg font-black text-[var(--primary)] transition hover:bg-[var(--light-cyan)]"
        onClick={onIncrease}
        type="button"
      >
        +
      </button>
    </div>
  );
}

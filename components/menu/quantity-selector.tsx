import { Button } from "@/components/ui/button";

export function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
}) {
  return (
    <div className="flex items-center overflow-hidden rounded-full border border-border bg-background">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Diminuir quantidade"
        className="size-9 rounded-none text-lg sm:size-10"
      >
        −
      </Button>
      <span className="min-w-9 text-center text-sm font-bold text-foreground sm:min-w-10 sm:text-base">
        {quantity}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onIncrease}
        aria-label="Aumentar quantidade"
        className="size-9 rounded-none text-lg sm:size-10"
      >
        +
      </Button>
    </div>
  );
}

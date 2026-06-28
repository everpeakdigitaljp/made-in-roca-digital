import { Button } from "@/components/ui/button";
import { getCartItemCount, getCartTotal, type CartItem } from "@/features/cart";
import { formatYen } from "@/lib/currency";
import { LogoImage } from "@/components/layout/logo-image";

export function MenuHeader({
  cart,
  onViewBasket,
}: {
  cart: CartItem[];
  onViewBasket: () => void;
}) {
  const cartItemCount = getCartItemCount(cart);
  const cartTotal = getCartTotal(cart);
  const hasItems = cartItemCount > 0;

  return (
    <header className="sticky top-0 z-50 border-b border-[#8b451f]/10 bg-[#fff8ed]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5 sm:h-16">
        <a
          href="/"
          className="shrink-0 transition opacity-95 hover:opacity-100"
          aria-label="Made in Roça — voltar ao início"
        >
          <LogoImage size="sm" />
        </a>

        <p className="hidden font-serif text-sm font-semibold text-[#2f5d2f] sm:block">
          Made in Roça
        </p>

        {hasItems ? (
          <Button
            type="button"
            size="sm"
            onClick={onViewBasket}
            aria-label={`Minha cestinha, ${cartItemCount} ${cartItemCount === 1 ? "item" : "itens"}, total ${formatYen(cartTotal)}`}
            className="shrink-0 whitespace-nowrap text-xs sm:text-sm"
          >
            🧺 {cartItemCount}{" "}
            {cartItemCount === 1 ? "item" : "itens"} •{" "}
            <span className="tabular-nums">{formatYen(cartTotal)}</span>
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <a href="/">Início</a>
          </Button>
        )}
      </div>
    </header>
  );
}

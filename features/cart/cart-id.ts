import type { CartItem } from "./types";

/** Identificador único: produto + variante + tamanho */
export function getCartItemId(name: string, variant: string, size: string) {
  return `${name}::${variant}::${size}`;
}

export function isSameCartItem(
  item: CartItem,
  name: string,
  variant: string,
  size: string,
) {
  return (
    item.name === name && item.variant === variant && item.size === size
  );
}

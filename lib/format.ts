import type { CartItem } from "@/features/cart/types";

export function formatQuantityLabel(quantity: number) {
  return quantity === 1 ? "1 unidade" : `${quantity} unidades`;
}

/** Monta rótulo da variante + tamanho para carrinho e WhatsApp */
export function formatVariantLabel(item: CartItem) {
  return `${item.variant} · ${item.size}`;
}

export function formatCartLineItem(
  item: CartItem,
  formatPrice: (value: number) => string,
) {
  const lineSubtotal = item.priceYen * item.quantity;
  return `• ${formatVariantLabel(item)} — ${formatQuantityLabel(item.quantity)} — ${formatPrice(lineSubtotal)}`;
}

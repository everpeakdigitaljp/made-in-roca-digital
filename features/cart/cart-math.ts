import type { CartItem } from "./types";

export function getCartItemCount(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(cart: CartItem[]) {
  return cart.reduce(
    (sum, item) => sum + item.priceYen * item.quantity,
    0,
  );
}

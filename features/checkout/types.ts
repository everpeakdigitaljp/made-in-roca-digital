import type { CartItem } from "@/features/cart/types";

export type CheckoutState = {
  cart: CartItem[];
  orderNotes: string;
};

import { WHATSAPP_NUMBER } from "@/branding/assets";
import type { CartItem } from "@/features/cart/types";
import { buildWhatsAppOrderMessage } from "./format-order-message";

export function createCartWhatsAppLink(cart: CartItem[], notes?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppOrderMessage(cart, notes))}`;
}

export { buildWhatsAppOrderMessage } from "./format-order-message";

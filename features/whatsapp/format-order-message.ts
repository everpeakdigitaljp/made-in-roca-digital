import { PRODUCT_CATALOG } from "@/data/index";
import { WHATSAPP_ORDER_GREETING } from "@/branding/copy";
import { formatYen } from "@/lib/currency";
import {
  formatCartLineItem,
  formatQuantityLabel,
  formatVariantLabel,
} from "@/lib/format";
import type { CartItem } from "@/features/cart/types";

export { formatQuantityLabel, formatVariantLabel };

function groupCartByProduct(cart: CartItem[]) {
  const groups = new Map<string, CartItem[]>();

  for (const item of cart) {
    const existing = groups.get(item.name) ?? [];
    existing.push(item);
    groups.set(item.name, existing);
  }

  return Array.from(groups.entries()).sort(([nameA], [nameB]) => {
    const orderA = PRODUCT_CATALOG[nameA]?.order ?? 999;
    const orderB = PRODUCT_CATALOG[nameB]?.order ?? 999;
    return orderA - orderB;
  });
}

function formatProductGroup(productName: string, items: CartItem[]) {
  const emoji = PRODUCT_CATALOG[productName]?.emoji ?? "🛒";
  const groupSubtotal = items.reduce(
    (sum, item) => sum + item.priceYen * item.quantity,
    0,
  );

  const lines = items
    .map((item) => formatCartLineItem(item, formatYen))
    .join("\n");

  return `${emoji} ${productName}\n\n${lines}\n\nSubtotal: ${formatYen(groupSubtotal)}`;
}

export function buildWhatsAppOrderMessage(cart: CartItem[], notes?: string) {
  const groupsText = groupCartByProduct(cart)
    .map(([productName, items]) => formatProductGroup(productName, items))
    .join("\n\n");

  const total = cart.reduce(
    (sum, item) => sum + item.priceYen * item.quantity,
    0,
  );

  const trimmedNotes = notes?.trim();
  const notesBlock = trimmedNotes
    ? `\n\nObservações:\n${trimmedNotes}`
    : "";

  return `${WHATSAPP_ORDER_GREETING}

${groupsText}

Total: ${formatYen(total)}${notesBlock}`;
}

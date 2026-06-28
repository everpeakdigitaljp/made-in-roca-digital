"use client";

import { useMemo, useState } from "react";
import { createCartWhatsAppLink } from "@/features/whatsapp/create-links";
import type { CartItem } from "@/features/cart/types";

export function useCheckout(cart: CartItem[]) {
  const [orderNotes, setOrderNotes] = useState("");

  const whatsAppOrderUrl = useMemo(
    () => createCartWhatsAppLink(cart, orderNotes),
    [cart, orderNotes],
  );

  return {
    orderNotes,
    setOrderNotes,
    whatsAppOrderUrl,
    canCheckout: cart.length > 0,
  };
}

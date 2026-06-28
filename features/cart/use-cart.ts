"use client";

import { useCallback, useState } from "react";
import { isSameCartItem } from "./cart-id";
import { getCartItemCount, getCartTotal } from "./cart-math";
import type { CartItem } from "./types";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback(
    (
      name: string,
      variant: string,
      size: string,
      priceYen: number,
      quantity: number,
    ) => {
      setCart((current) => {
        const existing = current.find((item) =>
          isSameCartItem(item, name, variant, size),
        );

        if (existing) {
          return current.map((item) =>
            isSameCartItem(item, name, variant, size)
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }

        return [...current, { name, variant, size, priceYen, quantity }];
      });
    },
    [],
  );

  const removeFromCart = useCallback(
    (name: string, variant: string, size: string) => {
      setCart((current) =>
        current.filter(
          (item) => !isSameCartItem(item, name, variant, size),
        ),
      );
    },
    [],
  );

  const updateCartQuantity = useCallback(
    (name: string, variant: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        setCart((current) =>
          current.filter(
            (item) => !isSameCartItem(item, name, variant, size),
          ),
        );
        return;
      }

      setCart((current) =>
        current.map((item) =>
          isSameCartItem(item, name, variant, size)
            ? { ...item, quantity }
            : item,
        ),
      );
    },
    [],
  );

  return {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    cartItemCount: getCartItemCount(cart),
    cartTotal: getCartTotal(cart),
  };
}

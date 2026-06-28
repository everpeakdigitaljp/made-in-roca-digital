"use client";

import Image from "next/image";
import { EMPTY_BASKET_MESSAGE, ORDER_NOTES_PLACEHOLDER } from "@/branding/copy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  getCartItemId,
  getCartTotal,
  type CartItem,
} from "@/features/cart";
import { getProductImageForCartItem } from "@/features/product";
import { createCartWhatsAppLink } from "@/features/whatsapp";
import { formatYen } from "@/lib/currency";
import { QuantitySelector } from "./quantity-selector";

export function CartDrawer({
  open,
  onOpenChange,
  cart,
  orderNotes,
  onOrderNotesChange,
  onUpdateQuantity,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  orderNotes: string;
  onOrderNotesChange: (value: string) => void;
  onUpdateQuantity: (
    name: string,
    variant: string,
    size: string,
    quantity: number,
  ) => void;
  onRemove: (name: string, variant: string, size: string) => void;
}) {
  const total = getCartTotal(cart);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex max-h-[94dvh] flex-col gap-0 p-0">
        <SheetHeader>
          <SheetTitle>Minha Cestinha</SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5 sm:py-4">
          {cart.length === 0 ? (
            <p className="py-8 text-center text-sm leading-relaxed text-muted-foreground">
              {EMPTY_BASKET_MESSAGE}
            </p>
          ) : (
            <ul className="space-y-3">
              {cart.map((item) => {
                const subtotal = item.priceYen * item.quantity;
                const itemId = getCartItemId(item.name, item.variant, item.size);
                const itemImage = getProductImageForCartItem(item);

                return (
                  <li
                    key={itemId}
                    className="flex gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-background">
                      <Image
                        src={itemImage}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="size-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold leading-snug text-foreground">
                            {item.name}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-[10px]">
                              {item.variant}
                            </Badge>
                            <Badge variant="muted" className="text-[10px]">
                              {item.size}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto shrink-0 px-2 py-1 text-xs text-muted-foreground"
                          onClick={() =>
                            onRemove(item.name, item.variant, item.size)
                          }
                        >
                          remover
                        </Button>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <QuantitySelector
                          quantity={item.quantity}
                          onDecrease={() =>
                            onUpdateQuantity(
                              item.name,
                              item.variant,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                          onIncrease={() =>
                            onUpdateQuantity(
                              item.name,
                              item.variant,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                        />
                        <p className="text-sm font-bold tabular-nums text-foreground">
                          {formatYen(subtotal)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-4">
            <label
              htmlFor="order-notes"
              className="mb-1.5 block text-sm font-semibold text-muted-foreground"
            >
              Alguma observação pro seu pedido?
            </label>
            <Textarea
              id="order-notes"
              value={orderNotes}
              onChange={(event) => onOrderNotesChange(event.target.value)}
              placeholder={ORDER_NOTES_PLACEHOLDER}
              rows={3}
            />
          </div>

          {cart.length > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3 ring-1 ring-primary/10">
              <span className="font-semibold text-muted-foreground">
                Total geral
              </span>
              <span className="font-serif text-xl font-bold tabular-nums text-foreground">
                {formatYen(total)}
              </span>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter>
            <Button className="w-full" size="lg" asChild>
              <a
                href={createCartWhatsAppLink(cart, orderNotes)}
                target="_blank"
                rel="noopener noreferrer"
              >
                📲 Fazer Pedido pelo WhatsApp
              </a>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

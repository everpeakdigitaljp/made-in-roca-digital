"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ADDED_TO_CART_TOAST } from "@/branding/copy";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  resolveItemPrice,
  resolveVariantImage,
  type ProductSizeOption,
  type ProductVariant,
} from "@/features/product";
import { QuantitySelector } from "./quantity-selector";

export type ProductDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  image: string;
  variantImages?: Record<string, string>;
  variants: readonly ProductVariant[];
  sizes: readonly ProductSizeOption[];
  selectedVariant: string;
  selectedSize: string;
  onVariantChange: (variantName: string) => void;
  onSizeChange: (sizeLabel: string) => void;
  onAddToCart: (
    name: string,
    variant: string,
    size: string,
    priceYen: number,
    quantity: number,
  ) => void;
};

export function ProductDrawer({
  open,
  onOpenChange,
  name,
  image,
  variantImages,
  variants,
  sizes,
  selectedVariant,
  selectedSize,
  onVariantChange,
  onSizeChange,
  onAddToCart,
}: ProductDrawerProps) {
  const [quantity, setQuantity] = useState(1);

  const activeVariant =
    variants.find((variant) => variant.name === selectedVariant) ?? variants[0];
  const activeSize =
    sizes.find((size) => size.label === selectedSize) ?? sizes[0];
  const unitPrice = resolveItemPrice(activeVariant, activeSize);
  const activeImage = resolveVariantImage(
    image,
    activeVariant.name,
    variantImages,
  );

  useEffect(() => {
    if (!open) return;
    setQuantity(1);
  }, [open, name]);

  function handleAddToCart() {
    onAddToCart(
      name,
      activeVariant.name,
      activeSize.label,
      unitPrice,
      quantity,
    );
    setQuantity(1);
    toast(ADDED_TO_CART_TOAST);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex max-h-[94dvh] flex-col gap-0 p-0">
        <SheetTitle className="sr-only">{name}</SheetTitle>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="relative h-56 w-full shrink-0 overflow-hidden sm:h-60">
            <Image
              key={activeImage}
              src={activeImage}
              alt={`${name} — ${activeVariant.name}`}
              width={960}
              height={1200}
              className="size-full object-cover object-center transition-opacity duration-300"
              sizes="100vw"
            />
          </div>

          <div className="space-y-3 px-4 pb-4 pt-3 sm:px-5">
            <div>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground sm:text-sm">
                Qual sabor ocê vai levá?
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {variants.map((variant) => (
                  <Button
                    key={variant.name}
                    type="button"
                    variant={
                      selectedVariant === variant.name ? "chipActive" : "chip"
                    }
                    size="chip"
                    onClick={() => onVariantChange(variant.name)}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground sm:text-sm">
                Escolha o tamanhim
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size.label}
                    type="button"
                    variant={
                      selectedSize === size.label ? "chipSizeActive" : "chip"
                    }
                    size="chip"
                    onClick={() => onSizeChange(size.label)}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-3">
              <span className="text-xs font-semibold text-muted-foreground sm:text-sm">
                Quantos vai levá?
              </span>
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                onIncrease={() => setQuantity((q) => q + 1)}
              />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button className="w-full" size="lg" onClick={handleAddToCart}>
            🧺 Guardar na Cestinha
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

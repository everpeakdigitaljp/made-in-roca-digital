import type { ProductSizeOption, ProductVariant } from "./types";

export function getSelectedVariant(
  productName: string,
  variants: readonly ProductVariant[],
  selectedVariants: Record<string, string>,
) {
  return selectedVariants[productName] ?? variants[0].name;
}

export function getSelectedSize(
  productName: string,
  sizes: readonly ProductSizeOption[],
  selectedSizes: Record<string, string>,
) {
  return selectedSizes[productName] ?? sizes[0].label;
}

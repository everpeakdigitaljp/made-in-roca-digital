import type { ProductSizeOption, ProductVariant } from "./types";

/** Preço final: usa preço do tamanho se definido, senão preço base da variante */
export function resolveItemPrice(
  variant: ProductVariant,
  size: ProductSizeOption,
): number {
  return size.priceYen ?? variant.priceYen;
}

export function getStartingPrice(
  variants: readonly ProductVariant[],
  sizes: readonly ProductSizeOption[],
) {
  return Math.min(
    ...variants.flatMap((variant) =>
      sizes.map((size) => resolveItemPrice(variant, size)),
    ),
  );
}

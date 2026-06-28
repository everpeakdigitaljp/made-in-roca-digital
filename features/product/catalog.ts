import { getCatalogProduct, PRODUCT_MODAL_META } from "@/data/index";
import { IMAGES } from "@/branding/assets";
import type { CartItem } from "@/features/cart/types";

export function resolveVariantImage(
  defaultImage: string,
  variantName: string,
  variantImages?: Record<string, string>,
) {
  return variantImages?.[variantName] ?? defaultImage;
}

export function getProductImageForCartItem(item: CartItem) {
  const product = getCatalogProduct(item.name);
  if (!product) return IMAGES.logo;
  return resolveVariantImage(
    product.image,
    item.variant,
    PRODUCT_MODAL_META[item.name]?.variantImages,
  );
}

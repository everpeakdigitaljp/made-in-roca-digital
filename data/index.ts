import { productCategories } from "./categories";

export type CatalogProduct =
  (typeof productCategories)[number]["products"][number];

export function getCatalogProduct(
  productName: string,
): CatalogProduct | undefined {
  for (const category of productCategories) {
    const product = category.products.find((item) => item.name === productName);
    if (product) return product;
  }
  return undefined;
}

export type ProductCatalogEntry = {
  emoji: string;
  order: number;
};

/** Mapa produto → emoji e ordem de exibição na mensagem WhatsApp */
export const PRODUCT_CATALOG: Record<string, ProductCatalogEntry> =
  Object.fromEntries(
    productCategories.flatMap((category, categoryIndex) =>
      category.products.map((product, productIndex) => [
        product.name,
        {
          emoji: category.emoji,
          order: categoryIndex * 100 + productIndex,
        },
      ]),
    ),
  );

export { productCategories } from "./categories";
export { flavorShowcase, PRODUCT_MODAL_META } from "./flavors";
export type { ProductModalMeta } from "./flavors";
export {
  doceDeLeiteArtesanal,
  gelatoArtesanal,
  porcoNaLata,
  torresmoCaipira,
} from "./products";
export { SIZE_PRESETS } from "./sizes";

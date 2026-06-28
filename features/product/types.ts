export type ProductVariant = {
  name: string;
  priceYen: number;
};

/** Tamanho com preço opcional — preparado para preços diferentes por tamanho */
export type ProductSizeOption = {
  label: string;
  priceYen?: number;
};

export type { CatalogProduct } from "@/data/index";

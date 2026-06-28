import {
  doceDeLeiteArtesanal,
  gelatoArtesanal,
  porcoNaLata,
  torresmoCaipira,
} from "./products";

export const productCategories = [
  {
    emoji: "🍮",
    title: "Doces da Fazenda",
    products: [doceDeLeiteArtesanal],
  },
  {
    emoji: "🍨",
    title: "Gelatos Artesanais",
    products: [gelatoArtesanal],
  },
  {
    emoji: "🥓",
    title: "Especialidades Caipiras",
    products: [porcoNaLata, torresmoCaipira],
  },
] as const;

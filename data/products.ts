import { IMAGES } from "@/branding/assets";
import { SIZE_PRESETS } from "./sizes";

export const doceDeLeiteArtesanal = {
  name: "Doce de Leite Artesanal",
  image: IMAGES.doceLeite.tradicional,
  description:
    "Cremoso e delicado, cozido lentamente no tacho de cobre. O sabor autêntico da roça brasileira.",
  variants: [
    { name: "Tradicional", priceYen: 450 },
    { name: "Coco", priceYen: 450 },
    { name: "Paçoca", priceYen: 450 },
    { name: "Ameixa", priceYen: 450 },
  ],
  sizes: [SIZE_PRESETS.ML_150, SIZE_PRESETS.ML_180, SIZE_PRESETS.ML_240],
} as const;

export const gelatoArtesanal = {
  name: "Gelato Artesanal",
  image: IMAGES.gelato,
  description:
    "Gelato cremoso com sabores brasileiros. Produzido em pequenos lotes, com ingredientes naturais.",
  variants: [
    { name: "Milho Verde", priceYen: 500 },
    { name: "Coco", priceYen: 500 },
    { name: "Limão", priceYen: 500 },
    { name: "Abacate", priceYen: 500 },
    { name: "Açaí", priceYen: 500 },
    { name: "Doce de Leite", priceYen: 500 },
  ],
  sizes: [SIZE_PRESETS.ML_180, SIZE_PRESETS.ML_240],
} as const;

export const porcoNaLata = {
  name: "Porco na Lata",
  image: IMAGES.porcoNaLata,
  description:
    "Conserva artesanal de carne suína desfiada, temperada com especiarias caipiras.",
  variants: [{ name: "Tradicional", priceYen: 1800 }],
  sizes: [SIZE_PRESETS.G_500, SIZE_PRESETS.G_1KG],
} as const;

export const torresmoCaipira = {
  name: "Torresmo Caipira",
  image: IMAGES.torresmo,
  description:
    "Torresmo crocante feito na panela de ferro, com sal grosso e tempero de fazenda.",
  variants: [{ name: "Semi pronto congelado", priceYen: 900 }],
  sizes: [SIZE_PRESETS.G_500, SIZE_PRESETS.G_1KG],
} as const;

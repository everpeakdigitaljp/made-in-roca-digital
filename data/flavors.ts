import { IMAGES } from "@/branding/assets";

/** Imagem por sabor — Doce de Leite Artesanal */
export const DOCE_LEITE_VARIANT_IMAGES: Record<string, string> = {
  Tradicional: IMAGES.doceLeite.tradicional,
  Coco: IMAGES.doceLeite.coco,
  Paçoca: IMAGES.doceLeite.pacoca,
  Ameixa: IMAGES.doceLeite.ameixa,
};

export const DOCE_LEITE_EXPERIENCE = {
  story:
    "Cozido lentamente no tacho de cobre, como nas fazendas do interior. Cada pote guarda o sabor acolhedor da infância e a tradição da roça brasileira.",
} as const;

/** Vitrine informativa de sabores na landing */
export const flavorShowcase = [
  {
    name: "Tradicional",
    description: "Doce de leite puro, cremoso e intenso — o clássico da roça.",
  },
  {
    name: "Coco",
    description: "A combinação perfeita de coco fresco com doce de leite.",
  },
  {
    name: "Paçoca",
    description: "Amendoim torrado e doce de leite em harmonia irresistível.",
  },
  {
    name: "Ameixa",
    description: "Ameixa seca macia que contrasta com a cremosidade do doce.",
  },
] as const;

export type ProductModalMeta = {
  story?: string;
  variantImages?: Record<string, string>;
};

export const PRODUCT_MODAL_META: Record<string, ProductModalMeta> = {
  "Doce de Leite Artesanal": {
    story: DOCE_LEITE_EXPERIENCE.story,
    variantImages: DOCE_LEITE_VARIANT_IMAGES,
  },
};

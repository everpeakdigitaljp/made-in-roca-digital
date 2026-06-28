export const WHATSAPP_NUMBER = "819098947903";
export const WHATSAPP_DISPLAY = "090-9894-7903";
export const INSTAGRAM_HANDLE = "@madeinroca.jp";
export const INSTAGRAM_URL = "https://instagram.com/madeinroca.jp";

export const WHATSAPP_DOUBT_MESSAGE =
  "Olá Made in Roça! Gostaria de tirar uma dúvida.";

export const WHATSAPP_DOUBT_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DOUBT_MESSAGE)}`;

export const IMAGES = {
  logo: "/images/branding/logo-made-in-roca.png",
  badge: "/images/branding/badge.png",
  placaMadeira: "/images/branding/placa de madeira.png",
  gelato: "/images/gelatos/gelato1.jpg",
  porcoNaLata: "/images/porco-na-lata/porco-na-lata1.jpg",
  torresmo: "/images/torresmo/torresmo1.jpg",
  doceLeite: {
    tradicional: "/images/doce-leite/doce-leite-tradicional.png",
    coco: "/images/doce-leite/doce-leite-coco.png",
    pacoca: "/images/doce-leite/doce-leite-paçoca.png",
    ameixa: "/images/doce-leite/doce-leite-ameixa.png",
  },
} as const;

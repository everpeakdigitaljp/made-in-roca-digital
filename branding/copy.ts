export const EMPTY_BASKET_MESSAGE = "Sua cestinha tá esperando um trem bão.";

export const ADDED_TO_CART_TOAST =
  "🌾 Prontim! Esse trem já tá guardado na sua cestinha.";

export const NAV_LINKS = [
  { label: "Nossa História", href: "#historia" },
  { label: "Cardápio", href: "/menu" },
  { label: "Como Pedir", href: "#como-pedir" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
] as const;

export const ORDER_STEPS = [
  {
    icon: "🛒",
    title: "Escolha seus produtos",
    description: "Navegue pelo nosso cardápio e selecione seus favoritos.",
  },
  {
    icon: "💬",
    title: "Envie seu pedido pelo WhatsApp",
    description: "Fale conosco diretamente e confirme seu pedido com facilidade.",
  },
  {
    icon: "🏠",
    title: "Receba em casa ou retire",
    description: "Entregamos com carinho ou você pode retirar no local.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote: "Me lembrou os doces da minha infância.",
    author: "Maria S.",
  },
  {
    quote: "Sabor incrível e atendimento excelente.",
    author: "Carlos T.",
  },
  {
    quote: "Os gelatos são maravilhosos.",
    author: "Ana L.",
  },
] as const;

export const WHATSAPP_ORDER_GREETING = `Olá Made in Roça!
Gostaria de fazer este pedido:`;

export const ORDER_NOTES_PLACEHOLDER =
  "Ex: entregar após as 18h, separar para presente...";

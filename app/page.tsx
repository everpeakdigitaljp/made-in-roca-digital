"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";

/* ─── Constants ─────────────────────────────────────────── */

const WHATSAPP_NUMBER = "819098947903";
const WHATSAPP_DISPLAY = "090-9894-7903";
const INSTAGRAM_HANDLE = "@madeinroca.jp";
const INSTAGRAM_URL = "https://instagram.com/madeinroca.jp";

const WHATSAPP_DOUBT_MESSAGE = "Olá Made in Roça! Gostaria de tirar uma dúvida.";
const WHATSAPP_DOUBT_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DOUBT_MESSAGE)}`;

const IMAGES = {
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

/** Imagem por sabor — Doce de Leite Artesanal */
const DOCE_LEITE_VARIANT_IMAGES: Record<string, string> = {
  Tradicional: IMAGES.doceLeite.tradicional,
  Coco: IMAGES.doceLeite.coco,
  Paçoca: IMAGES.doceLeite.pacoca,
  Ameixa: IMAGES.doceLeite.ameixa,
};

/* ─── Carrinho: tipos e funções ─────────────────────────── */

type ProductVariant = {
  name: string;
  priceYen: number;
};

// Tamanho com preço opcional — preparado para preços diferentes por tamanho
type ProductSizeOption = {
  label: string;
  priceYen?: number;
};

type CartItem = {
  name: string;
  variant: string;
  size: string;
  priceYen: number;
  quantity: number;
};

// Identificador único: produto + variante + tamanho
function getCartItemId(name: string, variant: string, size: string) {
  return `${name}::${variant}::${size}`;
}

function formatYen(value: number) {
  return `¥${value.toLocaleString()}`;
}

// Preço final: usa preço do tamanho se definido, senão preço base da variante
function resolveItemPrice(
  variant: ProductVariant,
  size: ProductSizeOption,
): number {
  return size.priceYen ?? variant.priceYen;
}

const productCategories = [
  {
    emoji: "🍮",
    title: "Doces da Fazenda",
    products: [
      {
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
        sizes: [{ label: "150ml" }, { label: "180ml" }, { label: "240ml" }],
      },
    ],
  },
  {
    emoji: "🍨",
    title: "Gelatos Artesanais",
    products: [
      {
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
        sizes: [{ label: "180ml" }, { label: "240ml" }],
      },
    ],
  },
  {
    emoji: "🥓",
    title: "Especialidades Caipiras",
    products: [
      {
        name: "Porco na Lata",
        image: IMAGES.porcoNaLata,
        description:
          "Conserva artesanal de carne suína desfiada, temperada com especiarias caipiras.",
        variants: [{ name: "Tradicional", priceYen: 1800 }],
        sizes: [{ label: "500g" }, { label: "1kg" }],
      },
      {
        name: "Torresmo Caipira",
        image: IMAGES.torresmo,
        description:
          "Torresmo crocante feito na panela de ferro, com sal grosso e tempero de fazenda.",
        variants: [{ name: "Semi pronto congelado", priceYen: 900 }],
        sizes: [{ label: "500g" }, { label: "1kg" }],
      },
    ],
  },
] as const;

type CatalogProduct = (typeof productCategories)[number]["products"][number];

function getCatalogProduct(productName: string): CatalogProduct | undefined {
  for (const category of productCategories) {
    const product = category.products.find((item) => item.name === productName);
    if (product) return product;
  }
  return undefined;
}

const DOCE_LEITE_EXPERIENCE = {
  story:
    "Cozido lentamente no tacho de cobre, como nas fazendas do interior. Cada pote guarda o sabor acolhedor da infância e a tradição da roça brasileira.",
} as const;

type ProductModalMeta = {
  story?: string;
  variantImages?: Record<string, string>;
};

const PRODUCT_MODAL_META: Record<string, ProductModalMeta> = {
  "Doce de Leite Artesanal": {
    story: DOCE_LEITE_EXPERIENCE.story,
    variantImages: DOCE_LEITE_VARIANT_IMAGES,
  },
};

function getStartingPrice(
  variants: readonly ProductVariant[],
  sizes: readonly ProductSizeOption[],
) {
  return Math.min(
    ...variants.flatMap((variant) =>
      sizes.map((size) => resolveItemPrice(variant, size)),
    ),
  );
}

function resolveVariantImage(
  defaultImage: string,
  variantName: string,
  variantImages?: Record<string, string>,
) {
  return variantImages?.[variantName] ?? defaultImage;
}

/* ─── WhatsApp: mensagem agrupada por produto ───────────── */

type ProductCatalogEntry = {
  emoji: string;
  order: number;
};

// Mapa produto → emoji e ordem de exibição na mensagem
const PRODUCT_CATALOG: Record<string, ProductCatalogEntry> =
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

function formatQuantityLabel(quantity: number) {
  return quantity === 1 ? "1 unidade" : `${quantity} unidades`;
}

// Monta rótulo da variante + tamanho para carrinho e WhatsApp
function formatVariantLabel(item: CartItem) {
  return `${item.variant} · ${item.size}`;
}

function formatCartLineItem(item: CartItem) {
  const lineSubtotal = item.priceYen * item.quantity;
  return `• ${formatVariantLabel(item)} — ${formatQuantityLabel(item.quantity)} — ${formatYen(lineSubtotal)}`;
}

function groupCartByProduct(cart: CartItem[]) {
  const groups = new Map<string, CartItem[]>();

  for (const item of cart) {
    const existing = groups.get(item.name) ?? [];
    existing.push(item);
    groups.set(item.name, existing);
  }

  return Array.from(groups.entries()).sort(([nameA], [nameB]) => {
    const orderA = PRODUCT_CATALOG[nameA]?.order ?? 999;
    const orderB = PRODUCT_CATALOG[nameB]?.order ?? 999;
    return orderA - orderB;
  });
}

function formatProductGroup(productName: string, items: CartItem[]) {
  const emoji = PRODUCT_CATALOG[productName]?.emoji ?? "🛒";
  const groupSubtotal = items.reduce(
    (sum, item) => sum + item.priceYen * item.quantity,
    0,
  );

  const lines = items.map(formatCartLineItem).join("\n");

  return `${emoji} ${productName}\n\n${lines}\n\nSubtotal: ${formatYen(groupSubtotal)}`;
}

function buildWhatsAppOrderMessage(cart: CartItem[], notes?: string) {
  const groupsText = groupCartByProduct(cart)
    .map(([productName, items]) => formatProductGroup(productName, items))
    .join("\n\n");

  const total = cart.reduce(
    (sum, item) => sum + item.priceYen * item.quantity,
    0,
  );

  const trimmedNotes = notes?.trim();
  const notesBlock = trimmedNotes
    ? `\n\nObservações:\n${trimmedNotes}`
    : "";

  return `Olá Made in Roça!
Gostaria de fazer este pedido:

${groupsText}

Total: ${formatYen(total)}${notesBlock}`;
}

function createCartWhatsAppLink(cart: CartItem[], notes?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppOrderMessage(cart, notes))}`;
}

function getProductImageForCartItem(item: CartItem) {
  const product = getCatalogProduct(item.name);
  if (!product) return IMAGES.logo;
  return resolveVariantImage(
    product.image,
    item.variant,
    PRODUCT_MODAL_META[item.name]?.variantImages,
  );
}

const flavors = [
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

const steps = [
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

const testimonials = [
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

/* ─── Icons ───────────────────────────────────────────────── */

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

/* ─── UI Components ─────────────────────────────────────── */

function SectionHeading({
  label,
  title,
  description,
}: {
  label?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 text-center sm:mb-14">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37] sm:text-sm">
          {label}
        </p>
      )}
      <h2 className="mt-2 font-serif text-3xl font-bold text-[#2f5d2f] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#8b451f]/80 sm:text-lg">
          {description}
        </p>
      )}
      <div
        className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
}) {
  return (
    <div className="flex items-center overflow-hidden rounded-full border border-border bg-background">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Diminuir quantidade"
        className="size-9 rounded-none text-lg sm:size-10"
      >
        −
      </Button>
      <span className="min-w-9 text-center text-sm font-bold text-foreground sm:min-w-10 sm:text-base">
        {quantity}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onIncrease}
        aria-label="Aumentar quantidade"
        className="size-9 rounded-none text-lg sm:size-10"
      >
        +
      </Button>
    </div>
  );
}

function LogoImage({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const sizeClass =
    size === "sm"
      ? "h-12 max-h-12 sm:max-h-14"
      : "h-20 max-h-20 sm:h-24 sm:max-h-24";

  return (
    <div
      className={`inline-block overflow-hidden rounded-2xl bg-[#fff8ed] p-2 shadow-md sm:p-3 ${className}`}
    >
      <Image
        src={IMAGES.logo}
        alt="Made in Roça"
        width={512}
        height={512}
        priority={size === "md"}
        className={`w-auto object-contain ${sizeClass}`}
        style={{ width: "auto", height: "auto" }}
      />
    </div>
  );
}

const EMPTY_BASKET_MESSAGE = "Sua cestinha tá esperando um trem bão.";

function ProductCard({
  name,
  image,
  description,
  variants,
  sizes,
  onOpenOptions,
}: {
  name: string;
  image: string;
  description: string;
  variants: readonly ProductVariant[];
  sizes: readonly ProductSizeOption[];
  onOpenOptions: () => void;
}) {
  const startingPrice = getStartingPrice(variants, sizes);

  return (
    <Card className="group transition duration-300 hover:border-accent/30 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-background sm:aspect-[16/10]">
        <Image
          src={image}
          alt={name}
          width={960}
          height={600}
          className="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
      </div>

      <CardContent className="space-y-4">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>

        <div className="space-y-2.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
              Sabores disponíveis
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {variants.map((variant) => (
                <Badge key={variant.name} variant="outline">
                  {variant.name}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
              Tamanhos disponíveis
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {sizes.map((size) => (
                <Badge key={size.label} variant="muted">
                  {size.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <p className="font-serif text-xl font-bold text-foreground sm:text-2xl">
          A partir de {formatYen(startingPrice)}
        </p>
      </CardContent>

      <CardFooter className="w-full">
        <Button className="w-full" size="lg" onClick={onOpenOptions}>
          Escolher
        </Button>
      </CardFooter>
    </Card>
  );
}

type ProductDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  image: string;
  variantImages?: Record<string, string>;
  variants: readonly ProductVariant[];
  sizes: readonly ProductSizeOption[];
  selectedVariant: string;
  selectedSize: string;
  onVariantChange: (variantName: string) => void;
  onSizeChange: (sizeLabel: string) => void;
  onAddToCart: (
    name: string,
    variant: string,
    size: string,
    priceYen: number,
    quantity: number,
  ) => void;
};

function ProductDrawer({
  open,
  onOpenChange,
  name,
  image,
  variantImages,
  variants,
  sizes,
  selectedVariant,
  selectedSize,
  onVariantChange,
  onSizeChange,
  onAddToCart,
}: ProductDrawerProps) {
  const [quantity, setQuantity] = useState(1);

  const activeVariant =
    variants.find((variant) => variant.name === selectedVariant) ?? variants[0];
  const activeSize =
    sizes.find((size) => size.label === selectedSize) ?? sizes[0];
  const unitPrice = resolveItemPrice(activeVariant, activeSize);
  const activeImage = resolveVariantImage(
    image,
    activeVariant.name,
    variantImages,
  );

  useEffect(() => {
    if (!open) return;
    setQuantity(1);
  }, [open, name]);

  function handleAddToCart() {
    onAddToCart(
      name,
      activeVariant.name,
      activeSize.label,
      unitPrice,
      quantity,
    );
    setQuantity(1);
    toast("🌾 Prontim! Esse trem já tá guardado na sua cestinha.");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex max-h-[94dvh] flex-col gap-0 p-0">
        <SheetTitle className="sr-only">{name}</SheetTitle>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="relative h-56 w-full shrink-0 overflow-hidden sm:h-60">
            <Image
              key={activeImage}
              src={activeImage}
              alt={`${name} — ${activeVariant.name}`}
              width={960}
              height={1200}
              className="size-full object-cover object-center transition-opacity duration-300"
              sizes="100vw"
            />
          </div>

          <div className="space-y-3 px-4 pb-4 pt-3 sm:px-5">
            <div>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground sm:text-sm">
                Qual sabor ocê vai levá?
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {variants.map((variant) => (
                  <Button
                    key={variant.name}
                    type="button"
                    variant={
                      selectedVariant === variant.name ? "chipActive" : "chip"
                    }
                    size="chip"
                    onClick={() => onVariantChange(variant.name)}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground sm:text-sm">
                Escolha o tamanhim
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size.label}
                    type="button"
                    variant={
                      selectedSize === size.label ? "chipSizeActive" : "chip"
                    }
                    size="chip"
                    onClick={() => onSizeChange(size.label)}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-3">
              <span className="text-xs font-semibold text-muted-foreground sm:text-sm">
                Quantos vai levá?
              </span>
              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                onIncrease={() => setQuantity((q) => q + 1)}
              />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button className="w-full" size="lg" onClick={handleAddToCart}>
            🧺 Guardar na Cestinha
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function CartDrawer({
  open,
  onOpenChange,
  cart,
  orderNotes,
  onOrderNotesChange,
  onUpdateQuantity,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  orderNotes: string;
  onOrderNotesChange: (value: string) => void;
  onUpdateQuantity: (
    name: string,
    variant: string,
    size: string,
    quantity: number,
  ) => void;
  onRemove: (name: string, variant: string, size: string) => void;
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.priceYen * item.quantity,
    0,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex max-h-[94dvh] flex-col gap-0 p-0">
        <SheetHeader>
          <SheetTitle>Minha Cestinha</SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5 sm:py-4">
          {cart.length === 0 ? (
            <p className="py-8 text-center text-sm leading-relaxed text-muted-foreground">
              {EMPTY_BASKET_MESSAGE}
            </p>
          ) : (
            <ul className="space-y-3">
              {cart.map((item) => {
                const subtotal = item.priceYen * item.quantity;
                const itemId = getCartItemId(item.name, item.variant, item.size);
                const itemImage = getProductImageForCartItem(item);

                return (
                  <li
                    key={itemId}
                    className="flex gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-background">
                      <Image
                        src={itemImage}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="size-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold leading-snug text-foreground">
                            {item.name}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-[10px]">
                              {item.variant}
                            </Badge>
                            <Badge variant="muted" className="text-[10px]">
                              {item.size}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto shrink-0 px-2 py-1 text-xs text-muted-foreground"
                          onClick={() =>
                            onRemove(item.name, item.variant, item.size)
                          }
                        >
                          remover
                        </Button>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <QuantitySelector
                          quantity={item.quantity}
                          onDecrease={() =>
                            onUpdateQuantity(
                              item.name,
                              item.variant,
                              item.size,
                              item.quantity - 1,
                            )
                          }
                          onIncrease={() =>
                            onUpdateQuantity(
                              item.name,
                              item.variant,
                              item.size,
                              item.quantity + 1,
                            )
                          }
                        />
                        <p className="text-sm font-bold tabular-nums text-foreground">
                          {formatYen(subtotal)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-4">
            <label
              htmlFor="order-notes"
              className="mb-1.5 block text-sm font-semibold text-muted-foreground"
            >
              Alguma observação pro seu pedido?
            </label>
            <Textarea
              id="order-notes"
              value={orderNotes}
              onChange={(event) => onOrderNotesChange(event.target.value)}
              placeholder="Ex: entregar após as 18h, separar para presente..."
              rows={3}
            />
          </div>

          {cart.length > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3 ring-1 ring-primary/10">
              <span className="font-semibold text-muted-foreground">
                Total geral
              </span>
              <span className="font-serif text-xl font-bold tabular-nums text-foreground">
                {formatYen(total)}
              </span>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter>
            <Button className="w-full" size="lg" asChild>
              <a
                href={createCartWhatsAppLink(cart, orderNotes)}
                target="_blank"
                rel="noopener noreferrer"
              >
                📲 Fazer Pedido pelo WhatsApp
              </a>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function FloatingWhatsApp({ elevated }: { elevated?: boolean }) {
  return (
    <a
      href={WHATSAPP_DOUBT_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tirar dúvida no WhatsApp"
      className={`fixed right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/90 text-white shadow-md transition hover:bg-[#25D366] hover:shadow-lg active:scale-95 sm:right-6 ${
        elevated ? "bottom-20 sm:bottom-6" : "bottom-5 sm:bottom-6"
      }`}
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}

function FloatingCartButton({ onOpen }: { onOpen: () => void }) {
  return (
    <Button
      type="button"
      size="lg"
      onClick={onOpen}
      className="fixed bottom-0 left-0 right-0 z-[90] mx-auto w-full max-w-lg rounded-t-2xl rounded-b-none pb-[max(0.875rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(47,93,47,0.28)] sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto sm:max-w-none sm:rounded-full sm:pb-3.5"
    >
      🧺 Ver Cestinha
    </Button>
  );
}

const NAV_LINKS = [
  { label: "Nossa História", href: "#historia" },
  { label: "Produtos", href: "#produtos" },
  { label: "Como Pedir", href: "#como-pedir" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
] as const;

function SiteHeader({
  cart,
  onViewBasket,
}: {
  cart: CartItem[];
  onViewBasket: () => void;
}) {
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.priceYen * item.quantity,
    0,
  );
  const hasItems = cartItemCount > 0;

  return (
    <header className="sticky top-0 z-50 border-b border-[#8b451f]/10 bg-[#fff8ed]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:h-[4.5rem] sm:gap-6">
        <a
          href="#"
          className="shrink-0 transition opacity-95 hover:opacity-100"
          aria-label="Made in Roça — início"
        >
          <LogoImage size="sm" />
        </a>

        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Menu principal"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-[#8b451f] transition hover:bg-[#2f5d2f]/5 hover:text-[#2f5d2f]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {hasItems ? (
          <Button
            type="button"
            size="sm"
            onClick={onViewBasket}
            aria-label={`Minha cestinha, ${cartItemCount} ${cartItemCount === 1 ? "item" : "itens"}, total ${formatYen(cartTotal)}`}
            className="shrink-0 whitespace-nowrap text-xs sm:text-sm"
          >
            🧺 {cartItemCount}{" "}
            {cartItemCount === 1 ? "item" : "itens"} •{" "}
            <span className="tabular-nums">{formatYen(cartTotal)}</span>
          </Button>
        ) : (
          <Button asChild size="sm" className="shrink-0">
            <a href="#produtos">Ver Produtos</a>
          </Button>
        )}
      </div>
    </header>
  );
}

/* ─── Page ────────────────────────────────────────────────── */

export default function Home() {
  // Estado global do carrinho
  const [cart, setCart] = useState<CartItem[]>([]);

  // Variante e tamanho selecionados de cada produto (chave = nome do produto)
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {},
  );
  const [modalProductName, setModalProductName] = useState<string | null>(null);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  const modalProduct = modalProductName
    ? getCatalogProduct(modalProductName) ?? null
    : null;

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const showFloatingCartButton =
    cartItemCount > 0 && !isBasketOpen && !modalProductName;

  function openBasketDrawer() {
    setModalProductName(null);
    setIsBasketOpen(true);
  }

  function getSelectedVariant(
    productName: string,
    variants: readonly ProductVariant[],
  ) {
    return selectedVariants[productName] ?? variants[0].name;
  }

  function getSelectedSize(
    productName: string,
    sizes: readonly ProductSizeOption[],
  ) {
    return selectedSizes[productName] ?? sizes[0].label;
  }

  function selectVariant(productName: string, variantName: string) {
    setSelectedVariants((current) => ({
      ...current,
      [productName]: variantName,
    }));
  }

  function selectSize(productName: string, sizeLabel: string) {
    setSelectedSizes((current) => ({
      ...current,
      [productName]: sizeLabel,
    }));
  }

  function isSameCartItem(
    item: CartItem,
    name: string,
    variant: string,
    size: string,
  ) {
    return (
      item.name === name && item.variant === variant && item.size === size
    );
  }

  // Adiciona produto + variante + tamanho (soma se já existir a mesma combinação)
  function addToCart(
    name: string,
    variant: string,
    size: string,
    priceYen: number,
    quantity: number,
  ) {
    setCart((current) => {
      const existing = current.find((item) =>
        isSameCartItem(item, name, variant, size),
      );

      if (existing) {
        return current.map((item) =>
          isSameCartItem(item, name, variant, size)
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...current, { name, variant, size, priceYen, quantity }];
    });
  }

  // Atualiza quantidade no carrinho (remove se chegar a 0)
  function updateCartQuantity(
    name: string,
    variant: string,
    size: string,
    quantity: number,
  ) {
    if (quantity <= 0) {
      removeFromCart(name, variant, size);
      return;
    }

    setCart((current) =>
      current.map((item) =>
        isSameCartItem(item, name, variant, size)
          ? { ...item, quantity }
          : item,
      ),
    );
  }

  // Remove produto + variante + tamanho do carrinho
  function removeFromCart(name: string, variant: string, size: string) {
    setCart((current) =>
      current.filter(
        (item) => !isSameCartItem(item, name, variant, size),
      ),
    );
  }

  function handleViewBasketFromHeader() {
    openBasketDrawer();
  }

  return (
    <main
      className={`min-h-screen bg-[#fff8ed] text-[#2f5d2f] ${showFloatingCartButton ? "pb-20 sm:pb-24" : ""}`}
    >
      <SiteHeader cart={cart} onViewBasket={handleViewBasketFromHeader} />

      {/* ── Seção 1: Hero Premium ── */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={IMAGES.gelato}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#2f5d2f]/75 via-[#2f5d2f]/55 to-[#fff8ed]/95" />

        <div className="relative z-10 mx-auto max-w-3xl px-5 py-20 text-center">
          <LogoImage size="md" className="mx-auto" />

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#d4af37] sm:text-sm">
            Produção Artesanal em Hamamatsu
          </p>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-[#fff8ed] sm:text-5xl md:text-6xl lg:text-7xl">
            Sabores da Fazenda Brasileira
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#fff8ed]/90 sm:text-lg md:text-xl">
            Doces artesanais, gelatos e receitas tradicionais que trazem o
            sabor da roça para sua mesa.
          </p>

          <div className="mt-10">
            <a
              href="#produtos"
              className="inline-flex items-center rounded-full bg-[#2f5d2f] px-12 py-5 text-lg font-bold text-white shadow-lg shadow-[#2f5d2f]/30 transition hover:bg-[#264d26] hover:shadow-xl active:scale-[0.98] sm:px-14 sm:py-6 sm:text-xl"
            >
              Ver Produtos
            </a>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#fff8ed]/60"
          aria-hidden="true"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ── Seção 2: Nossa História ── */}
      <section id="historia" className="scroll-mt-20 px-5 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37] sm:text-sm">
              Quem somos
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#2f5d2f] sm:text-4xl">
              Nossa História
            </h2>
            <div
              className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent lg:mx-0 lg:from-[#d4af37] lg:via-[#d4af37]/50 lg:to-transparent"
              aria-hidden="true"
            />
            <p className="mt-8 text-base leading-relaxed text-[#8b451f]/90 sm:text-lg lg:leading-8">
              A Made in Roça nasceu da paixão pelos sabores da fazenda
              brasileira. Cada receita é preparada com carinho, ingredientes
              selecionados e aquele sabor que traz lembranças da infância e da
              vida no interior.
            </p>
            <div className="mt-8 hidden h-1 w-20 rounded-full bg-[#d4af37] lg:block" />
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-[#8b451f]/15">
            <Image
              src={IMAGES.doceLeite.tradicional}
              alt="Doce de leite artesanal Made in Roça"
              width={800}
              height={600}
              className="size-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-[#d4af37]/20" />
          </div>
        </div>
      </section>

      {/* ── Seção 3: Produtos + Carrinho ── */}
      <section id="produtos" className="scroll-mt-20 bg-white px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Cardápio"
            title="Nossos Produtos"
            description="Preparados em pequenos lotes, com receitas de família e ingredientes selecionados."
          />

          <div className="space-y-14 sm:space-y-20">
              {productCategories.map((category) => (
                <div key={category.title}>
                  <h3 className="mb-6 flex items-center gap-3 font-serif text-2xl font-bold text-[#2f5d2f] sm:text-3xl">
                    <span aria-hidden="true">{category.emoji}</span>
                    {category.title}
                  </h3>

                  <div
                    className={`grid gap-6 ${
                      category.products.some(
                        (p) => p.name === "Doce de Leite Artesanal",
                      )
                        ? "w-full max-w-5xl"
                        : category.products.length > 1
                          ? "sm:grid-cols-2"
                          : "max-w-lg"
                    }`}
                  >
                    {category.products.map((product) => (
                      <ProductCard
                        key={product.name}
                        name={product.name}
                        image={product.image}
                        description={product.description}
                        variants={product.variants}
                        sizes={product.sizes}
                        onOpenOptions={() => setModalProductName(product.name)}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── Seção 4: Sabores ── */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Gelato"
            title="Sabores"
            description="Descubra as combinações que fazem nosso gelato artesanal tão especial."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {flavors.map((flavor) => (
              <div
                key={flavor.name}
                className="group rounded-2xl border border-[#8b451f]/10 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/40 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fff8ed] text-xl ring-2 ring-[#d4af37]/30 transition group-hover:ring-[#d4af37]">
                  ✦
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2f5d2f]">
                  {flavor.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8b451f]/80">
                  {flavor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seção 5: Como Pedir ── */}
      <section id="como-pedir" className="scroll-mt-20 bg-[#2f5d2f] px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center sm:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37] sm:text-sm">
              Simples e rápido
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[#fff8ed] sm:text-4xl">
              Como Pedir
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-[#fff8ed]/10 bg-[#fff8ed]/5 p-8 text-center backdrop-blur-sm"
              >
                <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-[#2f5d2f]">
                  {index + 1}
                </span>
                <div className="mb-4 text-5xl" aria-hidden="true">
                  {step.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-[#fff8ed]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#fff8ed]/75">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seção 6: Depoimentos ── */}
      <section id="depoimentos" className="scroll-mt-20 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Clientes"
            title="Depoimentos"
            description="O que dizem quem já experimentou nossos sabores."
          />

          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.author}
                className="flex flex-col rounded-2xl border border-[#8b451f]/10 bg-white p-6 shadow-sm"
              >
                <span className="font-serif text-4xl leading-none text-[#d4af37]" aria-hidden="true">
                  &ldquo;
                </span>
                <p className="mt-2 flex-1 text-base italic leading-relaxed text-[#8b451f]/90">
                  {item.quote}
                </p>
                <footer className="mt-4 text-sm font-semibold text-[#2f5d2f]">
                  — {item.author}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seção 7: CTA Final ── */}
      <section className="relative overflow-hidden px-5 py-20 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden="true"
        >
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-[#d4af37]/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#2f5d2f]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-[#2f5d2f] sm:text-4xl md:text-5xl">
            Pronto para experimentar os sabores da fazenda?
          </h2>
          <p className="mt-4 text-base text-[#8b451f]/80 sm:text-lg">
            Monte seu pedido e finalize pelo WhatsApp quando estiver pronto.
          </p>
          {cartItemCount > 0 ? (
            <button
              type="button"
              onClick={openBasketDrawer}
              className="mt-10 inline-flex items-center rounded-full bg-[#2f5d2f] px-10 py-5 text-base font-semibold text-[#fff8ed] shadow-lg shadow-[#2f5d2f]/20 transition hover:bg-[#264d26] hover:shadow-xl active:scale-[0.98]"
            >
              🧺 Ver Cestinha
            </button>
          ) : (
            <a
              href="#produtos"
              className="mt-10 inline-flex items-center rounded-full bg-[#2f5d2f] px-10 py-5 text-base font-semibold text-[#fff8ed] shadow-lg shadow-[#2f5d2f]/20 transition hover:bg-[#264d26] hover:shadow-xl active:scale-[0.98]"
            >
              Ver Produtos
            </a>
          )}
        </div>
      </section>

      {/* ── Seção 9: Rodapé ── */}
      <footer id="contato" className="scroll-mt-20 border-t border-[#fff8ed]/10 bg-[#2f5d2f] px-5 py-12 text-[#fff8ed]">
        <div className="mx-auto max-w-6xl text-center">
          <LogoImage size="sm" className="mx-auto" />

          <p className="mt-5 font-serif text-xl font-bold">Made in Roça</p>
          <p className="mt-1 text-sm text-[#fff8ed]/75">
            Sabores da Fazenda Brasileira
          </p>
          <p className="mt-1 text-sm text-[#fff8ed]/60">
            Hamamatsu — Japão
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
            <a
              href={WHATSAPP_DOUBT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#fff8ed]/80 transition hover:text-[#d4af37]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp: {WHATSAPP_DISPLAY}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#fff8ed]/80 transition hover:text-[#d4af37]"
            >
              <InstagramIcon className="h-4 w-4" />
              Instagram: {INSTAGRAM_HANDLE}
            </a>
          </div>

          <p className="mt-10 text-xs text-[#fff8ed]/40">
            © {new Date().getFullYear()} Made in Roça. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <Toaster position="top-center" richColors closeButton />

      {!isBasketOpen && (
        <FloatingWhatsApp elevated={showFloatingCartButton} />
      )}

      {showFloatingCartButton && (
        <FloatingCartButton onOpen={openBasketDrawer} />
      )}

      {modalProduct && (
        <ProductDrawer
          open
          onOpenChange={(open) => {
            if (!open) setModalProductName(null);
          }}
          name={modalProduct.name}
          image={modalProduct.image}
          variantImages={PRODUCT_MODAL_META[modalProduct.name]?.variantImages}
          variants={modalProduct.variants}
          sizes={modalProduct.sizes}
          selectedVariant={getSelectedVariant(
            modalProduct.name,
            modalProduct.variants,
          )}
          selectedSize={getSelectedSize(
            modalProduct.name,
            modalProduct.sizes,
          )}
          onVariantChange={(variantName) =>
            selectVariant(modalProduct.name, variantName)
          }
          onSizeChange={(sizeLabel) =>
            selectSize(modalProduct.name, sizeLabel)
          }
          onAddToCart={addToCart}
        />
      )}

      <CartDrawer
        open={isBasketOpen}
        onOpenChange={setIsBasketOpen}
        cart={cart}
        orderNotes={orderNotes}
        onOrderNotesChange={setOrderNotes}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
      />
    </main>
  );
}

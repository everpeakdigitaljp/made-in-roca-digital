"use client";

import Image from "next/image";
import { useState } from "react";

/* ─── Constants ─────────────────────────────────────────── */

const WHATSAPP_NUMBER = "819098947903";
const WHATSAPP_DISPLAY = "090-9894-7903";
const INSTAGRAM_HANDLE = "@madeinroca.jp";
const INSTAGRAM_URL = "https://instagram.com/madeinroca.jp";

const WHATSAPP_DOUBT_MESSAGE = "Olá Made in Roça! Gostaria de tirar uma dúvida.";
const WHATSAPP_DOUBT_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DOUBT_MESSAGE)}`;

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
        image: "/images/doce-leite1.jpg",
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
        image: "/images/gelato1.jpg",
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
        image: "/images/porco-na-lata1.jpg",
        description:
          "Conserva artesanal de carne suína desfiada, temperada com especiarias caipiras.",
        variants: [{ name: "Tradicional", priceYen: 1800 }],
        sizes: [{ label: "500g" }, { label: "1kg" }],
      },
      {
        name: "Torresmo Caipira",
        image: "/images/torresmo1.jpg",
        description:
          "Torresmo crocante feito na panela de ferro, com sal grosso e tempero de fazenda.",
        variants: [{ name: "Semi pronto congelado", priceYen: 900 }],
        sizes: [{ label: "500g" }, { label: "1kg" }],
      },
    ],
  },
] as const;

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

function buildWhatsAppOrderMessage(cart: CartItem[]) {
  const groupsText = groupCartByProduct(cart)
    .map(([productName, items]) => formatProductGroup(productName, items))
    .join("\n\n");

  const total = cart.reduce(
    (sum, item) => sum + item.priceYen * item.quantity,
    0,
  );

  return `Olá Made in Roça!
Gostaria de fazer este pedido:

${groupsText}

Total: ${formatYen(total)}`;
}

function createCartWhatsAppLink(cart: CartItem[]) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppOrderMessage(cart))}`;
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
    <div className="flex items-center overflow-hidden rounded-full border border-[#8b451f]/20 bg-[#fff8ed]">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Diminuir quantidade"
        className="flex h-9 w-9 items-center justify-center text-lg font-bold text-[#2f5d2f] transition hover:bg-[#8b451f]/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        −
      </button>
      <span className="min-w-9 text-center text-sm font-bold text-[#2f5d2f]">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Aumentar quantidade"
        className="flex h-9 w-9 items-center justify-center text-lg font-bold text-[#2f5d2f] transition hover:bg-[#8b451f]/10"
      >
        +
      </button>
    </div>
  );
}

function VariantSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: readonly ProductVariant[];
  selected: string;
  onSelect: (variantName: string) => void;
}) {
  const useSelectOnMobile = variants.length > 4;

  return (
    <div className="mt-4">
      <p className="mb-2 text-sm font-medium text-[#8b451f]">
        Escolha o sabor:
      </p>

      {/* Select no mobile quando há muitos sabores (ex: Gelato) */}
      {useSelectOnMobile && (
        <select
          value={selected}
          onChange={(event) => onSelect(event.target.value)}
          className="w-full rounded-full border border-[#8b451f]/20 bg-[#fff8ed] px-4 py-2.5 text-sm font-medium text-[#2f5d2f] outline-none focus:border-[#2f5d2f] sm:hidden"
        >
          {variants.map((variant) => (
            <option key={variant.name} value={variant.name}>
              {variant.name} — {formatYen(variant.priceYen)}
            </option>
          ))}
        </select>
      )}

      {/* Botões arredondados — sempre visíveis, ou só desktop se muitos sabores */}
      <div
        className={`flex flex-wrap gap-2 ${useSelectOnMobile ? "hidden sm:flex" : "flex"}`}
      >
        {variants.map((variant) => (
          <button
            key={variant.name}
            type="button"
            onClick={() => onSelect(variant.name)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
              selected === variant.name
                ? "bg-[#2f5d2f] text-[#fff8ed] shadow-sm"
                : "border border-[#8b451f]/20 bg-[#fff8ed] text-[#2f5d2f] hover:border-[#8b451f]/40"
            }`}
          >
            {variant.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function SizeSelector({
  sizes,
  selected,
  onSelect,
  getPriceLabel,
}: {
  sizes: readonly ProductSizeOption[];
  selected: string;
  onSelect: (sizeLabel: string) => void;
  getPriceLabel?: (size: ProductSizeOption) => string;
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-sm font-medium text-[#8b451f]">
        Escolha o tamanho:
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size.label}
            type="button"
            onClick={() => onSelect(size.label)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
              selected === size.label
                ? "bg-[#8b451f] text-[#fff8ed] shadow-sm"
                : "border border-[#8b451f]/20 bg-[#fff8ed] text-[#2f5d2f] hover:border-[#8b451f]/40"
            }`}
          >
            {size.label}
            {getPriceLabel ? ` — ${getPriceLabel(size)}` : ""}
          </button>
        ))}
      </div>
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
        src="/images/logo-made-in-roca.png"
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

function ProductCard({
  name,
  image,
  description,
  variants,
  sizes,
  selectedVariant,
  selectedSize,
  onVariantChange,
  onSizeChange,
  onAddToCart,
}: {
  name: string;
  image: string;
  description: string;
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
}) {
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const activeVariant =
    variants.find((variant) => variant.name === selectedVariant) ?? variants[0];
  const activeSize =
    sizes.find((size) => size.label === selectedSize) ?? sizes[0];
  const activePrice = resolveItemPrice(activeVariant, activeSize);

  function handleAddToCart() {
    onAddToCart(
      name,
      activeVariant.name,
      activeSize.label,
      activePrice,
      quantity,
    );
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2500);
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#8b451f]/10 bg-white shadow-sm shadow-[#8b451f]/5 transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/30 hover:shadow-xl hover:shadow-[#8b451f]/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#fff8ed]">
        <Image
          src={image}
          alt={name}
          width={800}
          height={600}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2f5d2f]/30 via-transparent to-transparent" />
        <span className="absolute bottom-3 right-3 rounded-full bg-[#fff8ed]/95 px-4 py-1.5 text-sm font-bold text-[#8b451f] shadow-sm backdrop-blur-sm">
          {formatYen(activePrice)}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="font-serif text-xl font-bold text-[#2f5d2f]">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#8b451f]/85 sm:text-base">
          {description}
        </p>

        <VariantSelector
          variants={variants}
          selected={selectedVariant}
          onSelect={onVariantChange}
        />

        <SizeSelector
          sizes={sizes}
          selected={selectedSize}
          onSelect={onSizeChange}
          getPriceLabel={(size) =>
            formatYen(resolveItemPrice(activeVariant, size))
          }
        />

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-[#8b451f]">Quantidade</span>
          <QuantitySelector
            quantity={quantity}
            onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            onIncrease={() => setQuantity((q) => q + 1)}
          />
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-5 w-full rounded-full bg-[#8b451f] px-6 py-3 text-sm font-semibold text-[#fff8ed] shadow-md shadow-[#8b451f]/20 transition hover:bg-[#723a1a] active:scale-[0.98] sm:w-auto"
        >
          Adicionar ao pedido
        </button>

        {addedFeedback && (
          <p className="mt-3 text-sm font-medium text-[#2f5d2f]">
            ✓ Produto adicionado ao pedido
          </p>
        )}
      </div>
    </article>
  );
}

// Painel lateral com resumo do carrinho
function CartPanel({
  cart,
  onUpdateQuantity,
  onRemove,
}: {
  cart: CartItem[];
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
    <aside
      id="meu-pedido"
      className="rounded-2xl border border-[#8b451f]/15 bg-[#fff8ed] p-6 shadow-lg shadow-[#8b451f]/10 lg:sticky lg:top-24"
    >
      <h3 className="font-serif text-2xl font-bold text-[#2f5d2f]">
        Meu Pedido
      </h3>

      {cart.length === 0 ? (
        <p className="mt-4 text-sm leading-relaxed text-[#8b451f]/80">
          Seu pedido ainda está vazio.
        </p>
      ) : (
        <>
          <ul className="mt-5 space-y-4">
            {cart.map((item) => {
              const subtotal = item.priceYen * item.quantity;
              const itemId = getCartItemId(item.name, item.variant, item.size);

              return (
                <li
                  key={itemId}
                  className="rounded-xl border border-[#8b451f]/10 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#2f5d2f]">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-sm text-[#8b451f]">
                        — {item.variant}
                      </p>
                      <p className="text-sm text-[#8b451f]/80">
                        — {item.size}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onRemove(item.name, item.variant, item.size)
                      }
                      aria-label={`Remover ${item.name} ${item.variant} ${item.size}`}
                      className="shrink-0 text-xs font-medium text-[#8b451f]/60 transition hover:text-[#8b451f]"
                    >
                      remover
                    </button>
                  </div>

                  <p className="mt-1 text-xs text-[#8b451f]/70">
                    Unitário: {formatYen(item.priceYen)}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
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
                    <p className="text-sm font-bold text-[#2f5d2f]">
                      {formatYen(subtotal)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 border-t border-[#8b451f]/15 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#8b451f]">Total geral</span>
              <span className="font-serif text-xl font-bold text-[#2f5d2f]">
                {formatYen(total)}
              </span>
            </div>
          </div>

          <a
            href={createCartWhatsAppLink(cart)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2f5d2f] px-6 py-4 text-sm font-semibold text-[#fff8ed] shadow-md shadow-[#2f5d2f]/20 transition hover:bg-[#264d26] hover:shadow-lg active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Finalizar Pedido no WhatsApp
          </a>
        </>
      )}
    </aside>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_DOUBT_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Tirar dúvida no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/90 text-white shadow-md transition hover:bg-[#25D366] hover:shadow-lg active:scale-95 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}

const NAV_LINKS = [
  { label: "Nossa História", href: "#historia" },
  { label: "Produtos", href: "#produtos" },
  { label: "Como Pedir", href: "#como-pedir" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
] as const;

function SiteHeader() {
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

        <a
          href="#produtos"
          className="shrink-0 rounded-full bg-[#2f5d2f] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#2f5d2f]/15 transition hover:bg-[#264d26] hover:shadow-md active:scale-[0.98] sm:px-5 sm:py-2.5 sm:text-sm"
        >
          Ver Produtos
        </a>
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

  return (
    <main className="min-h-screen bg-[#fff8ed] text-[#2f5d2f]">
      <SiteHeader />

      {/* ── Seção 1: Hero Premium ── */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gelato1.jpg"
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
              src="/images/doce-leite1.jpg"
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

          <div className="lg:grid lg:grid-cols-3 lg:items-start lg:gap-8">
            {/* Lista de produtos */}
            <div className="space-y-14 sm:space-y-20 lg:col-span-2">
              {productCategories.map((category) => (
                <div key={category.title}>
                  <h3 className="mb-6 flex items-center gap-3 font-serif text-2xl font-bold text-[#2f5d2f] sm:text-3xl">
                    <span aria-hidden="true">{category.emoji}</span>
                    {category.title}
                  </h3>

                  <div
                    className={`grid gap-6 ${
                      category.products.length > 1
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
                        selectedVariant={getSelectedVariant(
                          product.name,
                          product.variants,
                        )}
                        selectedSize={getSelectedSize(
                          product.name,
                          product.sizes,
                        )}
                        onVariantChange={(variantName) =>
                          selectVariant(product.name, variantName)
                        }
                        onSizeChange={(sizeLabel) =>
                          selectSize(product.name, sizeLabel)
                        }
                        onAddToCart={addToCart}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Meu Pedido — abaixo no mobile, ao lado no desktop */}
            <div className="mt-10 lg:mt-0">
              <CartPanel
                cart={cart}
                onUpdateQuantity={updateCartQuantity}
                onRemove={removeFromCart}
              />
            </div>
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
          <a
            href="#meu-pedido"
            className="mt-10 inline-flex items-center rounded-full bg-[#2f5d2f] px-10 py-5 text-base font-semibold text-[#fff8ed] shadow-lg shadow-[#2f5d2f]/20 transition hover:bg-[#264d26] hover:shadow-xl active:scale-[0.98]"
          >
            Ver Meu Pedido
          </a>
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

      {/* Botão flutuante discreto para dúvidas */}
      <FloatingWhatsApp />
    </main>
  );
}

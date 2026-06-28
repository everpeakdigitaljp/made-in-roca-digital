"use client";

import Image from "next/image";
import { useState } from "react";

export type ProductVariant = {
  name: string;
  priceYen: number;
};

export type ProductSizeOption = {
  label: string;
  priceYen?: number;
};

export type TrustBadge = {
  icon: string;
  label: string;
};

export type ProductExperienceCardProps = {
  name: string;
  image: string;
  /** Mapa sabor → imagem. Quando ausente, usa `image` para todos os sabores. */
  variantImages?: Partial<Record<string, string>>;
  description: string;
  story: string;
  trustBadges: TrustBadge[];
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

function formatYen(value: number) {
  return `¥${value.toLocaleString()}`;
}

function resolveItemPrice(
  variant: ProductVariant,
  size: ProductSizeOption,
): number {
  return size.priceYen ?? variant.priceYen;
}

function resolveVariantImage(
  defaultImage: string,
  variantName: string,
  variantImages?: Partial<Record<string, string>>,
) {
  return variantImages?.[variantName] ?? defaultImage;
}

/**
 * Everpeak — ProductExperienceCard
 * Layout de experiência: imagem sticky (desktop) + opções ao lado.
 */
export function ProductExperienceCard({
  name,
  image,
  variantImages,
  description,
  story,
  trustBadges,
  variants,
  sizes,
  selectedVariant,
  selectedSize,
  onVariantChange,
  onSizeChange,
  onAddToCart,
}: ProductExperienceCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const activeVariant =
    variants.find((variant) => variant.name === selectedVariant) ??
    variants[0];
  const activeSize =
    sizes.find((size) => size.label === selectedSize) ?? sizes[0];
  const unitPrice = resolveItemPrice(activeVariant, activeSize);
  const lineTotal = unitPrice * quantity;
  const activeImage = resolveVariantImage(
    image,
    activeVariant.name,
    variantImages,
  );

  function handleAddToCart() {
    onAddToCart(
      name,
      activeVariant.name,
      activeSize.label,
      unitPrice,
      quantity,
    );
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2500);
  }

  return (
    <article className="rounded-3xl border border-[#8b451f]/12 bg-[#fff8ed] pb-20 shadow-lg shadow-[#8b451f]/8 lg:pb-0">
      <div className="grid lg:grid-cols-2">
        {/* Coluna esquerda — imagem sticky no desktop */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative h-56 overflow-hidden rounded-t-3xl sm:h-64 lg:aspect-[4/5] lg:h-auto lg:min-h-[28rem] lg:rounded-l-3xl lg:rounded-tr-none">
            <Image
              key={activeImage}
              src={activeImage}
              alt={`${name} — ${activeVariant.name}`}
              width={960}
              height={1200}
              className="size-full object-cover transition-opacity duration-300"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2f5d2f]/55 via-[#2f5d2f]/10 to-transparent" />
            <span className="absolute left-3 top-3 rounded-full bg-[#fff8ed]/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8b451f] shadow-sm backdrop-blur-sm lg:left-4 lg:top-4 lg:px-3 lg:py-1 lg:text-xs">
              Artesanal
            </span>
            <span className="absolute bottom-3 left-3 right-3 rounded-xl bg-[#fff8ed]/90 px-3 py-1.5 text-center text-xs font-semibold text-[#2f5d2f] shadow-md backdrop-blur-sm lg:bottom-4 lg:left-4 lg:right-4 lg:rounded-2xl lg:px-4 lg:py-2.5 lg:text-sm">
              {activeVariant.name}
            </span>
          </div>
        </div>

        {/* Coluna direita — informações e opções */}
        <div className="space-y-3 p-4 lg:space-y-6 lg:rounded-r-3xl lg:p-8">
          <header className="space-y-1.5 lg:space-y-3">
            <h3 className="font-serif text-xl font-bold leading-tight text-[#2f5d2f] lg:text-3xl">
              {name}
            </h3>
            <p className="text-xs leading-snug text-[#8b451f]/85 lg:text-base lg:leading-relaxed">
              {description}
            </p>
            <p className="border-l-2 border-[#d4af37]/60 pl-3 text-xs italic leading-snug text-[#8b451f]/90 lg:pl-4 lg:text-base lg:leading-relaxed">
              {story}
            </p>
          </header>

          <div className="grid grid-cols-2 gap-1.5 lg:gap-3">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 rounded-xl border border-[#8b451f]/10 bg-white/80 px-2 py-1.5 shadow-sm lg:gap-2 lg:rounded-2xl lg:px-3 lg:py-2.5"
              >
                <span className="text-base lg:text-lg" aria-hidden="true">
                  {badge.icon}
                </span>
                <span className="text-[10px] font-medium leading-tight text-[#2f5d2f] lg:text-sm">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-[#8b451f] lg:mb-3 lg:text-sm">
              Escolha o sabor
            </p>
            <div className="flex flex-wrap gap-1.5 lg:gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.name}
                  type="button"
                  onClick={() => onVariantChange(variant.name)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition lg:px-4 lg:py-2.5 lg:text-sm ${
                    selectedVariant === variant.name
                      ? "bg-[#2f5d2f] text-[#fff8ed] shadow-md shadow-[#2f5d2f]/20"
                      : "border border-[#8b451f]/20 bg-white text-[#2f5d2f] hover:border-[#8b451f]/40"
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-[#8b451f] lg:mb-3 lg:text-sm">
              Escolha o tamanho
            </p>
            <div className="flex flex-wrap gap-1.5 lg:gap-2">
              {sizes.map((size) => (
                <button
                  key={size.label}
                  type="button"
                  onClick={() => onSizeChange(size.label)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition lg:px-4 lg:py-2.5 lg:text-sm ${
                    selectedSize === size.label
                      ? "bg-[#8b451f] text-[#fff8ed] shadow-md shadow-[#8b451f]/20"
                      : "border border-[#8b451f]/20 bg-white text-[#2f5d2f] hover:border-[#8b451f]/40"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 lg:space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#8b451f]/10 bg-white/60 p-3 lg:gap-4 lg:rounded-2xl lg:p-4">
              <span className="text-xs font-semibold text-[#8b451f] lg:text-sm">
                Quantidade
              </span>
              <div className="flex items-center overflow-hidden rounded-full border border-[#8b451f]/20 bg-[#fff8ed]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Diminuir quantidade"
                  className="flex h-10 w-10 items-center justify-center text-xl font-bold text-[#2f5d2f] transition hover:bg-[#8b451f]/10 disabled:cursor-not-allowed disabled:opacity-40 lg:h-12 lg:w-12 lg:text-2xl"
                >
                  −
                </button>
                <span className="min-w-10 text-center text-base font-bold text-[#2f5d2f] lg:min-w-12 lg:text-lg">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Aumentar quantidade"
                  className="flex h-10 w-10 items-center justify-center text-xl font-bold text-[#2f5d2f] transition hover:bg-[#8b451f]/10 lg:h-12 lg:w-12 lg:text-2xl"
                >
                  +
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-[#2f5d2f]/5 px-4 py-3 ring-1 ring-[#2f5d2f]/10 lg:rounded-2xl lg:px-5 lg:py-4">
              <div className="flex items-end justify-between gap-3 lg:gap-4">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#8b451f]/70 lg:text-xs">
                    Total deste item
                  </p>
                  <p className="mt-0.5 text-xs text-[#8b451f] lg:mt-1 lg:text-sm">
                    {activeVariant.name} · {activeSize.label}
                  </p>
                </div>
                <p className="font-serif text-2xl font-bold text-[#2f5d2f] lg:text-3xl">
                  {formatYen(lineTotal)}
                </p>
              </div>
              <p className="mt-1 text-[10px] text-[#8b451f]/60 lg:mt-2 lg:text-xs">
                {formatYen(unitPrice)} cada · {quantity}{" "}
                {quantity === 1 ? "unidade" : "unidades"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full rounded-full bg-[#2f5d2f] px-5 py-3 text-sm font-bold text-[#fff8ed] shadow-lg shadow-[#2f5d2f]/25 transition hover:bg-[#264d26] hover:shadow-xl active:scale-[0.98] lg:px-6 lg:py-4 lg:text-base"
            >
              🧺 Adicionar à Cestinha
            </button>

            {addedFeedback && (
              <p className="text-center text-xs font-medium text-[#2f5d2f] lg:text-sm">
                ✓ Produto adicionado ao pedido
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

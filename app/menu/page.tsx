"use client";

import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { getCatalogProduct, PRODUCT_MODAL_META, productCategories } from "@/data/index";
import { useCart } from "@/features/cart";
import { useCheckout } from "@/features/checkout";
import { getSelectedSize, getSelectedVariant } from "@/features/product";
import { CartDrawer } from "@/components/menu/cart-drawer";
import { FloatingCartButton } from "@/components/menu/floating-cart-button";
import { MenuHeader } from "@/components/menu/menu-header";
import { ProductCard } from "@/components/menu/product-card";
import { ProductDrawer } from "@/components/menu/product-drawer";

export default function MenuPage() {
  const { cart, addToCart, updateCartQuantity, removeFromCart, cartItemCount } =
    useCart();
  const { orderNotes, setOrderNotes } = useCheckout(cart);

  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {},
  );
  const [modalProductName, setModalProductName] = useState<string | null>(null);
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  const modalProduct = modalProductName
    ? getCatalogProduct(modalProductName) ?? null
    : null;

  const showFloatingCartButton =
    cartItemCount > 0 && !isBasketOpen && !modalProductName;

  function openBasketDrawer() {
    setModalProductName(null);
    setIsBasketOpen(true);
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

  return (
    <main
      className={`min-h-screen bg-[#fff8ed] text-[#2f5d2f] ${showFloatingCartButton ? "pb-20 sm:pb-24" : ""}`}
    >
      <MenuHeader cart={cart} onViewBasket={openBasketDrawer} />

      <section className="border-b border-[#8b451f]/10 bg-white px-5 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4af37] sm:text-sm">
            Pedidos
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#2f5d2f] sm:text-4xl">
            Cardápio da Roça
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#8b451f]/80 sm:text-lg">
            Escolha seus trem bão e monte sua cestinha.
          </p>
        </div>
      </section>

      <section className="px-5 py-10 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-14 sm:space-y-20">
            {productCategories.map((category) => (
              <div key={category.title}>
                <h2 className="mb-6 flex items-center gap-3 font-serif text-2xl font-bold text-[#2f5d2f] sm:text-3xl">
                  <span aria-hidden="true">{category.emoji}</span>
                  {category.title}
                </h2>

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

      <Toaster position="top-center" richColors closeButton />

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
            selectedVariants,
          )}
          selectedSize={getSelectedSize(
            modalProduct.name,
            modalProduct.sizes,
            selectedSizes,
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

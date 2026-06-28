"use client";

import Image from "next/image";
import { IMAGES } from "@/branding/assets";
import { flavorShowcase } from "@/data/index";
import { ORDER_STEPS, TESTIMONIALS } from "@/branding/copy";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { LandingHeader } from "@/components/layout/landing-header";
import { LogoImage } from "@/components/layout/logo-image";
import { SectionHeading } from "@/components/layout/section-heading";
import { SiteFooter } from "@/components/layout/site-footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8ed] text-[#2f5d2f]">
      <LandingHeader />

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
              href="/menu"
              className="inline-flex items-center rounded-full bg-[#2f5d2f] px-12 py-5 text-lg font-bold text-white shadow-lg shadow-[#2f5d2f]/30 transition hover:bg-[#264d26] hover:shadow-xl active:scale-[0.98] sm:px-14 sm:py-6 sm:text-xl"
            >
              Ver Cardápio
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

      {/* ── Seção 3: Sabores ── */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Gelato"
            title="Sabores"
            description="Descubra as combinações que fazem nosso gelato artesanal tão especial."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {flavorShowcase.map((flavor) => (
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

      {/* ── Seção 4: Como Pedir ── */}
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
            {ORDER_STEPS.map((step, index) => (
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

          <div className="mt-10 text-center">
            <a
              href="/menu"
              className="inline-flex items-center rounded-full bg-[#fff8ed] px-8 py-4 text-base font-semibold text-[#2f5d2f] shadow-md transition hover:bg-white active:scale-[0.98]"
            >
              Ver Cardápio
            </a>
          </div>
        </div>
      </section>

      {/* ── Seção 5: Depoimentos ── */}
      <section id="depoimentos" className="scroll-mt-20 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Clientes"
            title="Depoimentos"
            description="O que dizem quem já experimentou nossos sabores."
          />

          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((item) => (
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

      {/* ── Seção 6: CTA Final ── */}
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
            Monte sua cestinha no cardápio e finalize pelo WhatsApp quando
            estiver pronto.
          </p>
          <a
            href="/menu"
            className="mt-10 inline-flex items-center rounded-full bg-[#2f5d2f] px-10 py-5 text-base font-semibold text-[#fff8ed] shadow-lg shadow-[#2f5d2f]/20 transition hover:bg-[#264d26] hover:shadow-xl active:scale-[0.98]"
          >
            Montar minha Cestinha
          </a>
        </div>
      </section>

      <SiteFooter />

      <FloatingWhatsApp />
    </main>
  );
}

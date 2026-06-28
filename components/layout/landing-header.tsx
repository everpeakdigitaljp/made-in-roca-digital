import { NAV_LINKS } from "@/branding/copy";
import { Button } from "@/components/ui/button";
import { LogoImage } from "./logo-image";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#8b451f]/10 bg-[#fff8ed]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:h-[4.5rem] sm:gap-6">
        <a
          href="/"
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

        <Button asChild size="sm" className="shrink-0">
          <a href="/menu">Ver Cardápio</a>
        </Button>
      </div>
    </header>
  );
}

import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_DOUBT_LINK,
} from "@/branding/assets";
import { InstagramIcon, WhatsAppIcon } from "./icons";
import { LogoImage } from "./logo-image";

export function SiteFooter() {
  return (
    <footer
      id="contato"
      className="scroll-mt-20 border-t border-[#fff8ed]/10 bg-[#2f5d2f] px-5 py-12 text-[#fff8ed]"
    >
      <div className="mx-auto max-w-6xl text-center">
        <LogoImage size="sm" className="mx-auto" />

        <p className="mt-5 font-serif text-xl font-bold">Made in Roça</p>
        <p className="mt-1 text-sm text-[#fff8ed]/75">
          Sabores da Fazenda Brasileira
        </p>
        <p className="mt-1 text-sm text-[#fff8ed]/60">Hamamatsu — Japão</p>

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
  );
}

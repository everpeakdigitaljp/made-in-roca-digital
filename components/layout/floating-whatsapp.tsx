import { WHATSAPP_DOUBT_LINK } from "@/branding/assets";
import { WhatsAppIcon } from "./icons";

export function FloatingWhatsApp({ elevated }: { elevated?: boolean }) {
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

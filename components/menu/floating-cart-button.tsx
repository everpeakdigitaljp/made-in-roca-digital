import { Button } from "@/components/ui/button";

export function FloatingCartButton({ onOpen }: { onOpen: () => void }) {
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

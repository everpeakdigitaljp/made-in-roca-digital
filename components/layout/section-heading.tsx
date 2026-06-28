export function SectionHeading({
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

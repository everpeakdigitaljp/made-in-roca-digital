import Image from "next/image";
import { IMAGES } from "@/branding/assets";

export function LogoImage({
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

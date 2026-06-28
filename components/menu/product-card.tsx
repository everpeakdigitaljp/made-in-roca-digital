import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  getStartingPrice,
  type ProductSizeOption,
  type ProductVariant,
} from "@/features/product";
import { formatYen } from "@/lib/currency";

export function ProductCard({
  name,
  image,
  description,
  variants,
  sizes,
  onOpenOptions,
}: {
  name: string;
  image: string;
  description: string;
  variants: readonly ProductVariant[];
  sizes: readonly ProductSizeOption[];
  onOpenOptions: () => void;
}) {
  const startingPrice = getStartingPrice(variants, sizes);

  return (
    <Card className="group transition duration-300 hover:border-accent/30 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-background sm:aspect-[16/10]">
        <Image
          src={image}
          alt={name}
          width={960}
          height={600}
          className="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
      </div>

      <CardContent className="space-y-4">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>

        <div className="space-y-2.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
              Sabores disponíveis
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {variants.map((variant) => (
                <Badge key={variant.name} variant="outline">
                  {variant.name}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
              Tamanhos disponíveis
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {sizes.map((size) => (
                <Badge key={size.label} variant="muted">
                  {size.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <p className="font-serif text-xl font-bold text-foreground sm:text-2xl">
          A partir de {formatYen(startingPrice)}
        </p>
      </CardContent>

      <CardFooter className="w-full">
        <Button className="w-full" size="lg" onClick={onOpenOptions}>
          Escolher
        </Button>
      </CardFooter>
    </Card>
  );
}

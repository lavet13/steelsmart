import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { addToCartAtom, cartAtom } from "@/lib/atoms/cart";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [cart] = useAtom(cartAtom);
  console.log({ cart });
  const [, addToCart] = useAtom(addToCartAtom);
  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div
      className={cn(
        "bg-background border rounded-lg shadow-md p-4 relative group",
        className,
      )}
    >
      {product.discount && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs">
          -{product.discount}%
        </div>
      )}

      {(product.isNew || product.isBestseller) && (
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          {product.discount && (
            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">
              -{product.discount}%
            </div>
          )}
          {product.isNew && (
            <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
              Новинка
            </div>
          )}
          {product.isBestseller && (
            <div className="bg-green-500 text-white px-2 py-1 rounded text-xs">
              Хит продаж
            </div>
          )}
        </div>
      )}

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-gray-400 hover:text-red-500 transition-colors">
          <Heart className="h-5 w-5" />
        </button>
      </div>

      <Link
        to={`/product/$slug`}
        params={{ slug: product.slug }}
        className="block"
      >
        <div className="h-48 flex items-center justify-center mb-4">
          <img
            src={
              product.images.find((img) => img.isPrimary)?.url ||
              product.images[0].url
            }
            alt={product.name}
            width={200}
            height={200}
            className="object-contain max-h-full transition-transform group-hover:scale-105"
          />
        </div>

        <h3 className="font-medium text-lg line-clamp-2 h-14">
          {product.name}
        </h3>

        <div className="text-sm text-gray-500 mb-2">
          {product.brand} {product.model}
        </div>

        {product.cashback && (
          <div className="flex items-center mt-2 mb-1">
            <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
              Кэшбэк {product.cashback} ₽
            </div>
          </div>
        )}
      </Link>

      <div className="flex justify-between items-center mt-4">
        <div>
          <div className="font-bold text-xl">
            {product.price.toLocaleString()} ₽
          </div>
          {product.oldPrice && (
            <div className="text-gray-400 line-through text-sm">
              {product.oldPrice.toLocaleString()} ₽
            </div>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          className="bg-orange-500 dark:text-foreground hover:bg-orange-600"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />В корзину
        </Button>
      </div>
    </div>
  );
}

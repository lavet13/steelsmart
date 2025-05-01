import { getProductBySlug, getRelatedProducts } from "@/__DATA__";
import ProductCard from "@/components/product-card";
import ProductNotFound from "@/components/product-not-found";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addToCartAtom, cartAtom } from "@/lib/atoms/cart";
import {
  createFileRoute,
  Link,
  notFound,
  useLoaderData,
} from "@tanstack/react-router";
import { useAtom } from "jotai";
import { ChevronRight, Heart, RotateCcw, Shield, ShoppingCart, Star, Truck } from "lucide-react";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;
    const product = getProductBySlug(slug);

    if (!product) {
      throw notFound();
    }

    const relatedProducts = getRelatedProducts(product, 4);

    return { product, relatedProducts };
  },
  component: ProductComponent,
  notFoundComponent: () => {
    return <ProductNotFound />;
  },
});

function ProductComponent() {
  const [,addToCart] = useAtom(addToCartAtom);

  const { product, relatedProducts } = useLoaderData({ from: "/product/$slug" });
  console.log({ product, relatedProducts });

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="flex-1 mt-2 container mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-orange-500">
          Главная
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link
          to={`/category/$slug`}
          params={{ slug: product.category }}
          className="hover:text-orange-500"
        >
          {product.category === "smartphones"
            ? "Смартфоны и часы"
            : product.category === "components"
              ? "Комплектующие"
              : product.category === "gaming"
                ? "Игры и консоли"
                : product.category === "monitors"
                  ? "Мониторы"
                  : product.category}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-muted-foreground">{product.name}</span>
      </div>

      {/* Product details */}
      <div className="bg-background rounded-lg border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product images */}
          <div className="lg:col-span-1">
            <div className="mb-4 border rounded-lg p-4 flex items-center justify-center h-80">
              <img
                src={
                  product.images.find((img) => img.isPrimary)?.url ||
                  product.images[0].url
                }
                alt={product.name}
                width={300}
                height={300}
                className="object-contain max-h-full"
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  className="border rounded-md p-2 flex-shrink-0"
                >
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    width={60}
                    height={60}
                    className="object-contain w-14 h-14"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:col-span-1">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {product.rating} ({product.reviewCount} отзывов)
              </span>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              <p>Артикул: {product.sku}</p>
              <p>Бренд: {product.brand}</p>
              <p>Модель: {product.model}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Краткое описание:</h3>
              <p className="text-muted-foreground">
                {product.shortDescription ||
                  product.description.substring(0, 150) + "..."}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {product.features &&
                product.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full dark:bg-green-300 bg-green-100 flex items-center justify-center mr-2">
                      <span className="text-green-600 dark:text-green-900 text-xs">✓</span>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
            </div>

            <Link
              to="."
              hash="#specifications"
              className="text-orange-500 hover:underline text-sm"
            >
              Все характеристики
            </Link>
          </div>

          {/* Purchase info */}
          <div className="lg:col-span-1 border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-3xl">
                  {product.price.toLocaleString()} ₽
                </div>
                {product.oldPrice && (
                  <div className="text-gray-400 line-through text-sm">
                    {product.oldPrice.toLocaleString()} ₽
                  </div>
                )}
              </div>

              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="h-6 w-6" />
              </button>
            </div>

            {product.cashback && (
              <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded text-sm mb-4">
                Кэшбэк {product.cashback} ₽
              </div>
            )}

            <div className="flex items-center text-sm text-green-600 mb-6">
              <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>В
              наличии: {product.stock} шт.
            </div>

            <div className="space-y-3 mb-6">
              <Button onClick={handleAddToCart} className="w-full bg-orange-500 dark:text-foreground hover:bg-orange-600 h-12 text-base">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Добавить в корзину
              </Button>

              <Button variant="outline" className="w-full h-12 text-base">
                Купить в 1 клик
              </Button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start">
                <Truck className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Доставка</p>
                  <p className="text-gray-500">
                    Бесплатно при заказе от 5000 ₽
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Гарантия</p>
                  <p className="text-gray-500">
                    Официальная гарантия производителя
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <RotateCcw className="h-5 w-5 mr-3 text-gray-500" />
                <div>
                  <p className="font-medium">Возврат</p>
                  <p className="text-gray-500">14 дней на возврат товара</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product details tabs */}
      <div className="bg-background rounded-lg border p-6 mb-8">
        <Tabs defaultValue="description">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="specifications" id="specifications">
              Характеристики
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Отзывы
            </TabsTrigger>
            <TabsTrigger value="delivery">Доставка и оплата</TabsTrigger>
          </TabsList>

          <TabsContent
            value="description"
            className="text-foreground leading-relaxed"
          >
            <p>{product.description}</p>

            {product.features && (
              <div className="mt-6">
                <h3 className="font-medium text-lg mb-3">Особенности:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="specifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {product.specifications.map((spec, index) => (
                <div key={index} className="py-2 border-b border-muted flex">
                  <div className="w-1/2 text-muted-foreground">{spec.name}</div>
                  <div className="w-1/2 font-medium">{spec.value}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Отзывы появятся здесь после покупки товара
              </p>
              <Button variant="outline">Написать отзыв</Button>
            </div>
          </TabsContent>

          <TabsContent value="delivery">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Доставка</h3>
                <p className="text-muted-foreground">
                  Мы предлагаем различные способы доставки: курьерская доставка,
                  самовывоз из магазина или пункта выдачи. Стоимость и сроки
                  доставки зависят от выбранного способа и вашего региона.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-2">Оплата</h3>
                <p className="text-muted-foreground">
                  Вы можете оплатить заказ следующими способами:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                  <li>Наличными при получении</li>
                  <li>Банковской картой при получении</li>
                  <li>Банковской картой онлайн</li>
                  <li>Через электронные платежные системы</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Похожие товары</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

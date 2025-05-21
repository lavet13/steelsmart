import { getBestsellers, getNewProducts } from "@/__DATA__";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const bestsellers = getBestsellers(1);
  const dealOfTheDay = bestsellers.length > 0 ? bestsellers[0] : null;

  const newProducts = getNewProducts(3);

  return (
    <div className="flex-1 mt-2 container mx-auto">
      {/* Hero banner */}
      <section className="py-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 relative rounded-lg overflow-hidden group">
              <div className="bg-orange-100 dark:bg-card rounded-lg p-8 flex">
                <div className="w-1/2 pr-4">
                  <h2 className="text-4xl font-bold mb-6">
                    Гидрогелевая защитная пленка
                  </h2>
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <span className="font-medium">
                        - Полная защита от ударов, падений и царапин
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium">
                        - Мелкие царапины самовосстанавливаются
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium">
                        - Высокая чувствительность к касаниям
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium">
                        - Устойчивость к загрязнениям
                      </span>
                    </li>
                  </ul>
                  <p className="mt-6 text-sm">
                    Найдите лучшую защиту для вашего устройства в наших
                    магазинах
                  </p>
                </div>
                <div className="w-1/2 relative">
                  <img
                    src="/placeholder.svg?height=400&width=400"
                    alt="Демонстрация защитной пленки"
                    width={400}
                    height={400}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {dealOfTheDay && (
              <div className="bg-background rounded-lg shadow-md p-4 relative">
                <div className="absolute top-4 right-4">
                  <Heart className="h-6 w-6 text-muted-foreground hover:text-red-500 cursor-pointer" />
                </div>
                <div className="bg-orange-500 text-white px-3 py-1 rounded absolute top-4 left-4">
                  Предложение дня
                </div>
                <div className="pt-10 pb-4 flex justify-center">
                  <img
                    src={
                      dealOfTheDay.images.find((img) => img.isPrimary)?.url ||
                      dealOfTheDay.images[0].url
                    }
                    alt={dealOfTheDay.name}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <h3 className="font-medium text-lg">{dealOfTheDay.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {dealOfTheDay.brand} {dealOfTheDay.model}
                </p>

                {dealOfTheDay.cashback && (
                  <div className="flex items-center mt-2 mb-1">
                    <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                      Кэшбэк {dealOfTheDay.cashback} ₽
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <div className="font-bold text-xl">
                      {dealOfTheDay.price.toLocaleString()} ₽
                    </div>
                    {dealOfTheDay.oldPrice && (
                      <div className="text-gray-400 line-through text-sm">
                        {dealOfTheDay.oldPrice.toLocaleString()} ₽
                      </div>
                    )}
                  </div>
                  <Link to={'/product/$slug'} params={{ slug: dealOfTheDay.slug }}>
                    <Button className="bg-orange-500 dark:text-foreground hover:bg-orange-600">
                      Купить
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Новинки</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newProducts.map((product) => (
              <Link
                key={product.id}
                to={'/product/$slug'}
                params={{ slug: product.slug }}
                className="group"
              >
                <div className="bg-background rounded-lg shadow-md p-4 h-full transition-transform group-hover:scale-[1.02]">
                  <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs inline-block mb-3">
                    Новинка
                  </div>
                  <div className="h-40 flex items-center justify-center mb-3">
                    <img
                      src={
                        product.images.find((img) => img.isPrimary)?.url ||
                        product.images[0].url
                      }
                      alt={product.name}
                      className="object-cover w-[150px] h-[150px]"
                    />
                  </div>
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="font-bold text-xl">
                      {product.price.toLocaleString()} ₽
                    </div>
                    {product.oldPrice && (
                      <div className="text-gray-400 line-through text-sm">
                        {product.oldPrice.toLocaleString()} ₽
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

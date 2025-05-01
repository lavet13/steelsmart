import { categoryNames, getProductsByCategory } from "@/__DATA__";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { NumericFormat } from "react-number-format";
import { sleep } from "@/utils/sleep";
import {
  createFileRoute,
  notFound,
  useLoaderData,
} from "@tanstack/react-router";
import { atom, useAtom } from "jotai";
import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";

const minPriceAtom = atom<number | undefined>(0);
const maxPriceAtom = atom<number | undefined>(0);

export const Route = createFileRoute("/category/$slug")({
  async loader({ params }) {
    const { slug } = params;

    const categoryProducts = getProductsByCategory(slug);

    if (categoryProducts.length === 0) {
      throw notFound();
    }

    return { categoryProducts };
  },
  component: CategoryComponent,
  notFoundComponent: () => {
    return <div className=""></div>;
  },
});

function CategoryComponent() {
  const { slug } = Route.useParams();
  const { categoryProducts } = useLoaderData({ from: "/category/$slug" });
  const categoryName = categoryNames[slug] || "Категория не найдена";

  const [minPrice, setMinPrice] = useAtom(minPriceAtom);
  const [maxPrice, setMaxPrice] = useAtom(maxPriceAtom);

  useEffect(() => {
    const prices = categoryProducts.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setMinPrice(min);
    setMaxPrice(max);
  }, [slug]);

  return (
    <div className="flex-1 container mx-auto">
      <div className="flex flex-col items-start mb-6 mt-3">
        <h1 className="text-2xl font-bold">{categoryName}</h1>
        <div className="text-sm text-gray-500">
          Найдено {categoryProducts.length} товаров
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-background rounded-lg border shadow-md p-4 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Фильтры
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-500 hover:text-orange-600"
              >
                Сбросить
              </Button>
            </div>

            {/* Price filter */}
            <div className="border-t pt-4 pb-2">
              <h3 className="font-medium mb-3">Цена, ₽</h3>
              <div className="flex justify-between mb-2">
                <NumericFormat
                  customInput={Input}
                  type="tel"
                  placeholder="от"
                  className="w-[45%] border rounded-md px-2 py-1"
                  allowNegative={false}
                  decimalScale={0}
                  suffix=" ₽"
                  value={minPrice}
                  onValueChange={(values) =>
                    setMinPrice(values.floatValue)
                  }
                />
                <NumericFormat
                  customInput={Input}
                  type="tel"
                  placeholder="до"
                  className="w-[45%] border rounded-md px-2 py-1"
                  allowNegative={false}
                  decimalScale={0}
                  suffix=" ₽"
                  value={maxPrice}
                  onValueChange={(values) =>
                    setMaxPrice(values.floatValue)
                  }
                />
              </div>
            </div>

            {/* Brand filter */}
            <div className="border-t pt-4 pb-2">
              <h3 className="font-medium mb-3">Бренд</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {[
                  "Samsung",
                  "Apple",
                  "Xiaomi",
                  "ASUS",
                  "Sony",
                  "LG",
                  "Huawei",
                ].map((brand) => (
                  <div key={brand} className="flex items-center">
                    <Checkbox className="data-[state=checked]:border-orange-500 dark:data-[state=checked]:text-foreground dark:data-[state=checked]:bg-orange-500 data-[state=checked]:bg-orange-500" id={`brand-${brand}`} />
                    <Label htmlFor={`brand-${brand}`} className="ml-2 text-sm">
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability filter */}
            <div className="border-t pt-4 pb-2">
              <h3 className="font-medium mb-3">Наличие</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox className="data-[state=checked]:border-orange-500 dark:data-[state=checked]:text-foreground dark:data-[state=checked]:bg-orange-500 data-[state=checked]:bg-orange-500" id="in-stock" defaultChecked />
                  <Label htmlFor="in-stock" className="ml-2 text-sm">
                    В наличии
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="data-[state=checked]:border-orange-500 dark:data-[state=checked]:text-foreground dark:data-[state=checked]:bg-orange-500 data-[state=checked]:bg-orange-500" id="out-of-stock" />
                  <Label htmlFor="out-of-stock" className="ml-2 text-sm">
                    Под заказ
                  </Label>
                </div>
              </div>
            </div>

            {/* Apply filters button */}
            <div className="mt-4">
              <Button className="w-full dark:text-foreground bg-orange-500 hover:bg-orange-600">
                Применить
              </Button>
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="lg:col-span-3">
          {/* Sorting options */}
          <div className="bg-background rounded-lg shadow-sm p-4 mb-6 flex items-center">
            <div className="flex items-center">
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              <span className="mr-2">Сортировать:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="text-sm">
                По популярности
              </Button>
              <Button variant="outline" size="sm" className="text-sm">
                По цене <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="outline" size="sm" className="text-sm">
                По рейтингу
              </Button>
              <Button variant="outline" size="sm" className="text-sm">
                По скидке
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

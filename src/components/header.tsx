import { Link } from "@tanstack/react-router";
import { ShoppingCart, Heart, User } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useAtom } from "jotai";
import { cartAtom } from "@/lib/atoms/cart";

export default function Header() {
  const [cart] = useAtom(cartAtom);

  const cartItemsCount = cart.totalItems;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-dashed">
        <div className="container mx-auto flex items-center justify-between h-14 px-2">
          <Link
            activeOptions={{ exact: true }}
            to="/"
            className="flex items-center"
          >
            <div className="mr-2">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
            </div>
            <div>
              <span className="font-bold text-xl">ТехСмарт</span>
              <p className="text-xs text-gray-500">
                цифровая и бытовая электроника
              </p>
            </div>
          </Link>

          <div className="text-right ml-auto mr-4">
            <div className="text-gray-500 text-sm">Интернет-магазин</div>
            <div className="font-medium">c 9:00 до 21:00</div>
          </div>

          <div className="mx-2">
            <ModeToggle />
          </div>

          <div className="flex items-center space-x-2">
            <Link to="." hash="#" className="flex items-center">
              <div className="text-orange-500 font-bold text-xl">360</div>
            </Link>
            <Link to="." hash="#" className="p-2">
              <User className="h-6 w-6" />
            </Link>
            <Link to="." hash="#" className="p-2">
              <Heart className="h-6 w-6" />
            </Link>
            <Link to="/cart" className="p-2 relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            </Link>
          </div>
        </div>
      </header>
      {/* Category navigation */}
      <nav className="bg-muted py-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center overflow-x-auto hide-scrollbar">
            <Link
              to="/category/$slug"
              params={{ slug: "smartphones" }}
              className="flex flex-col items-center group whitespace-nowrap px-2"
            >
              <span className="text-sm">Смартфоны и часы</span>
            </Link>
            <Link
              to="/category/$slug"
              params={{ slug: "tablets" }}
              className="flex flex-col items-center group whitespace-nowrap px-2"
            >
              <span className="text-sm">Планшеты</span>
            </Link>
            <Link
              to="/category/$slug"
              params={{ slug: "laptops" }}
              className="flex flex-col items-center group whitespace-nowrap px-2"
            >
              <span className="text-sm">Ноутбуки</span>
            </Link>
            <Link
              to="/category/$slug"
              params={{ slug: "components" }}
              className="flex flex-col items-center group whitespace-nowrap px-2"
            >
              <span className="text-sm">Комплектующие</span>
            </Link>
            <Link
              to="/category/$slug"
              params={{ slug: 'tvs' }}
              className="flex flex-col items-center group whitespace-nowrap px-2"
            >
              <span className="text-sm">Телевизоры</span>
            </Link>
            <Link
              to="/category/$slug"
              params={{ slug: 'peripherals' }}
              className="flex flex-col items-center group whitespace-nowrap px-2"
            >
              <span className="text-sm">Периферия</span>
            </Link>
            <Link
              to="/category/$slug"
              params={{ slug: 'appliances' }}
              className="flex flex-col items-center group whitespace-nowrap px-2"
            >
              <span className="text-sm">Бытовая техника</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

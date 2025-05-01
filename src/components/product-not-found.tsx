import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { Button } from "@/components/ui/button";

const ProductNotFound: FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-orange-600 text-5xl lg:text-6xl font-bold">Упс!</h1>
      <p
        className={
          "text-center text-muted-foreground leading-7 [&:not(:first-child)]:mt-6"
        }
      >
        Такого товара нет
      </p>
      <Button
        className="mt-8 bg-orange-500 dark:text-foreground hover:bg-orange-500/90"
        asChild
      >
        <Link to="..">Вернуться назад</Link>
      </Button>
    </div>
  );
};

export default ProductNotFound;

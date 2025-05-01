import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { FC } from "react";

const DefaultNotFoundComponent: FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-orange-600 text-5xl lg:text-6xl font-bold">404</h1>
      <p
        className={
          "text-center text-muted-foreground leading-7 [&:not(:first-child)]:mt-6"
        }
      >
        Похоже, вы забрели в неизведанные цифровые просторы.
      </p>
      <Button
        className="mt-8 bg-orange-500 dark:text-foreground hover:bg-orange-500/90"
        asChild
      >
        <Link to="/">Вернуться на сайт</Link>
      </Button>
    </div>
  );
};

export default DefaultNotFoundComponent;

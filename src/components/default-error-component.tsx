import { Button } from "@/components/ui/button";
import { ErrorRouteComponent, Link, useRouter } from "@tanstack/react-router";

const DefaultErrorComponent: ErrorRouteComponent = ({ error, reset }) => {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-orange-600 text-5xl lg:text-6xl font-bold">Ошибка</h1>
      <p
        className={
          "text-center text-muted-foreground leading-7 [&:not(:first-child)]:mt-6"
        }
      >
        Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.
      </p>
      {error && (
        <p className="text-center text-sm text-gray-500 mt-2">
          {error.message || "Неизвестная ошибка"}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button
          onClick={() => {
            router.invalidate();
          }}
        >
          Попробовать снова
        </Button>
        <Button
          className="bg-orange-500 dark:text-foreground hover:bg-orange-500/90"
          asChild
        >
          <Link to="/">Вернуться на сайт</Link>
        </Button>
      </div>
    </div>
  );
};

export default DefaultErrorComponent;

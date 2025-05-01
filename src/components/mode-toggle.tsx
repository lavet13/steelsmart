import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, LaptopIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/atoms/theme";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const activeStyles =
    "text-primary focus:text-primary focus:bg-primary/10 opacity-100";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 shrink-0" variant="ghost" size="icon">
          <SunIcon
            className={cn(
              "size-5 -rotate-120 scale-0 transition-all",
              theme === "light" && "rotate-0 scale-100",
            )}
          />
          <MoonIcon
            className={cn(
              "size-5 absolute h-[1.2rem] w-[1.2rem] -rotate-120 scale-0 transition-all",
              theme === "dark" && "rotate-0 scale-100",
            )}
          />
          <LaptopIcon
            className={cn(
              "size-5 absolute h-[1.2rem] w-[1.2rem] -rotate-120 scale-0 transition-all",
              theme === "system" && "rotate-0 scale-100",
            )}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem
          className={cn(
            "transition-none",
            theme === "light" ? activeStyles : "opacity-40",
          )}
          onClick={() => setTheme("light")}
        >
          <SunIcon className="mr-2 size-4" /> Светлая
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "transition-none",
            theme === "dark" ? activeStyles : "opacity-40",
          )}
          onClick={() => setTheme("dark")}
        >
          <MoonIcon className="mr-2 size-4" /> Темная
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            "transition-none",
            theme === "system" ? activeStyles : "opacity-40",
          )}
          onClick={() => setTheme("system")}
        >
          <LaptopIcon className="mr-2 size-4" /> Системная
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "~/stores/theme-store";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="
        h-16 px-8
        bg-background/80 dark:bg-dark-secondary/50
        border-2 dark:border-[#1E293B]
        hover:bg-accent hover:scale-[1.02]
        dark:hover:bg-dark-secondary
        transition-all duration-200
        rounded-xl
        flex items-center gap-4
        text-slate-700 dark:text-white
      "
    >
      {theme === "light" ? (
        <>
          <Moon className="h-8 w-8 text-indigo-400" />
          <span className="text-lg font-medium">Escuro</span>
        </>
      ) : (
        <>
          <Sun className="h-8 w-8 text-yellow-400" />
          <span className="text-lg font-medium">Claro</span>
        </>
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
} 
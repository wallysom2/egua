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
        h-12 w-12
        bg-background/80 dark:bg-dark-secondary/50
        border-2 dark:border-[#1E293B]
        hover:bg-accent hover:scale-[1.02]
        dark:hover:bg-dark-secondary
        transition-all duration-200
        rounded-xl
      "
    >
      {theme === "light" ? (
        <Moon className="h-6 w-6 text-indigo-400" />
      ) : (
        <Sun className="h-6 w-6 text-amber-500" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
} 
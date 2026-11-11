"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getThemeIcon = () => {
    if (!mounted) {
      return <Sun className="h-4 w-4 text-muted-foreground opacity-60" />;
    }
    if (theme === "system") return <Monitor className="h-4 w-4" />;
    return theme === "dark" ? (
      <Moon className="h-4 w-4 text-cyan-400" />
    ) : (
      <Sun className="h-4 w-4 text-amber-500" />
    );
  };

  const getThemeLabel = () => {
    if (!mounted) return "Theme";
    if (theme === "system") return "System theme";
    return theme === "dark" ? "Dark theme" : "Light theme";
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-lg border border-border/60 hover:border-border hover:bg-muted/80 transition-colors cursor-pointer"
      title={`Current: ${getThemeLabel()}. Click to switch theme.`}
    >
      {getThemeIcon()}
      <span className="sr-only">Toggle theme (current: {getThemeLabel()})</span>
    </Button>
  );
}

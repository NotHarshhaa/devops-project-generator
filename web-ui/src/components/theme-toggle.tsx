"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    if (theme === "system") {
      return <Monitor className="h-4 w-4" />;
    }
    return theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  };

  const getThemeLabel = () => {
    if (theme === "system") {
      return "System theme";
    }
    return theme === "dark" ? "Dark theme" : "Light theme";
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
      title={`Current: ${getThemeLabel()}. Click to cycle themes.`}
    >
      {getThemeIcon()}
      <span className="sr-only">Toggle theme (current: {getThemeLabel()})</span>
    </Button>
  );
}

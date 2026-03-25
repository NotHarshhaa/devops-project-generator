"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!mounted) {
      return <div className="h-4 w-4" />;
    }
    if (theme === "system") {
      return <Monitor className="h-4 w-4" />;
    }
    return theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  };

  const getThemeLabel = () => {
    if (!mounted) {
      return "Loading theme...";
    }
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
      title={mounted ? `Current: ${getThemeLabel()}. Click to cycle themes.` : "Loading theme..."}
    >
      {getThemeIcon()}
      <span className="sr-only">Toggle theme (current: {mounted ? getThemeLabel() : "Loading..."})</span>
    </Button>
  );
}

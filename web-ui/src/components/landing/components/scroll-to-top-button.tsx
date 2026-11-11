"use client";

import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollToTopButtonProps {
  visible: boolean;
  onClick: () => void;
}

export function ScrollToTopButton({ visible, onClick }: ScrollToTopButtonProps) {
  if (!visible) return null;

  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed bottom-6 right-6 h-10 w-10 rounded-full border border-border/80 bg-card/95 text-foreground hover:bg-muted shadow-lg shadow-black/10 dark:shadow-black/30 transition-all z-50 cursor-pointer backdrop-blur-sm"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-4 w-4" strokeWidth={2} />
    </Button>
  );
}

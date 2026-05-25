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
      size="sm"
      className="fixed bottom-8 right-8 h-11 w-11 rounded-full shadow-lg bg-brand hover:bg-brand/90 text-brand-foreground transition-all duration-300 z-50 brand-glow"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-4 w-4" />
    </Button>
  );
}

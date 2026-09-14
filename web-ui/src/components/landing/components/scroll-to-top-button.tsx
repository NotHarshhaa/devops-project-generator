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
      className="fixed bottom-6 right-6 h-10 w-10 rounded-none border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-colors duration-100 z-50 shadow-none cursor-pointer"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-4 w-4" strokeWidth={1.5} />
    </Button>
  );
}

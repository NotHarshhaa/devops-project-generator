import { Rocket, Github } from "lucide-react";
import { ThemeToggle } from "@/components";
import { Button } from "@/components/ui/button";
import { APP_VERSION, GITHUB_REPO } from "../data/landing-content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass-panel !rounded-none !shadow-none">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80 min-w-0 group">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground brand-glow">
            <Rocket className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold leading-none tracking-tight truncate">
              DevOps Project Generator
            </span>
            <span className="text-[10px] text-muted-foreground font-mono leading-tight">{APP_VERSION}</span>
          </div>
        </a>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5 border-border/80 hidden sm:flex">
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
              <Github className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>
          <Button asChild size="sm" className="gap-1.5 bg-brand hover:bg-brand/90 text-brand-foreground sm:hidden">
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
              <Github className="h-3.5 w-3.5" />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

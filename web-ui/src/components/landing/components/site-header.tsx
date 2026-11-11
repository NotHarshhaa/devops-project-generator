import Link from "next/link";
import { Rocket, Github } from "lucide-react";
import { ThemeToggle } from "@/components";
import { Button } from "@/components/ui/button";
import { APP_VERSION, GITHUB_REPO } from "../data/landing-content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md w-full max-w-full overflow-hidden">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 w-full">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
            <Rocket className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-bold leading-none tracking-tight text-foreground truncate">
              DEVOPS ARCHITECT
            </span>
            <span className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase mt-1 truncate">
              {APP_VERSION} · MANIFEST GENERATOR
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-wide">
          <a
            href="#generator-section"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Workspace
          </a>
          <a
            href="#features-section"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#output-section"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Specification
          </a>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Repository
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="hidden sm:flex gap-2 rounded-lg">
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </Button>
          <Button asChild variant="outline" size="icon-sm" className="sm:hidden rounded-lg">
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

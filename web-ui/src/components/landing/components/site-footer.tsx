import { Heart, ExternalLink, Rocket } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { APP_VERSION, GITHUB_REPO } from "../data/landing-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 border border-brand/20">
              <Rocket className="h-4 w-4 text-brand" />
            </div>
            <div>
              <p className="text-xs font-semibold">DevOps Project Generator</p>
              <p className="text-[10px] text-muted-foreground font-mono">{APP_VERSION} · MIT License</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>by</span>
            <a
              href="https://github.com/NotHarshhaa"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-brand transition-colors inline-flex items-center gap-1"
            >
              Harshhaa
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-muted-foreground">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand transition-colors"
            >
              Source Code
            </a>
            <Separator orientation="vertical" className="h-3" />
            <a
              href="https://t.me/prodevopsguy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand transition-colors"
            >
              Community
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

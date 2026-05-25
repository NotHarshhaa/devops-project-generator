import { Heart, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { GITHUB_REPO } from "../data/landing-content";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>by</span>
            <a
              href="https://github.com/NotHarshhaa"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline inline-flex items-center gap-1"
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
              className="hover:text-foreground transition-colors"
            >
              Source Code
            </a>
            <Separator orientation="vertical" className="h-3" />
            <a
              href="https://t.me/prodevopsguy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Community
            </a>
            <Separator orientation="vertical" className="h-3" />
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { ExternalLink, Rocket } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { APP_VERSION, GITHUB_REPO } from "../data/landing-content";

export function SiteFooter() {
  return (
    <footer className="border-t-4 border-foreground bg-background w-full max-w-full overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-foreground/15">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border border-foreground bg-foreground text-background">
              <Rocket className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-display font-bold text-sm tracking-wide">
                DEVOPS PROJECT ARCHITECT
              </p>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">
                {APP_VERSION} · OPEN SOURCE / MIT LICENSE
              </p>
            </div>
          </div>

          <div className="font-serif text-xs text-foreground/80 text-center md:text-right">
            <span>An open-source architecture utility authored by </span>
            <a
              href="https://github.com/NotHarshhaa"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline underline-offset-4 hover:opacity-70 inline-flex items-center gap-1"
            >
              Harshhaa
              <ExternalLink className="h-2.5 w-2.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <p>© {new Date().getFullYear()} ALL REPOSITORIES LICENSED UNDER MIT</p>
          <div className="flex items-center gap-4">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline-offset-4 hover:underline transition-colors"
            >
              Source Code
            </a>
            <Separator orientation="vertical" className="h-3 bg-foreground/20" />
            <a
              href="https://t.me/prodevopsguy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline-offset-4 hover:underline transition-colors"
            >
              Community
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

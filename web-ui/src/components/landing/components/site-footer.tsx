import { ExternalLink, Rocket } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { APP_VERSION, GITHUB_REPO } from "../data/landing-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-background/95 w-full max-w-full overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 w-full pb-20 sm:pb-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-sm">
              <Rocket className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-sm tracking-wide text-foreground">
                DEVOPS PROJECT ARCHITECT
              </p>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase mt-0.5">
                {APP_VERSION} · OPEN SOURCE / MIT LICENSE
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center md:text-right">
            <span>An open-source architecture utility authored by </span>
            <a
              href="https://github.com/NotHarshhaa"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground underline underline-offset-4 hover:text-brand inline-flex items-center gap-1 transition-colors"
            >
              Harshhaa
              <ExternalLink className="h-2.5 w-2.5" strokeWidth={2} />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground pr-0 sm:pr-14">
          <p>© {new Date().getFullYear()} ALL REPOSITORIES LICENSED UNDER MIT</p>
          <div className="flex items-center gap-4">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Source Code
            </a>
            <Separator orientation="vertical" className="h-3 bg-border" />
            <a
              href="https://t.me/prodevopsguy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Community
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

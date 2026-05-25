import { Rocket, Github, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GITHUB_REPO } from "../data/landing-content";

export function CtaSection() {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/10 via-card to-cyan-500/5 p-8 sm:p-14 text-center brand-glow">
        <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

        <div className="relative">
          <div className="flex justify-center mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/15 border border-brand/30">
              <Rocket className="h-7 w-7 text-brand" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-brand" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              Ready to scaffold your project?
            </h2>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-8">
            Configure your stack above and download a complete DevOps project in just a few clicks.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gap-2 px-8 bg-brand hover:bg-brand/90 text-brand-foreground shadow-lg shadow-brand/20">
              <a href="#top">
                <ArrowRight className="h-4 w-4" />
                Start Generating
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 px-8 border-border/80">
              <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

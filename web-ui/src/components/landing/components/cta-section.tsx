import { Rocket, Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GITHUB_REPO } from "../data/landing-content";

export function CtaSection() {
  return (
    <section className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-primary/5 p-8 sm:p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 brand-glow">
            <Rocket className="h-7 w-7 text-brand" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-3">
          Ready to scaffold your project?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-6">
          Go back up and configure your stack. Your complete DevOps project is just a few clicks away.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="gap-2 px-6 bg-brand hover:bg-brand/90 text-brand-foreground">
            <a href="#top">
              <ArrowRight className="h-4 w-4" />
              Start Generating
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 px-6 border-border/80">
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              Star on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

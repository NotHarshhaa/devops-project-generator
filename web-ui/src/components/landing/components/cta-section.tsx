import { Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GITHUB_REPO } from "../data/landing-content";

export function CtaSection() {
  return (
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
      <div className="relative border-4 border-foreground bg-foreground text-background p-8 sm:p-16 lg:p-20 text-center overflow-hidden">
        {/* Subtle radial white texture */}
        <div className="absolute inset-0 pattern-radial-white pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-background/60 block mb-4">
            [ INITIATE ARCHITECTURE GENERATION ]
          </span>

          <h2 className="font-display font-normal text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-background mb-6">
            Scaffold Without Compromise.
          </h2>

          <p className="font-serif text-base sm:text-lg text-background/80 max-w-xl mx-auto mb-10 leading-relaxed">
            Specify your stack above or clone the repository to inspect the modular generator core.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="gap-3 px-8 h-12 font-mono text-xs uppercase tracking-widest bg-background text-foreground border-2 border-background hover:bg-transparent hover:text-background transition-colors duration-100"
            >
              <a href="#top">
                Start Generating
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-3 px-8 h-12 font-mono text-xs uppercase tracking-widest border-2 border-background text-background bg-transparent hover:bg-background hover:text-foreground transition-colors duration-100"
            >
              <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" strokeWidth={1.5} />
                Star Repository
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GITHUB_REPO } from "../data/landing-content";

export function CtaSection() {
  return (
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 text-white p-8 sm:p-14 lg:p-20 text-center overflow-hidden w-full shadow-2xl">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto w-full">
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold block mb-3">
            START YOUR DEVOPS WORKSPACE
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-4 sm:mb-6">
            Scaffold Without Compromise.
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Specify your stack above or clone the repository to inspect the modular generator core.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center w-full max-w-md mx-auto sm:max-w-none">
            <Button
              asChild
              size="lg"
              className="gap-2.5 px-8 h-12 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/25 rounded-xl transition-all cursor-pointer w-full sm:w-auto"
            >
              <a href="#top">
                Start Generating
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2.5 px-8 h-12 border-slate-700 text-white bg-slate-900/60 hover:bg-slate-800 rounded-xl transition-all cursor-pointer w-full sm:w-auto"
            >
              <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                Star Repository
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

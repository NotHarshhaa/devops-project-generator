"use client";

import { Sparkles, ArrowDown, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HERO_TAGS } from "../data/landing-content";

export function HeroSection() {
  const scrollToGenerator = () => {
    document.getElementById("generator-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="container mx-auto max-w-7xl px-4 pt-10 sm:pt-16 pb-10 sm:pb-12">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="text-center lg:text-left animate-fade-in">
          <Badge
            variant="outline"
            className="mb-5 gap-1.5 px-3 py-1 text-xs border-brand/30 bg-brand/5 text-brand"
          >
            <Sparkles className="h-3 w-3" />
            Production-Ready DevOps Scaffolding
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.12]">
            Build your DevOps stack{" "}
            <span className="text-brand-gradient">in seconds, not hours</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
            Configure CI/CD, infrastructure, deployment, observability, and security — then download a
            complete, production-ready project structure.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-6">
            {HERO_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] font-mono px-2.5 py-1 border border-border/60 bg-background/60"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-8">
            <Button
              size="lg"
              onClick={scrollToGenerator}
              className="gap-2 px-6 bg-brand hover:bg-brand/90 text-brand-foreground shadow-lg shadow-brand/20"
            >
              <Rocket className="h-4 w-4" />
              Start Building
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToGenerator}
              className="gap-2 px-6 border-border/80"
            >
              Explore Tools
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="animate-slide-up">
          <div className="rounded-2xl border border-border/60 overflow-hidden shadow-xl dark:shadow-2xl dark:brand-glow">
            <div className="terminal-panel-header flex items-center gap-2 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-amber-500/70" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground ml-2">stack-preview.yaml</span>
            </div>
            <div className="terminal-panel p-5 sm:p-6 font-mono text-xs sm:text-sm space-y-1.5">
              <p className="text-brand"># your-devops-stack</p>
              <p>
                <span className="terminal-dim">project:</span>{" "}
                <span className="terminal-accent">my-devops-project</span>
              </p>
              <p>
                <span className="terminal-dim">pipeline:</span>{" "}
                <span className="text-foreground/85">github-actions</span>
              </p>
              <p>
                <span className="terminal-dim">ci:</span>{" "}
                <span className="text-foreground/85">github-actions</span>
              </p>
              <p>
                <span className="terminal-dim">infra:</span>{" "}
                <span className="text-foreground/85">terraform</span>
              </p>
              <p>
                <span className="terminal-dim">deploy:</span>{" "}
                <span className="text-foreground/85">docker</span>
              </p>
              <p>
                <span className="terminal-dim">observability:</span>{" "}
                <span className="text-foreground/85">logs-metrics</span>
              </p>
              <p>
                <span className="terminal-dim">security:</span>{" "}
                <span className="text-foreground/85">standard</span>
              </p>
              <p className="text-brand pt-2 animate-pulse">→ ready to generate...</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { value: "8", label: "Config steps" },
              { value: "50+", label: "Files generated" },
              { value: "0", label: "Sign-up required" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl border border-border/60 bg-card/50 p-3 text-center transition-colors hover:border-brand/30"
              >
                <div className="text-xl font-bold font-mono text-brand">{value}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

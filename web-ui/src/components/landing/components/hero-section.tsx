"use client";

import { ArrowRight, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HERO_TAGS } from "../data/landing-content";

export function HeroSection() {
  const scrollToGenerator = () => {
    document.getElementById("generator-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
      {/* Editorial Meta Header */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3 mb-6 pb-3 border-b border-foreground/20 w-full overflow-hidden">
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-muted-foreground truncate max-w-[240px] sm:max-w-none">
          EDITION NO. 02 — ARCHITECTURAL RELEASE
        </span>
        <div className="hidden sm:block h-px flex-1 bg-foreground/10" />
        <Badge variant="outline" className="text-[10px] shrink-0">
          STRICT MONOCHROME
        </Badge>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start w-full">
        {/* Left Column: Dominated by Typography */}
        <div className="lg:col-span-7 flex flex-col min-w-0">
          {/* Bold Choice #1: Oversized Hero Statement */}
          <div className="space-y-1">
            <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
              [ 01 / INFRASTRUCTURE SCAFFOLD ]
            </span>
            <h1 className="font-display font-normal text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-none text-foreground uppercase break-words">
              SCAFFOLD
            </h1>
            <h2 className="font-display italic text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-foreground">
              Production DevOps.
            </h2>
          </div>

          {/* Bold Choice #2: Thick rule with small bordered square punctuation */}
          <div className="flex items-center my-6 sm:my-8 max-w-full">
            <div className="h-1 flex-1 bg-foreground" />
            <div className="w-3.5 h-3.5 border-2 border-foreground bg-background mx-2 shrink-0" />
            <div className="h-1 w-8 sm:w-12 bg-foreground" />
          </div>

          {/* Editorial lead paragraph */}
          <p className="text-sm sm:text-base lg:text-lg text-foreground/80 leading-relaxed font-serif max-w-2xl">
            A disciplined architecture generator for mission-critical infrastructure. Configure CI/CD pipelines,
            cloud orchestration, observability, and compliance topologies—rendered into clean, deployable code in seconds.
          </p>

          {/* Technical Tags */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
            {HERO_TAGS.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest px-2 py-0.5 sm:px-2.5 sm:py-1 border border-foreground/30 bg-muted/40 text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Sharp Primary and Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-8 sm:mt-10">
            <Button
              size="lg"
              onClick={scrollToGenerator}
              className="gap-3 font-mono text-xs uppercase tracking-widest h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto"
            >
              Start Generating
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToGenerator}
              className="gap-3 font-mono text-xs uppercase tracking-widest h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto"
            >
              Examine Architecture
              <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>

        {/* Right Column: Architectural Manifest Box */}
        <div className="lg:col-span-5 pt-2 w-full min-w-0">
          <div className="border-2 border-foreground bg-background w-full overflow-hidden">
            {/* Header with geometric window punctuation */}
            <div className="border-b-2 border-foreground bg-muted px-4 py-2.5 sm:py-3 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 border border-foreground bg-foreground" />
                <div className="w-2.5 h-2.5 border border-foreground bg-background" />
                <div className="w-2.5 h-2.5 border border-foreground bg-muted-foreground/30" />
                <span className="font-bold tracking-wider ml-1 truncate">stack-manifest.yaml</span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest shrink-0">UTF-8</span>
            </div>

            {/* Code Body: Pure Black & White typography */}
            <div className="p-4 sm:p-6 font-mono text-[11px] sm:text-xs space-y-2 leading-relaxed bg-background overflow-x-auto">
              <p className="text-muted-foreground pb-1 whitespace-nowrap"># SPECIFICATION : PRODUCTION SUITE</p>
              <p className="flex justify-between gap-2 border-b border-foreground/10 pb-1 whitespace-nowrap">
                <span className="text-muted-foreground">project_type:</span>
                <span className="font-bold underline underline-offset-2">enterprise-monorepo</span>
              </p>
              <p className="flex justify-between gap-2 border-b border-foreground/10 pb-1 whitespace-nowrap">
                <span className="text-muted-foreground">ci_engine:</span>
                <span>github-actions / parallel</span>
              </p>
              <p className="flex justify-between gap-2 border-b border-foreground/10 pb-1 whitespace-nowrap">
                <span className="text-muted-foreground">infrastructure:</span>
                <span>aws-vpc-eks-terraform</span>
              </p>
              <p className="flex justify-between gap-2 border-b border-foreground/10 pb-1 whitespace-nowrap">
                <span className="text-muted-foreground">deployment:</span>
                <span className="font-bold">blue-green-canary</span>
              </p>
              <p className="flex justify-between gap-2 border-b border-foreground/10 pb-1 whitespace-nowrap">
                <span className="text-muted-foreground">observability:</span>
                <span>prometheus + grafana + otel</span>
              </p>
              <p className="flex justify-between gap-2 border-b border-foreground/10 pb-1 whitespace-nowrap">
                <span className="text-muted-foreground">security_spec:</span>
                <span>nist-csf / trivy / cosign</span>
              </p>
              <div className="pt-2 sm:pt-3 flex items-center justify-between text-[10px] sm:text-[11px] text-foreground font-bold uppercase tracking-widest">
                <span>STATUS: READY</span>
                <span className="animate-pulse">● LIVE COMPILATION</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Inversion Boxes */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
            {[
              { value: "08", label: "STEPS" },
              { value: "50+", label: "MANIFESTS" },
              { value: "100%", label: "LOCAL" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="group border border-foreground bg-background p-2.5 sm:p-4 text-center transition-colors duration-100 hover:bg-foreground hover:text-background cursor-default"
              >
                <div className="text-lg sm:text-2xl font-display font-bold">{value}</div>
                <div className="text-[8px] sm:text-[9px] font-mono tracking-wider sm:tracking-widest uppercase mt-0.5 sm:mt-1 opacity-80">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

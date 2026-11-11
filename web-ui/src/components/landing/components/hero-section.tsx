"use client";

import { ArrowRight, ArrowDown, Sparkles, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HERO_TAGS } from "../data/landing-content";

export function HeroSection() {
  const scrollToGenerator = () => {
    document.getElementById("generator-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="container mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
      {/* Top Meta Status Bar */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 mb-8 pb-3 border-b border-border/60 w-full">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            v2.0 · Production Architecture Scaffolder
          </span>
        </div>
        <div className="hidden sm:block h-px flex-1 bg-border/40 mx-4" />
        <Badge variant="outline" className="text-[11px] font-mono border-brand/30 text-brand bg-brand/5 gap-1">
          <Sparkles className="h-3 w-3" />
          Zero-Config Topologies
        </Badge>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
        {/* Left Column: Heading, description, and CTAs */}
        <div className="lg:col-span-7 flex flex-col min-w-0">
          <div className="space-y-3">
            <span className="inline-block font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold">
              Platform Engineering &amp; IaC Automation
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-foreground">
              Scaffold Production{" "}
              <span className="text-brand-gradient">DevOps Infrastructure.</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-6 max-w-2xl">
            A production-grade architecture generator for mission-critical repositories. Configure CI/CD pipelines,
            cloud orchestration, observability, and compliance topologies—rendered into clean, deployable code in seconds.
          </p>

          {/* Technical Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            {HERO_TAGS.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs uppercase tracking-wider px-2.5 py-1 rounded-md border border-border/80 bg-muted/50 text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8 sm:mt-10">
            <Button
              size="lg"
              onClick={scrollToGenerator}
              className="gap-2.5 h-12 px-7 bg-brand hover:bg-brand/90 text-brand-foreground shadow-lg shadow-brand/25 font-semibold cursor-pointer"
            >
              Start Generating
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToGenerator}
              className="gap-2.5 h-12 px-7 border-border/80 hover:bg-accent cursor-pointer"
            >
              Explore Architecture
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Column: Architectural Manifest Terminal Box */}
        <div className="lg:col-span-5 pt-2 w-full min-w-0">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl shadow-black/40 overflow-hidden font-mono">
            {/* macOS/Linux Terminal Header */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
                </div>
                <Terminal className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-slate-300 ml-1 truncate">stack-manifest.yaml</span>
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest shrink-0 font-medium">UTF-8</span>
            </div>

            {/* Code Body: Syntax-highlighted style */}
            <div className="p-5 text-xs space-y-2.5 leading-relaxed bg-slate-950/90 overflow-x-auto">
              <p className="text-slate-500 pb-1 whitespace-nowrap"># SPECIFICATION : ENTERPRISE SUITE</p>
              <p className="flex justify-between gap-4 border-b border-slate-800/80 pb-1.5 whitespace-nowrap">
                <span className="text-slate-400">project_type:</span>
                <span className="text-cyan-400 font-semibold">enterprise-monorepo</span>
              </p>
              <p className="flex justify-between gap-4 border-b border-slate-800/80 pb-1.5 whitespace-nowrap">
                <span className="text-slate-400">ci_engine:</span>
                <span className="text-emerald-400">github-actions / parallel</span>
              </p>
              <p className="flex justify-between gap-4 border-b border-slate-800/80 pb-1.5 whitespace-nowrap">
                <span className="text-slate-400">infrastructure:</span>
                <span className="text-indigo-400">aws-vpc-eks-terraform</span>
              </p>
              <p className="flex justify-between gap-4 border-b border-slate-800/80 pb-1.5 whitespace-nowrap">
                <span className="text-slate-400">deployment:</span>
                <span className="text-amber-400 font-medium">blue-green-canary</span>
              </p>
              <p className="flex justify-between gap-4 border-b border-slate-800/80 pb-1.5 whitespace-nowrap">
                <span className="text-slate-400">observability:</span>
                <span className="text-teal-400">prometheus + grafana + otel</span>
              </p>
              <p className="flex justify-between gap-4 border-b border-slate-800/80 pb-1.5 whitespace-nowrap">
                <span className="text-slate-400">security_spec:</span>
                <span className="text-purple-400">nist-csf / trivy / cosign</span>
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 font-mono font-medium">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  STATUS: READY
                </span>
                <span className="text-cyan-400">● LIVE COMPILATION</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { value: "08", label: "Steps" },
              { value: "50+", label: "Manifests" },
              { value: "100%", label: "In-Browser" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl border border-border/80 bg-card/80 p-3 sm:p-4 text-center transition-all hover:border-brand/40 hover:shadow-sm"
              >
                <div className="text-xl sm:text-2xl font-bold text-foreground">{value}</div>
                <div className="text-[10px] sm:text-xs font-mono tracking-wider uppercase mt-0.5 text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

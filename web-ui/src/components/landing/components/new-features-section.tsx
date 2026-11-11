"use client";

import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NEW_FEATURE_CARDS, NEW_FEATURE_HIGHLIGHTS, type WorkspaceTab } from "../data/landing-content";
import { SectionHeader } from "./section-header";

interface NewFeaturesSectionProps {
  onNavigate: (tab: WorkspaceTab) => void;
}

export function NewFeaturesSection({ onNavigate }: NewFeaturesSectionProps) {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          badge="EXPANDED CAPABILITIES"
          title="Engineered for Precision"
          description="Six specialized in-browser utilities to design complex topologies, model cloud expenditure, verify compliance, and scaffold production repositories."
        />

        {/* Feature Cards Grid (Symmetric 3x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEW_FEATURE_CARDS.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.tab + feature.title}
                className="group relative rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:border-brand/40 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/25"
              >
                <div>
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-border/60">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      TOOL {`0${idx + 1}`}
                    </span>
                    <div className="w-10 h-10 rounded-xl border border-border/60 flex items-center justify-center bg-muted/60 group-hover:border-brand/30 group-hover:bg-brand/10 transition-colors">
                      <Icon className="h-4 w-4 text-brand" strokeWidth={1.8} />
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <ul className="space-y-2.5 mb-8 text-xs font-mono">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5">
                        <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" strokeWidth={2.5} />
                        <span className="text-muted-foreground font-sans">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2 text-xs font-semibold rounded-xl border-border/80 hover:bg-brand hover:text-brand-foreground hover:border-brand transition-all cursor-pointer"
                  onClick={() => onNavigate(feature.tab)}
                >
                  {feature.cta}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Highlight Stats Banner */}
        <div className="mt-12 sm:mt-16 rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 p-6 sm:p-10 shadow-2xl overflow-hidden w-full max-w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800 mb-8">
            <div className="text-center md:text-left">
              <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
                AUDIT METRICS &amp; BENCHMARKS
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Zero Configuration Bloat.
              </h3>
            </div>
            <p className="text-sm text-slate-400 max-w-md text-center md:text-right leading-relaxed">
              All infrastructure evaluations run deterministic algorithms inside your browser. No telemetry or external server calls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            {NEW_FEATURE_HIGHLIGHTS.map(({ value, label }, index) => (
              <div
                key={label}
                className={`text-center ${index > 0 ? "pt-6 sm:pt-0 sm:pl-6 lg:pl-8" : ""}`}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mb-1">
                  {value}
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

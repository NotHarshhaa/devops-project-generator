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
    <section className="border-y-2 border-foreground bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          badge="EXPANDED CAPABILITIES"
          title="Engineered for Precision"
          description="Three specialized local utilities to design complex topologies, model cloud expenditure, and analyze repository architecture."
        />

        {/* Feature Cards with Sharp 0px corners and Instant Invert on hover */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEW_FEATURE_CARDS.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.tab}
                className="group relative border border-foreground bg-card p-6 sm:p-8 flex flex-col justify-between transition-colors duration-100 hover:bg-foreground hover:text-background"
              >
                <div>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-foreground/20 group-hover:border-background/20">
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60">
                      TOOL {`0${idx + 1}`}
                    </span>
                    <div className="w-9 h-9 border border-foreground group-hover:border-background flex items-center justify-center bg-background group-hover:bg-foreground">
                      <Icon className="h-4 w-4 text-foreground group-hover:text-background" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
                  <p className="font-serif text-sm opacity-80 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <ul className="space-y-2.5 mb-8 font-mono text-xs">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="opacity-90">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2 font-mono text-xs uppercase tracking-widest border-foreground group-hover:border-background group-hover:bg-background group-hover:text-foreground hover:bg-background hover:text-foreground"
                  onClick={() => onNavigate(feature.tab)}
                >
                  {feature.cta}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Bold Choice #3: Inverted Stats Section with vertical line texture */}
        <div className="mt-14 relative border-2 border-foreground bg-foreground text-background p-8 sm:p-12 overflow-hidden">
          <div className="absolute inset-0 pattern-vertical-lines-white pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 pb-6 border-b border-background/20 mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest opacity-60">
                AUDIT METRICS & BENCHMARKS
              </span>
              <h3 className="font-display font-normal text-2xl sm:text-3xl text-background mt-1">
                Zero Configuration Bloat.
              </h3>
            </div>
            <p className="font-serif text-sm text-background/80 max-w-md md:text-right">
              All infrastructure evaluations run deterministic algorithms inside your browser. No telemetry or external server calls.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-background/20">
            {NEW_FEATURE_HIGHLIGHTS.map(({ value, label }, index) => (
              <div
                key={label}
                className={`text-center ${index > 0 ? "pt-6 sm:pt-0 sm:pl-8" : ""}`}
              >
                <div className="text-4xl sm:text-5xl font-display font-bold text-background mb-2">
                  {value}
                </div>
                <div className="font-mono text-xs uppercase tracking-widest text-background/70">
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

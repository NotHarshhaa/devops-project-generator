"use client";

import { Sparkles, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NEW_FEATURE_CARDS, NEW_FEATURE_HIGHLIGHTS, type WorkspaceTab } from "../data/landing-content";
import { SectionHeader } from "./section-header";

interface NewFeaturesSectionProps {
  onNavigate: (tab: WorkspaceTab) => void;
}

export function NewFeaturesSection({ onNavigate }: NewFeaturesSectionProps) {
  return (
    <section className="border-y border-border/60 bg-muted/10">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SectionHeader
          badge={
            <>
              <Sparkles className="h-3 w-3" />
              New in v2.0.0
            </>
          }
          title={
            <>
              Advanced tools for{" "}
              <span className="text-brand-gradient">modern DevOps</span>
            </>
          }
          description="Analyze, optimize, and track your projects with three powerful workspace tools — all running locally in your browser."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {NEW_FEATURE_CARDS.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.tab}
                className="group rounded-2xl border border-border/60 bg-card/50 overflow-hidden transition-all duration-300 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5"
              >
                <div className="p-5 sm:p-6">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconBg} border border-border/40 mb-4 transition-transform group-hover:scale-105`}
                  >
                    <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-2 mb-5">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2 text-xs">
                        <Check className="h-3.5 w-3.5 text-brand shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full gap-2 bg-brand hover:bg-brand/90 text-brand-foreground"
                    onClick={() => onNavigate(feature.tab)}
                  >
                    {feature.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {NEW_FEATURE_HIGHLIGHTS.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-brand/20 bg-brand/5 p-5 text-center transition-colors hover:border-brand/40"
            >
              <div className="text-2xl sm:text-3xl font-bold font-mono text-brand mb-1">{value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

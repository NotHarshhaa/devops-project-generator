"use client";

import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NEW_FEATURE_CARDS, NEW_FEATURE_HIGHLIGHTS, type WorkspaceTab } from "../data/landing-content";

interface NewFeaturesSectionProps {
  onNavigate: (tab: WorkspaceTab) => void;
}

export function NewFeaturesSection({ onNavigate }: NewFeaturesSectionProps) {
  return (
    <section className="container mx-auto max-w-5xl px-4 py-8 sm:py-16 border-y from-primary/5 to-background">
      <div className="text-center mb-6 sm:mb-10">
        <Badge className="mb-3 gap-1.5 px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
          <Sparkles className="h-3.5 w-3.5" />
          New in v2.0.0
        </Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          Advanced Features for{" "}
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Modern DevOps
          </span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Three powerful new features to analyze, optimize, and track your DevOps projects with real-time insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {NEW_FEATURE_CARDS.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.tab}
              className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.hoverGradient} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              <CardContent className="p-4 sm:p-6 relative">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
                <div className="space-y-2 mb-4">
                  {feature.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full gap-2" onClick={() => onNavigate(feature.tab)}>
                  {feature.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {NEW_FEATURE_HIGHLIGHTS.map(({ value, label }) => (
          <div key={label} className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary mb-1">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

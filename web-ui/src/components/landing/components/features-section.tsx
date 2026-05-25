import { Zap } from "lucide-react";
import { WHY_CHOOSE_FEATURES } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function FeaturesSection() {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <SectionHeader
        badge={
          <>
            <Zap className="h-3 w-3" />
            Why Choose This Tool
          </>
        }
        title={
          <>
            Everything you need to{" "}
            <span className="text-brand-gradient">ship faster</span>
          </>
        }
        description="Stop spending hours on boilerplate. Generate a complete, production-ready DevOps project in seconds."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {WHY_CHOOSE_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-2xl border border-border/60 bg-card/50 p-5 sm:p-6 transition-all duration-300 hover:border-brand/40 hover:shadow-md hover:shadow-brand/5"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.bg} border border-border/40 mb-4 transition-transform group-hover:scale-105`}
            >
              <feature.icon className={`h-5 w-5 ${feature.color}`} />
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-2">{feature.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

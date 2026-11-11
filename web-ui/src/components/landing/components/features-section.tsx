import { WHY_CHOOSE_FEATURES } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function FeaturesSection() {
  return (
    <section id="features-section" className="container mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
      <SectionHeader
        badge="CORE PRINCIPLES"
        title="Why Engineers Choose This Architecture"
        description="Eliminate guesswork and fragile boilerplate. Every generated file conforms to rigorous security, CI/CD, and infrastructure standards."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WHY_CHOOSE_FEATURES.map((feature, idx) => (
          <div
            key={feature.title}
            className="group relative rounded-2xl border border-border/80 bg-card p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:border-brand/40 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/25"
          >
            <div>
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-border/60">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  {`PRIN. 0${idx + 1}`}
                </span>
                <div className="w-10 h-10 rounded-xl border border-border/60 flex items-center justify-center bg-muted/60 group-hover:bg-brand/10 group-hover:border-brand/30 transition-colors">
                  <feature.icon className="h-4 w-4 text-brand" strokeWidth={1.8} />
                </div>
              </div>

              <h3 className="font-bold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-border/40 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>STANDARDS COMPLIANT</span>
              <span className="text-brand">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

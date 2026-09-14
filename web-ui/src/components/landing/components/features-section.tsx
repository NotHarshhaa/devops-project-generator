import { WHY_CHOOSE_FEATURES } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function FeaturesSection() {
  return (
    <section id="features-section" className="container mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
      <SectionHeader
        badge="DISCIPLINED PRINCIPLES"
        title="Why Engineers Choose This Architecture"
        description="Eliminate guesswork and fragile boilerplate. Every generated file conforms to rigorous security, CI/CD, and infrastructure standards."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WHY_CHOOSE_FEATURES.map((feature, idx) => (
          <div
            key={feature.title}
            className="group relative border border-foreground bg-card p-6 sm:p-8 transition-colors duration-100 hover:bg-foreground hover:text-background flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-foreground/20 group-hover:border-background/20">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                  {`PRIN. 0${idx + 1}`}
                </span>
                <div className="w-8 h-8 border border-foreground group-hover:border-background flex items-center justify-center bg-background group-hover:bg-foreground transition-colors duration-100">
                  <feature.icon className="h-4 w-4 text-foreground group-hover:text-background" strokeWidth={1.5} />
                </div>
              </div>

              <h3 className="font-display font-bold text-lg sm:text-xl mb-3">
                {feature.title}
              </h3>
              
              <p className="font-serif text-sm opacity-80 leading-relaxed">
                {feature.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-foreground/10 group-hover:border-background/20 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-80">
              <span>STANDARDS COMPLIANT</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { Badge } from "@/components/ui/badge";
import { TECH_OPTION_CATEGORIES } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function SupportedOptionsSection() {
  return (
    <section className="bg-background py-16 sm:py-24 w-full max-w-full overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          badge="COMPONENT CATALOGUE"
          title="Modular Infrastructure Matrix"
          description="Select from audited industry-standard building blocks. Every architectural tier is cross-compatible and production-tested."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECH_OPTION_CATEGORIES.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div
                key={category.title}
                className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all"
              >
                {/* Category Header */}
                <div className="px-5 py-4 border-b border-border/60 bg-muted/40 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl border border-border/60 bg-background flex items-center justify-center shrink-0 text-brand">
                      <CategoryIcon className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base text-foreground leading-tight truncate">
                        {category.title}
                      </h3>
                      <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5 truncate">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 space-y-2.5">
                  {category.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="group flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-3.5 py-2.5 transition-all hover:bg-brand/5 hover:border-brand/40"
                      >
                        <ItemIcon className="h-4 w-4 text-muted-foreground group-hover:text-brand shrink-0 transition-colors" strokeWidth={1.8} />
                        <span className="text-xs font-medium text-foreground flex-1 truncate">
                          {item.label}
                        </span>
                        {item.tag && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-2 py-0.5 font-mono shrink-0"
                          >
                            {item.tag}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

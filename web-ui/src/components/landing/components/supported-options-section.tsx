import { Badge } from "@/components/ui/badge";
import { TECH_OPTION_CATEGORIES } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function SupportedOptionsSection() {
  return (
    <section className="border-y-2 border-foreground bg-background py-16 sm:py-24 w-full max-w-full overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          badge="COMPONENT CATALOGUE"
          title="Modular Infrastructure Matrix"
          description="Select from audited industry-standard building blocks. Every architectural tier is cross-compatible and production-tested."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {TECH_OPTION_CATEGORIES.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div
                key={category.title}
                className="border border-foreground bg-card overflow-hidden"
              >
                {/* Category Header */}
                <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-foreground bg-muted flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 border border-foreground bg-background flex items-center justify-center shrink-0">
                      <CategoryIcon className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-sm sm:text-base text-foreground leading-tight truncate">
                        {category.title}
                      </h3>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 truncate">
                        {category.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs opacity-40 shrink-0 ml-2">§</span>
                </div>

                {/* Items List */}
                <div className="p-3 sm:p-4 space-y-2">
                  {category.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="group flex items-center gap-2.5 sm:gap-3 border border-foreground/30 bg-background px-3 py-2 sm:py-2.5 transition-colors duration-100 hover:bg-foreground hover:text-background"
                      >
                        <ItemIcon className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 shrink-0" strokeWidth={1.5} />
                        <span className="text-xs font-mono tracking-wide flex-1 truncate">
                          {item.label}
                        </span>
                        {item.tag && (
                          <Badge
                            variant="outline"
                            className="text-[9px] px-1.5 py-0 border-foreground/40 group-hover:border-background group-hover:text-background shrink-0"
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

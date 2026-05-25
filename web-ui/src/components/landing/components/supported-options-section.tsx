import { Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TECH_OPTION_CATEGORIES } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function SupportedOptionsSection() {
  return (
    <section className="border-y border-border/60 bg-muted/10">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <SectionHeader
          badge={
            <>
              <Settings2 className="h-3 w-3" />
              Supported Options
            </>
          }
          title={
            <>
              Fully configurable{" "}
              <span className="text-brand-gradient">tech stack</span>
            </>
          }
          description="Mix and match industry-standard tools. Every combination generates a working, best-practice project."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {TECH_OPTION_CATEGORIES.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div
                key={category.title}
                className="rounded-2xl border border-border/60 bg-card/50 overflow-hidden transition-colors hover:border-brand/30"
              >
                <div className="px-4 py-3 border-b border-border/60 bg-muted/30 flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${category.iconBg}`}>
                    <CategoryIcon className={`h-4 w-4 ${category.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{category.title}</h3>
                    <p className="text-[10px] text-muted-foreground">{category.subtitle}</p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {category.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-background/50 px-3 py-2.5 transition-colors hover:border-brand/25"
                      >
                        <ItemIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs font-medium font-mono">{item.label}</span>
                        {item.tag && (
                          <Badge
                            variant="outline"
                            className="ml-auto text-[9px] px-1.5 py-0 border-brand/30 text-brand"
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

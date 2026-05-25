import { Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TECH_OPTION_CATEGORIES } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function SupportedOptionsSection() {
  return (
    <section className="border-y bg-muted/20">
      <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
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
              <span className="bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent">
                tech stack
              </span>
            </>
          }
          description="Mix and match from industry-standard tools. Every combination generates a working, best-practice project."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {TECH_OPTION_CATEGORIES.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.title} className="rounded-xl border bg-card p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${category.iconBg}`}>
                    <CategoryIcon className={`h-4.5 w-4.5 ${category.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{category.title}</h3>
                    <p className="text-[11px] text-muted-foreground">{category.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {category.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2"
                      >
                        <ItemIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium">{item.label}</span>
                        {item.tag && (
                          <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0">
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

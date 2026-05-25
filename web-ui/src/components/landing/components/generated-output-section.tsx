import { FolderTree } from "lucide-react";
import { OUTPUT_HIGHLIGHTS, PROJECT_STRUCTURE } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function GeneratedOutputSection() {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <SectionHeader
        badge={
          <>
            <FolderTree className="h-3 w-3" />
            Generated Output
          </>
        }
        title={
          <>
            What you <span className="text-brand-gradient">get</span>
          </>
        }
        description="A complete, well-organized project structure following industry best practices."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="rounded-2xl border border-border/60 overflow-hidden shadow-lg dark:brand-glow">
          <div className="terminal-panel-header px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-amber-500/70" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-[11px] font-mono text-muted-foreground ml-2">project-structure</span>
          </div>
          <div className="terminal-panel p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed">
            <div className="text-brand font-semibold mb-2">my-devops-project/</div>
            {PROJECT_STRUCTURE.map((item) => (
              <div key={item.name} className="flex items-center gap-2 py-0.5">
                <span className="select-none shrink-0">
                  {"\u00A0".repeat(item.indent * 3)}
                  {item.icon}
                </span>
                <span className="terminal-accent font-medium">{item.name}</span>
                <span className="terminal-dim text-[10px] hidden sm:inline truncate">— {item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {OUTPUT_HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-2xl border border-border/60 bg-card/50 p-4 sm:p-5 transition-all hover:border-brand/30 hover:shadow-sm"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.bg} border border-border/40`}
              >
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

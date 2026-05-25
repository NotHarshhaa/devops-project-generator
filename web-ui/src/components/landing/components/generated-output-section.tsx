import { FolderTree } from "lucide-react";
import { OUTPUT_HIGHLIGHTS, PROJECT_STRUCTURE } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function GeneratedOutputSection() {
  return (
    <section className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <SectionHeader
        badge={
          <>
            <FolderTree className="h-3 w-3" />
            Generated Output
          </>
        }
        title={
          <>
            What you{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              get
            </span>
          </>
        }
        description="A complete, well-organized project structure following industry best practices."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b bg-muted/50 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-amber-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[11px] font-mono text-muted-foreground ml-2">project-structure</span>
          </div>
          <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-muted-foreground">
            <div className="text-foreground font-semibold">my-devops-project/</div>
            {PROJECT_STRUCTURE.map((item) => (
              <div key={item.name} className="flex items-center gap-2 py-0.5">
                <span className="select-none">
                  {"\u00A0".repeat(item.indent * 3)}
                  {item.icon}
                </span>
                <span className="text-foreground/80">{item.name}</span>
                <span className="text-muted-foreground/60 text-[10px] sm:text-xs hidden sm:inline">
                  — {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {OUTPUT_HIGHLIGHTS.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-xl border bg-card p-4 sm:p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.bg}`}>
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

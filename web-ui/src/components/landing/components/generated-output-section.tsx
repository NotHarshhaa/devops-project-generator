import { OUTPUT_HIGHLIGHTS, PROJECT_STRUCTURE } from "../data/landing-content";
import { SectionHeader } from "./section-header";

export function GeneratedOutputSection() {
  return (
    <section id="output-section" className="container mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
      <SectionHeader
        badge="ARTIFACT STRUCTURE"
        title="Predictable Repository Tree"
        description="A completely configured, self-documenting repository structure. Ready for immediate version control and automated execution."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start w-full">
        {/* Left Column: Sharp File Tree Terminal */}
        <div className="lg:col-span-7 border-2 border-foreground bg-background w-full overflow-hidden">
          <div className="px-4 py-2.5 sm:py-3 border-b-2 border-foreground bg-muted flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 border border-foreground bg-foreground" />
              <div className="w-2.5 h-2.5 border border-foreground bg-background" />
              <div className="w-2.5 h-2.5 border border-foreground bg-muted-foreground/40" />
              <span className="font-bold tracking-wider ml-1 truncate">repository-hierarchy</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">SCANNED</span>
          </div>

          <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-xs leading-relaxed bg-background overflow-x-auto">
            <div className="font-bold text-foreground mb-3 pb-1 border-b border-foreground/15 flex items-center justify-between whitespace-nowrap">
              <span>my-devops-project/</span>
              <span className="text-[10px] text-muted-foreground uppercase">ROOT DIRECTORY</span>
            </div>
            {PROJECT_STRUCTURE.map((item) => (
              <div key={item.name} className="flex items-center gap-2 py-0.5 group">
                <span className="select-none shrink-0 opacity-40">
                  {"\u00A0\u00A0".repeat(item.indent)}
                  {item.icon}
                </span>
                <span className="font-medium text-foreground underline-offset-2 group-hover:underline">
                  {item.name}
                </span>
                <span className="text-muted-foreground text-[11px] hidden sm:inline truncate opacity-70">
                  — {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Editorial Highlight Cards */}
        <div className="lg:col-span-5 space-y-4">
          {OUTPUT_HIGHLIGHTS.map((item, idx) => (
            <div
              key={item.title}
              className="group flex gap-4 border border-foreground bg-card p-5 transition-colors duration-100 hover:bg-foreground hover:text-background"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-foreground group-hover:border-background bg-background group-hover:bg-foreground">
                <item.icon className="h-4 w-4 text-foreground group-hover:text-background" strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base mb-1">
                    {item.title}
                  </h4>
                  <span className="font-mono text-[10px] opacity-50">
                    [0{idx + 1}]
                  </span>
                </div>
                <p className="font-serif text-xs sm:text-sm opacity-80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
